import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Firebase Admin SDK using REST API
// We can't use the official SDK in Deno, so we'll use the REST API directly
async function setCustomUserClaims(firebaseUid: string, claims: any) {
  const projectId = Deno.env.get('FIREBASE_PROJECT_ID');
  const clientEmail = Deno.env.get('FIREBASE_CLIENT_EMAIL');
  const privateKey = Deno.env.get('FIREBASE_PRIVATE_KEY');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin credentials');
  }

  // Create JWT for Firebase Admin authentication
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const payload = {
    iss: clientEmail,
    sub: clientEmail,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    iat: now,
    exp: now + 3600,
    uid: firebaseUid
  };

  // Use Web Crypto API to sign JWT
  const headerB64 = btoa(JSON.stringify(header));
  const payloadB64 = btoa(JSON.stringify(payload));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import private key
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = privateKey.replace(/\\n/g, '\n').replace(pemHeader, '').replace(pemFooter, '').trim();
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  // Sign the token
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsignedToken)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  const jwt = `${unsignedToken}.${signatureB64}`;

  // Use Firebase Admin API to set custom claims
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${Deno.env.get('FIREBASE_API_KEY')}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        localId: firebaseUid,
        customAttributes: JSON.stringify(claims)
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Firebase API error:', error);
    throw new Error(`Failed to set custom claims: ${error}`);
  }

  return await response.json();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firebaseUid, role } = await req.json();

    if (!firebaseUid) {
      return new Response(
        JSON.stringify({ error: 'firebaseUid is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Setting custom claims for user ${firebaseUid}, role: ${role || 'user'}`);

    // Verify role exists in Supabase (optional security check)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', firebaseUid)
      .single();

    if (roleError && roleError.code !== 'PGRST116') {
      console.error('Error fetching user role:', roleError);
    }

    // Use role from Supabase if it exists, otherwise use provided role or default to 'user'
    const finalRole = userRole?.role || role || 'user';

    console.log(`Final role to set: ${finalRole}`);

    // Set custom claims in Firebase
    await setCustomUserClaims(firebaseUid, { role: finalRole });

    console.log(`Successfully set custom claims for user ${firebaseUid}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Custom claims set successfully`,
        role: finalRole
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in set-firebase-custom-claims:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
