import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Shield, AlertTriangle } from "lucide-react";
import { JobVettingSystem, EmployerProfile, VerificationCheck } from "@/lib/jobVettingSystem";

interface EmployerVerificationFormProps {
  onVerificationComplete: (employer: EmployerProfile) => void;
}

export function EmployerVerificationForm({ onVerificationComplete }: EmployerVerificationFormProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    email: '',
    phone: '',
    linkedinUrl: ''
  });
  
  const [verificationStatus, setVerificationStatus] = useState<{
    checks: VerificationCheck[];
    warnings: string[];
    canProceed: boolean;
  }>({
    checks: [],
    warnings: [],
    canProceed: false
  });

  const [isVerifying, setIsVerifying] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation feedback
    if (field === 'email' && value) {
      const warnings = [];
      if (JobVettingSystem['isFreeEmailDomain'](value)) {
        warnings.push('Free email domains require manual review');
      }
      if (!JobVettingSystem['isBusinessEmailDomain'](value, formData.website)) {
        warnings.push('Email domain should match your business website');
      }
      setVerificationStatus(prev => ({ ...prev, warnings }));
    }
  };

  const runVerificationChecks = async () => {
    setIsVerifying(true);
    
    // Simulate verification process
    const checks = JobVettingSystem.generateVerificationChecklist(formData);
    
    // Simulate async verification results
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedChecks = checks.map(check => {
      switch (check.type) {
        case 'email':
          return { ...check, status: 'verified' as const };
        case 'website':
          return { 
            ...check, 
            status: formData.website ? 'verified' as const : 'failed' as const,
            details: formData.website ? 'Website accessible' : 'Invalid or inaccessible website'
          };
        case 'phone':
          return { 
            ...check, 
            status: JobVettingSystem['isValidPhoneNumber'](formData.phone) ? 'verified' as const : 'failed' as const 
          };
        case 'business':
          return { ...check, status: 'pending' as const, details: 'Manual review required' };
        case 'social':
          return { 
            ...check, 
            status: JobVettingSystem['isValidLinkedInUrl'](formData.linkedinUrl || '') ? 'verified' as const : 'failed' as const 
          };
        default:
          return check;
      }
    });

    const mockEmployer: EmployerProfile = {
      id: `emp_${Date.now()}`,
      businessName: formData.businessName,
      website: formData.website,
      email: formData.email,
      phone: formData.phone,
      linkedinUrl: formData.linkedinUrl,
      isVerified: updatedChecks.every(c => c.status === 'verified'),
      trustLevel: 75, // Initial trust level
      verificationHistory: updatedChecks,
      postingHistory: [],
      reportCount: 0,
      positiveRatings: 0,
      totalRatings: 0
    };

    setVerificationStatus({
      checks: updatedChecks,
      warnings: verificationStatus.warnings,
      canProceed: updatedChecks.filter(c => c.status === 'verified').length >= 2
    });
    
    setIsVerifying(false);
    
    if (updatedChecks.filter(c => c.status === 'verified').length >= 2) {
      onVerificationComplete(mockEmployer);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-500">Verified</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Employer Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Your registered business name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Company Website *</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourcompany.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Business Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@yourcompany.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Business Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn Company Page</Label>
            <Input
              id="linkedinUrl"
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
            />
          </div>

          {verificationStatus.warnings.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {verificationStatus.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={runVerificationChecks}
            disabled={!formData.businessName || !formData.website || !formData.email || isVerifying}
            className="w-full"
          >
            {isVerifying ? 'Verifying...' : 'Verify Business Information'}
          </Button>
        </CardContent>
      </Card>

      {verificationStatus.checks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {verificationStatus.checks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <p className="font-medium capitalize">{check.type} Verification</p>
                      {check.details && (
                        <p className="text-sm text-muted-foreground">{check.details}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
              ))}
            </div>

            {verificationStatus.canProceed && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Verification complete! You can now post jobs. Some verifications may still be pending but won't block your posting ability.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}