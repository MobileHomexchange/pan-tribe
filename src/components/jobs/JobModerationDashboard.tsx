import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Shield, 
  Eye,
  MessageSquare,
  Flag
} from "lucide-react";
import { JobPost, ApplicantReport } from "@/lib/jobVettingSystem";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockPendingJobs: JobPost[] = [
  {
    id: "job_1",
    employerId: "emp_1",
    title: "Remote Marketing Specialist",
    description: "Looking for someone to help with digital marketing campaigns. Must have experience with social media.",
    company: "StartupCorp",
    location: "Remote",
    salary: "$45,000 - $55,000",
    requirements: ["Marketing experience", "Social media skills"],
    tags: ["Marketing", "Remote", "Social Media"],
    contactEmail: "hr@startupcorp.com",
    status: "pending",
    trustScore: 65,
    flagReasons: ["New employer account", "Short job description"],
    reports: [],
    createdAt: new Date('2024-01-15')
  },
  {
    id: "job_2", 
    employerId: "emp_2",
    title: "Data Entry Clerk - High Pay!",
    description: "Easy work from home job. $500/hour guaranteed! Just need to process some payments for our clients.",
    company: "QuickCash LLC",
    location: "Remote",
    salary: "$500/hour",
    requirements: [],
    tags: ["Data Entry", "Work from Home"],
    contactEmail: "jobs@gmail.com",
    status: "pending",
    trustScore: 15,
    flagReasons: ["Contains scam keywords", "Unrealistic salary", "Free email domain", "Requests sensitive information"],
    reports: [
      {
        id: "report_1",
        jobId: "job_2",
        reporterId: "user_1",
        category: "scam",
        description: "This looks like a scam - way too high pay for simple work",
        severity: "high",
        timestamp: new Date('2024-01-14')
      }
    ],
    createdAt: new Date('2024-01-14')
  }
];

export function JobModerationDashboard() {
  const [pendingJobs, setPendingJobs] = useState<JobPost[]>(mockPendingJobs);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const { toast } = useToast();

  const handleJobAction = (jobId: string, action: 'approve' | 'reject', note?: string) => {
    setPendingJobs(prev => prev.filter(job => job.id !== jobId));
    
    const actionText = action === 'approve' ? 'approved' : 'rejected';
    toast({
      title: `Job ${actionText}`,
      description: `Job posting has been ${actionText} successfully.`
    });

    setSelectedJob(null);
    setReviewNote("");
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Medium Risk</Badge>;
      default:
        return <Badge variant="outline">Low Risk</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Job Moderation Dashboard</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {pendingJobs.length} Pending Reviews
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingJobs.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {pendingJobs.filter(job => job.trustScore < 30).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reported Jobs</p>
                <p className="text-2xl font-bold">
                  {pendingJobs.filter(job => job.reports.length > 0).length}
                </p>
              </div>
              <Flag className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Approved Today</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs Pending Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingJobs.map((job) => (
              <Card key={job.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <div className={`px-2 py-1 rounded-full text-sm font-medium ${getTrustScoreColor(job.trustScore)}`}>
                          Trust Score: {job.trustScore}/100
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{job.company} • {job.location}</p>
                      <p className="text-sm mb-3">{job.description.substring(0, 150)}...</p>
                      
                      {/* Flags */}
                      {job.flagReasons.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-red-600 mb-1">Issues Detected:</p>
                          <div className="flex flex-wrap gap-1">
                            {job.flagReasons.map((flag, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reports */}
                      {job.reports.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-orange-600 mb-1">
                            {job.reports.length} User Report(s)
                          </p>
                          {job.reports.map((report, index) => (
                            <div key={index} className="flex items-center gap-2">
                              {getSeverityBadge(report.severity)}
                              <span className="text-sm">{report.category}: {report.description}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedJob(job)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Job Review: {job.title}</DialogTitle>
                          </DialogHeader>
                          
                          {selectedJob && (
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList>
                                <TabsTrigger value="details">Job Details</TabsTrigger>
                                <TabsTrigger value="analysis">Trust Analysis</TabsTrigger>
                                <TabsTrigger value="reports">Reports ({job.reports.length})</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Job Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>Title:</strong> {selectedJob.title}</p>
                                      <p><strong>Company:</strong> {selectedJob.company}</p>
                                      <p><strong>Location:</strong> {selectedJob.location}</p>
                                      <p><strong>Salary:</strong> {selectedJob.salary}</p>
                                      <p><strong>Contact:</strong> {selectedJob.contactEmail}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Requirements & Tags</h4>
                                    <div className="space-y-2">
                                      <div>
                                        <p className="text-sm font-medium">Requirements:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {selectedJob.requirements.map((req, idx) => (
                                            <Badge key={idx} variant="outline">{req}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Tags:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {selectedJob.tags.map((tag, idx) => (
                                            <Badge key={idx} variant="secondary">{tag}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Job Description</h4>
                                  <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{selectedJob.description}</p>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="analysis" className="space-y-4">
                                <div className="text-center">
                                  <div className={`text-4xl font-bold mb-2 ${getTrustScoreColor(selectedJob.trustScore).split(' ')[0]}`}>
                                    {selectedJob.trustScore}/100
                                  </div>
                                  <p className="text-muted-foreground">Overall Trust Score</p>
                                  <Progress value={selectedJob.trustScore} className="mt-2" />
                                </div>
                                
                                {selectedJob.flagReasons.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-2 text-red-600">Issues Detected</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      {selectedJob.flagReasons.map((flag, idx) => (
                                        <li key={idx}>{flag}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </TabsContent>
                              
                              <TabsContent value="reports" className="space-y-4">
                                {selectedJob.reports.length > 0 ? (
                                  selectedJob.reports.map((report, idx) => (
                                    <Card key={idx}>
                                      <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                          {getSeverityBadge(report.severity)}
                                          <span className="text-sm text-muted-foreground">
                                            {report.timestamp.toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p className="font-medium capitalize">{report.category}</p>
                                        <p className="text-sm text-muted-foreground">{report.description}</p>
                                      </CardContent>
                                    </Card>
                                  ))
                                ) : (
                                  <p className="text-muted-foreground text-center py-8">No reports for this job.</p>
                                )}
                              </TabsContent>
                            </Tabs>
                          )}
                          
                          <div className="space-y-4 pt-4 border-t">
                            <div>
                              <label className="text-sm font-medium">Review Notes (optional)</label>
                              <Textarea
                                value={reviewNote}
                                onChange={(e) => setReviewNote(e.target.value)}
                                placeholder="Add any notes about your decision..."
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="flex justify-end gap-3">
                              <Button
                                variant="destructive"
                                onClick={() => handleJobAction(job.id, 'reject', reviewNote)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleJobAction(job.id, 'approve', reviewNote)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleJobAction(job.id, 'reject')}
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleJobAction(job.id, 'approve')}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {pendingJobs.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">No jobs pending review at the moment.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}