import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loading: boolean;
  userRole: string | null;
  isAdmin: boolean;
  roleLoading: boolean;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  async function refreshUserRole() {
    if (!currentUser) {
      setUserRole(null);
      setIsAdmin(false);
      setRoleLoading(false);
      return;
    }

    try {
      setRoleLoading(true);
      
      // Force token refresh to get latest custom claims
      await currentUser.getIdToken(true);
      const tokenResult = await currentUser.getIdTokenResult();
      const firebaseRole = tokenResult.claims.role as string | undefined;

      if (firebaseRole) {
        setUserRole(firebaseRole);
        setIsAdmin(firebaseRole === 'admin');
      } else {
        // Fallback to Supabase if no custom claims yet
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', currentUser.uid)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user');
          setIsAdmin(false);
        } else if (data) {
          setUserRole(data.role);
          setIsAdmin(data.role === 'admin');
          
          // Sync role to Firebase custom claims
          await supabase.functions.invoke('set-firebase-custom-claims', {
            body: { firebaseUid: currentUser.uid, role: data.role }
          });
        } else {
          // No role found, assign default user role
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert([{ user_id: currentUser.uid, role: 'user' }]);
          
          if (insertError) {
            console.error('Error creating user role:', insertError);
          }
          
          // Set custom claims for new user
          await supabase.functions.invoke('set-firebase-custom-claims', {
            body: { firebaseUid: currentUser.uid, role: 'user' }
          });
          
          setUserRole('user');
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Error in refreshUserRole:', error);
      setUserRole('user');
      setIsAdmin(false);
    } finally {
      setRoleLoading(false);
    }
  }

  async function register(email: string, password: string, displayName: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      displayName,
      email,
      photoURL: user.photoURL || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create default user role in Supabase
    await supabase
      .from('user_roles')
      .insert([{ user_id: user.uid, role: 'user' }]);

    // Set Firebase custom claims
    await supabase.functions.invoke('set-firebase-custom-claims', {
      body: { firebaseUid: user.uid, role: 'user' }
    });
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create default user role in Supabase
      await supabase
        .from('user_roles')
        .insert([{ user_id: user.uid, role: 'user' }]);

      // Set Firebase custom claims
      await supabase.functions.invoke('set-firebase-custom-claims', {
        body: { firebaseUid: user.uid, role: 'user' }
      });
    }
  }

  async function logout() {
    await signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // Fetch user role after auth state changes
      if (user) {
        await refreshUserRole();
      } else {
        setUserRole(null);
        setIsAdmin(false);
        setRoleLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loginWithGoogle,
    loading,
    userRole,
    isAdmin,
    roleLoading,
    refreshUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}