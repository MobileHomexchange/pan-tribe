import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  type BlogSubmission, 
  type ModerationStats, 
  type UserReputation,
  mockBlogSubmissions,
  mockModerationStats,
  mockUserReputations
} from "@/types/blogSubmission";
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  TrendingUp,
  Eye,
  MessageSquare,
  Flag,
  ExternalLink,
  BarChart3
} from "lucide-react";

export const ModerationDashboard = () => {
  const { toast } = useToast();
  const [submissions] = useState<BlogSubmission[]>(mockBlogSubmissions);
  const [stats] = useState<ModerationStats>(mockModerationStats);
  const [userReputations] = useState<UserReputation[]>(mockUserReputations);
  const [selectedSubmission, setSelectedSubmission] = useState<BlogSubmission | null>(null);
  const [moderationNotes, setModerationNotes] = useState("");

  const pendingSubmissions = submissions.filter(s => s.moderation.status === 'pending');
  const flaggedSubmissions = submissions.filter(s => 
    s.moderation.reason_codes.length > 0 || s.community_reports.length > 0
  );

  const handleModerationAction = (submissionId: string, action: 'approve' | 'reject', notes?: string) => {
    // In a real app, this would make an API call
    toast({
      title: `Submission ${action}d`,
      description: `Blog post has been ${action}d successfully.`,
    });
    setSelectedSubmission(null);
    setModerationNotes("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pending_review}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved_today}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged Content</p>
                <p className="text-2xl font-bold text-red-600">{stats.flagged_content}</p>
              </div>
              <Flag className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Review Time</p>
                <p className="text-2xl font-bold">{stats.avg_review_time}h</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({pendingSubmissions.length})</TabsTrigger>
          <TabsTrigger value="flagged">Flagged ({flaggedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
          <TabsTrigger value="users">User Reputation</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pending Review Queue
              </CardTitle>
              <CardDescription>Blog submissions awaiting moderation approval</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No submissions pending review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSubmissions.map((submission) => (
                    <Card key={submission.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{submission.title}</h3>
                              <Badge variant="secondary">{submission.category}</Badge>
                              <Badge variant={getStatusColor(submission.moderation.status)}>
                                {submission.moderation.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              By {submission.author} • {new Date(submission.timestamp).toLocaleDateString()}
                            </p>
                            <p className="text-sm mb-3 line-clamp-2">{submission.content}</p>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`font-medium ${getScoreColor(submission.platform_safety_score)}`}>
                                Safety Score: {submission.platform_safety_score}/100
                              </span>
                              <span className="text-muted-foreground">
                                User Reputation: {submission.user_reputation_score}/100
                              </span>
                              {submission.backlinks.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  {submission.backlinks.length} links
                                </span>
                              )}
                            </div>

                            {submission.moderation.reason_codes.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-red-600 mb-1">Flagged Issues:</p>
                                <div className="flex gap-1 flex-wrap">
                                  {submission.moderation.reason_codes.map((code) => (
                                    <Badge key={code} variant="destructive" className="text-xs">
                                      {code.replace('_', ' ')}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Flagged Content
              </CardTitle>
              <CardDescription>Content with validation issues or community reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flaggedSubmissions.map((submission) => (
                  <Card key={submission.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{submission.title}</h3>
                            <Badge variant={getStatusColor(submission.moderation.status)}>
                              {submission.moderation.status}
                            </Badge>
                          </div>
                          
                          {submission.community_reports.length > 0 && (
                            <Alert className="mb-3">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <div className="space-y-1">
                                  <p className="font-medium">Community Reports ({submission.community_reports.length}):</p>
                                  {submission.community_reports.map((report) => (
                                    <p key={report.id} className="text-sm">
                                      • {report.report_type}: {report.reason} (by {report.reporter_name})
                                    </p>
                                  ))}
                                </div>
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="flex items-center gap-4 text-sm">
                            <span className={`font-medium ${getScoreColor(submission.platform_safety_score)}`}>
                              Safety Score: {submission.platform_safety_score}/100
                            </span>
                            {submission.moderation.reason_codes.length > 0 && (
                              <div className="flex gap-1">
                                {submission.moderation.reason_codes.map((code) => (
                                  <Badge key={code} variant="destructive" className="text-xs">
                                    {code.replace('_', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>Complete history of blog submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{submission.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            By {submission.author} • {new Date(submission.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(submission.moderation.status)}>
                            {submission.moderation.status}
                          </Badge>
                          <span className={`text-sm font-medium ${getScoreColor(submission.platform_safety_score)}`}>
                            {submission.platform_safety_score}/100
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Reputation Management
              </CardTitle>
              <CardDescription>Monitor user behavior and reputation scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userReputations.map((user) => (
                  <Card key={user.user_id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{user.username}</h3>
                            <p className="text-sm text-muted-foreground">
                              {user.total_submissions} submissions • {user.approved_submissions} approved
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">Reputation:</span>
                            <Badge variant={user.reputation_score >= 75 ? "default" : user.reputation_score >= 50 ? "secondary" : "destructive"}>
                              {user.reputation_score}/100
                            </Badge>
                          </div>
                          <Progress value={user.reputation_score} className="w-24" />
                        </div>
                      </div>
                      
                      {user.badges.length > 0 && (
                        <div className="mt-3 flex gap-1 flex-wrap">
                          {user.badges.map((badge) => (
                            <Badge key={badge} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {user.restrictions.requires_manual_review && (
                        <Alert className="mt-3">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            This user requires manual review for all submissions.
                            {user.restrictions.banned_until && (
                              <span> Banned until {new Date(user.restrictions.banned_until).toLocaleDateString()}</span>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Moderation Review Modal */}
      {selectedSubmission && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-background shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Review Submission</CardTitle>
              <Button variant="ghost" onClick={() => setSelectedSubmission(null)}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{selectedSubmission.title}</h3>
              <p className="text-sm text-muted-foreground">
                By {selectedSubmission.author} • Category: {selectedSubmission.category}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Platform Safety Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(selectedSubmission.platform_safety_score)}`}>
                  {selectedSubmission.platform_safety_score}/100
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">User Reputation</p>
                <p className="text-2xl font-bold">{selectedSubmission.user_reputation_score}/100</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Content</p>
              <div className="bg-muted p-4 rounded-lg max-h-40 overflow-y-auto">
                <p className="text-sm">{selectedSubmission.content}</p>
              </div>
            </div>

            {selectedSubmission.backlinks.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Backlinks</p>
                <div className="space-y-1">
                  {selectedSubmission.backlinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <ExternalLink className="w-3 h-3" />
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Moderation Notes</p>
              <Textarea
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder="Add notes about your moderation decision..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => handleModerationAction(selectedSubmission.id, 'approve', moderationNotes)}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleModerationAction(selectedSubmission.id, 'reject', moderationNotes)}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};