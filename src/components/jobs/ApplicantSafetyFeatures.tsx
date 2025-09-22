import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Flag, 
  Star, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  EyeOff,
  MessageSquare
} from "lucide-react";
import { JobPost } from "@/lib/jobVettingSystem";
import { useToast } from "@/hooks/use-toast";

interface ApplicantSafetyFeaturesProps {
  job: JobPost;
  onReport: (report: any) => void;
  onRating: (rating: any) => void;
}

export function ApplicantSafetyFeatures({ job, onReport, onRating }: ApplicantSafetyFeaturesProps) {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [reportCategory, setReportCategory] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [userRating, setUserRating] = useState('');
  const [ratingComment, setRatingComment] = useState('');
  const { toast } = useToast();

  const handleRevealContact = () => {
    setShowContactInfo(true);
    toast({
      title: "Contact Information Revealed",
      description: "The employer can now see that you're interested in this position."
    });
  };

  const handleReport = () => {
    if (!reportCategory) {
      toast({
        title: "Error",
        description: "Please select a report category.",
        variant: "destructive"
      });
      return;
    }

    const report = {
      jobId: job.id,
      category: reportCategory,
      description: reportDescription,
      timestamp: new Date()
    };

    onReport(report);
    
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our platform safe. We'll review this job posting."
    });

    setReportCategory('');
    setReportDescription('');
  };

  const handleRatingSubmit = () => {
    if (!userRating) {
      toast({
        title: "Error", 
        description: "Please select a rating.",
        variant: "destructive"
      });
      return;
    }

    const rating = {
      jobId: job.id,
      rating: userRating,
      comment: ratingComment,
      timestamp: new Date()
    };

    onRating(rating);
    
    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback! This helps us improve job quality."
    });

    setUserRating('');
    setRatingComment('');
  };

  const getTrustScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-500"><Shield className="w-3 h-3 mr-1" />Verified Employer</Badge>;
    } else if (score >= 50) {
      return <Badge variant="secondary"><Shield className="w-3 h-3 mr-1" />Standard Check</Badge>;
    } else {
      return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Use Caution</Badge>;
    }
  };

  const getSafetyTips = (score: number) => {
    if (score < 50) {
      return [
        "Be extra cautious with this job posting",
        "Never pay any fees upfront",
        "Don't share sensitive personal information",
        "Verify the company independently",
        "Meet in a public place if interviewing in person"
      ];
    } else if (score < 80) {
      return [
        "Exercise normal caution",
        "Verify job details during the interview",
        "Don't share sensitive information until you're hired",
        "Research the company online"
      ];
    } else {
      return [
        "This appears to be a legitimate opportunity",
        "Company has been verified by our system",
        "Still use standard job-seeking caution"
      ];
    }
  };

  return (
    <div className="space-y-4">
      {/* Trust Score Display */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Safety Information</h4>
              {getTrustScoreBadge(job.trustScore)}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{job.trustScore}/100</div>
              <div className="text-sm text-muted-foreground">Trust Score</div>
            </div>
          </div>
          
          {/* Safety Tips */}
          <Alert className={job.trustScore < 50 ? "border-red-500 bg-red-50" : ""}>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Safety Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {getSafetyTips(job.trustScore).map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Contact Information Protection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Contact Information</h4>
            {showContactInfo ? (
              <Badge variant="outline"><Eye className="w-3 h-3 mr-1" />Visible</Badge>
            ) : (
              <Badge variant="secondary"><EyeOff className="w-3 h-3 mr-1" />Protected</Badge>
            )}
          </div>
          
          {showContactInfo ? (
            <div className="space-y-2">
              <p><strong>Email:</strong> {job.contactEmail}</p>
              {job.contactPhone && <p><strong>Phone:</strong> {job.contactPhone}</p>}
              {job.website && <p><strong>Website:</strong> {job.website}</p>}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Contact details are hidden to protect your privacy. Click below to reveal and indicate your interest.
              </p>
              <Button onClick={handleRevealContact} className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Reveal Contact Info & Apply
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* Report Job */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Flag className="w-4 h-4 mr-2" />
              Report Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Job Posting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>What's wrong with this job posting?</Label>
                <RadioGroup value={reportCategory} onValueChange={setReportCategory} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scam" id="scam" />
                    <Label htmlFor="scam">Scam or fraudulent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="spam" id="spam" />
                    <Label htmlFor="spam">Spam or duplicate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="misleading" id="misleading" />
                    <Label htmlFor="misleading">Misleading information</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="offensive" id="offensive" />
                    <Label htmlFor="offensive">Offensive content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fake_company" id="fake_company" />
                    <Label htmlFor="fake_company">Fake company</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="report-description">Additional details (optional)</Label>
                <Textarea
                  id="report-description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Provide more details about the issue..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReportCategory('')}>
                  Cancel
                </Button>
                <Button onClick={handleReport} disabled={!reportCategory}>
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Rate Job Experience */}
        {showContactInfo && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 mr-2" />
                Rate Experience
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate Your Experience</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>How was your experience with this job posting?</Label>
                  <RadioGroup value={userRating} onValueChange={setUserRating} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="legitimate" id="legitimate" />
                      <Label htmlFor="legitimate">✅ Legitimate opportunity</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="suspicious" id="suspicious" />
                      <Label htmlFor="suspicious">⚠️ Seemed suspicious</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scam" id="scam-rating" />
                      <Label htmlFor="scam-rating">❌ Definitely a scam</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="rating-comment">Comments (optional)</Label>
                  <Textarea
                    id="rating-comment"
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder="Share your experience to help other job seekers..."
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setUserRating('')}>
                    Cancel
                  </Button>
                  <Button onClick={handleRatingSubmit} disabled={!userRating}>
                    Submit Rating
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}