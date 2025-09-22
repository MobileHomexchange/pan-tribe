import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  X,
  Eye,
  TrendingUp,
  Shield,
  Users
} from "lucide-react";

export function JobListingWorkflow() {
  const steps = [
    {
      id: 1,
      title: "Job Submission",
      description: "Employer submits job listing with required details",
      icon: CheckCircle,
      status: "active",
      details: [
        "Form validation & completeness check",
        "Employer verification status review",
        "Content quality assessment"
      ]
    },
    {
      id: 2,
      title: "Automated Scoring",
      description: "AI calculates visibility score using weighted algorithm",
      icon: TrendingUp,
      status: "processing",
      details: [
        "Trust Score (30%) - Employer reputation & verification",
        "Freshness Score (20%) - Posting recency",
        "Relevance Score (25%) - Content completeness & quality",
        "Engagement Score (15%) - User interactions",
        "Quality Score (10%) - Spam detection & flags"
      ]
    },
    {
      id: 3,
      title: "Score-Based Routing",
      description: "Jobs are routed based on calculated visibility score",
      icon: Eye,
      status: "routing",
      details: [
        "High Score (8.0+) → Immediate feed placement",
        "Medium Score (5.0-7.9) → Moderation queue",
        "Low Score (<5.0) → Blocked or revision request"
      ]
    },
    {
      id: 4,
      title: "Community Interaction",
      description: "Users engage with job listings in the feed",
      icon: Users,
      status: "live",
      details: [
        "Clicks, saves, and applications tracked",
        "Engagement data feeds back into scoring",
        "Real-time score adjustments"
      ]
    },
    {
      id: 5,
      title: "Moderation & Review",
      description: "Admin oversight for quality control",
      icon: Shield,
      status: "ongoing",
      details: [
        "Flagged jobs reviewed by moderators",
        "Employer reputation updates",
        "System performance monitoring"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "routing": return "bg-yellow-100 text-yellow-800";
      case "live": return "bg-purple-100 text-purple-800";
      case "ongoing": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle;
      case "processing": return Clock;
      case "routing": return Eye;
      case "live": return TrendingUp;
      case "ongoing": return Shield;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Job Listing Exposure Algorithm Workflow</h2>
        <p className="text-muted-foreground">
          Automated system for intelligent job ranking and visibility optimization
        </p>
      </div>

      {/* Workflow Steps */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const StatusIcon = getStatusIcon(step.status);
          
          return (
            <div key={step.id} className="relative">
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <StepIcon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Step {step.id}
                      </span>
                    </div>
                    <Badge className={getStatusColor(step.status)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {step.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {step.description}
                  </p>
                  
                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow between steps (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="bg-background border rounded-full p-1">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Algorithm Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Scoring Weights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Employer Trust</span>
              <Badge variant="outline">30%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Relevance & Quality</span>
              <Badge variant="outline">25%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Post Freshness</span>
              <Badge variant="outline">20%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">User Engagement</span>
              <Badge variant="outline">15%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Content Quality</span>
              <Badge variant="outline">10%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safety Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Spam detection algorithms</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Employer verification system</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Community flagging & reporting</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Reputation-based ranking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Automated moderation queue</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">98.5%</div>
              <div className="text-sm text-muted-foreground">Spam Detection Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2.3x</div>
              <div className="text-sm text-muted-foreground">Engagement Increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">45%</div>
              <div className="text-sm text-muted-foreground">Application Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.8/5</div>
              <div className="text-sm text-muted-foreground">User Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}