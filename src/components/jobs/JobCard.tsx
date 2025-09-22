import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  Share2, 
  Eye, 
  Star,
  Shield,
  Building2,
  Users
} from "lucide-react";
import { JobListing } from "@/types/jobs";
import { formatDistanceToNow } from "date-fns";
import { JobListingAlgorithm } from "@/lib/jobListingAlgorithm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface JobCardProps {
  job: JobListing;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  onShare?: (jobId: string) => void;
  showAnalytics?: boolean;
}

export function JobCard({ 
  job, 
  onApply, 
  onSave, 
  onShare, 
  showAnalytics = false 
}: JobCardProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const visibilityScore = JobListingAlgorithm.calculateVisibilityScore(job);
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Salary not disclosed";
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technology: "bg-blue-100 text-blue-800",
      healthcare: "bg-green-100 text-green-800",
      finance: "bg-yellow-100 text-yellow-800",
      education: "bg-purple-100 text-purple-800",
      marketing: "bg-pink-100 text-pink-800",
      sales: "bg-orange-100 text-orange-800",
      consulting: "bg-indigo-100 text-indigo-800",
      default: "bg-gray-100 text-gray-800"
    };
    return colors[category] || colors.default;
  };

  const handleClick = async () => {
    // Track click engagement
    try {
      await supabase
        .from('job_listings')
        .update({ clicks: job.clicks + 1 })
        .eq('id', job.id);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleApply = async () => {
    if (!onApply) return;
    
    setIsApplying(true);
    try {
      await onApply(job.id);
      
      // Track application engagement
      await supabase
        .from('job_listings')
        .update({ applications: job.applications + 1 })
        .eq('id', job.id);
        
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(job.id);
      
      // Track save engagement
      await supabase
        .from('job_listings')
        .update({ saves: job.saves + 1 })
        .eq('id', job.id);
        
      toast.success("Job saved to your list!");
    } catch (error) {
      toast.error("Failed to save job");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!onShare) return;
    
    try {
      await onShare(job.id);
      
      // Track share engagement
      await supabase
        .from('job_listings')
        .update({ shares: job.shares + 1 })
        .eq('id', job.id);
        
      toast.success("Job shared successfully!");
    } catch (error) {
      toast.error("Failed to share job");
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleClick}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {job.employer_profile?.company_name?.slice(0, 2).toUpperCase() || 'CO'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{job.job_title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{job.employer_profile?.company_name}</span>
                {job.employer_profile?.verified && (
                  <Shield className="h-4 w-4 text-green-600" />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {job.featured && (
              <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {showAnalytics && (
              <Badge variant="outline" className="text-xs">
                Score: {visibilityScore.total_score.toFixed(1)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Job Details */}
        <div className="flex flex-wrap gap-2">
          <Badge className={getCategoryColor(job.category)}>
            {job.category.charAt(0).toUpperCase() + job.category.slice(1)}
          </Badge>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
            {job.remote_option && (
              <Badge variant="outline" className="ml-2 text-xs">Remote</Badge>
            )}
          </div>
        </div>

        {/* Salary and Time */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <DollarSign className="h-4 w-4" />
            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Job Description Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.job_description}
        </p>

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        {showAnalytics && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{job.clicks} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="h-3 w-3" />
              <span>{job.saves} saves</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{job.applications} applications</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            disabled={isSaving}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleApply();
          }}
          disabled={isApplying}
          className="ml-auto"
        >
          {isApplying ? "Applying..." : "Apply Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}