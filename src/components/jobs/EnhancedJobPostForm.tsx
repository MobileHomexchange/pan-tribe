import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { JobVettingSystem, JobPost, EmployerProfile, TrustScoreFactors } from "@/lib/jobVettingSystem";
import { useToast } from "@/hooks/use-toast";

interface EnhancedJobPostFormProps {
  employer: EmployerProfile;
  onJobSubmit: (jobPost: JobPost) => void;
  onCancel: () => void;
}

export function EnhancedJobPostForm({ employer, onJobSubmit, onCancel }: EnhancedJobPostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    jobType: '',
    requirements: '',
    tags: '',
    contactEmail: employer.email,
    contactPhone: employer.phone || '',
    website: employer.website
  });

  const [trustAnalysis, setTrustAnalysis] = useState<{
    score: number;
    factors: TrustScoreFactors;
    flags: string[];
    status: 'approved' | 'pending' | 'rejected';
  } | null>(null);

  const [realTimeWarnings, setRealTimeWarnings] = useState<string[]>([]);
  const { toast } = useToast();

  // Real-time content analysis
  useEffect(() => {
    if (formData.description || formData.salary) {
      const warnings: string[] = [];
      
      // Check for scam content
      if (JobVettingSystem['containsScamKeywords'](formData.description)) {
        warnings.push('Content contains potential scam keywords');
      }
      
      if (JobVettingSystem['requestsSensitiveInfo'](formData.description)) {
        warnings.push('Content requests sensitive personal information');
      }
      
      if (formData.salary && !JobVettingSystem['isRealisticSalary'](formData.salary)) {
        warnings.push('Salary range appears unrealistic');
      }
      
      if (formData.description.length < 50) {
        warnings.push('Job description is too short for proper evaluation');
      }
      
      setRealTimeWarnings(warnings);
    }
  }, [formData.description, formData.salary]);

  const calculateTrustScore = () => {
    const jobPost: Partial<JobPost> = {
      title: formData.title,
      description: formData.description,
      salary: formData.salary,
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean),
      contactEmail: formData.contactEmail
    };

    const analysis = JobVettingSystem.calculateTrustScore(jobPost, employer);
    const status = JobVettingSystem.determineJobStatus(analysis.score);
    
    setTrustAnalysis({
      ...analysis,
      status
    });

    return { ...analysis, status };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const analysis = calculateTrustScore();
    
    const jobPost: JobPost = {
      id: `job_${Date.now()}`,
      employerId: employer.id,
      title: formData.title,
      description: formData.description,
      company: employer.businessName,
      location: formData.location,
      salary: formData.salary,
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      website: formData.website,
      status: analysis.status,
      trustScore: analysis.score,
      flagReasons: analysis.flags,
      reports: [],
      createdAt: new Date()
    };

    // Show appropriate message based on status
    switch (analysis.status) {
      case 'approved':
        toast({
          title: "Job Posted Successfully!",
          description: "Your job posting is now live and visible to candidates."
        });
        break;
      case 'pending':
        toast({
          title: "Job Submitted for Review",
          description: "Your job posting will be reviewed within 24 hours. You'll be notified once it's approved."
        });
        break;
      case 'rejected':
        toast({
          title: "Job Posting Rejected",
          description: "Your job posting didn't meet our safety standards. Please review and try again.",
          variant: "destructive"
        });
        return; // Don't submit rejected posts
    }

    onJobSubmit(jobPost);
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrustScoreBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Auto-Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Shield className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Lagos, Nigeria or Remote"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                placeholder="e.g. ₦250,000 - ₦400,000 per month"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                placeholder="Describe the responsibilities, requirements, and benefits of the position. Be detailed and specific."
                required
              />
              <div className="text-sm text-muted-foreground">
                {formData.description.length}/100+ characters (minimum recommended)
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (comma separated)</Label>
              <Input
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="e.g. Bachelor's degree, 3+ years experience, React expertise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Skills/Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g. React, JavaScript, CSS, Node.js"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Real-time Safety Warnings */}
        {realTimeWarnings.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Content Safety Warnings:</p>
                <ul className="list-disc list-inside space-y-1">
                  {realTimeWarnings.map((warning, index) => (
                    <li key={index} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Trust Score Preview */}
        {trustAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Trust Score Analysis
                {getTrustScoreBadge(trustAnalysis.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Overall Trust Score</span>
                  <span className={`text-2xl font-bold ${getTrustScoreColor(trustAnalysis.score)}`}>
                    {trustAnalysis.score}/100
                  </span>
                </div>
                <Progress value={trustAnalysis.score} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{trustAnalysis.factors.employerVerification}</div>
                  <div className="text-sm text-muted-foreground">Employer Verification</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{trustAnalysis.factors.jobPostQuality}</div>
                  <div className="text-sm text-muted-foreground">Post Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{trustAnalysis.factors.historyReputation}</div>
                  <div className="text-sm text-muted-foreground">History & Reputation</div>
                </div>
              </div>

              {trustAnalysis.flags.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-red-600">Issues Detected:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {trustAnalysis.flags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="secondary" onClick={calculateTrustScore}>
            Preview Trust Score
          </Button>
          <Button type="submit" disabled={realTimeWarnings.some(w => w.includes('scam') || w.includes('sensitive'))}>
            Submit Job Posting
          </Button>
        </div>
      </form>
    </div>
  );
}