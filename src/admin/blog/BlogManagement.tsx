import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogSubmissionForm } from "@/components/blog/BlogSubmissionForm";
import { ModerationDashboard } from "@/components/blog/ModerationDashboard";
import { BlogWorkflowDiagram } from "@/components/blog/BlogWorkflowDiagram";
import { useToast } from "@/hooks/use-toast";
import { type BlogSubmission } from "@/types/blogSubmission";
import { BlogValidationSystem } from "@/lib/blogValidationSystem";

const BlogManagement = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmission = async (submission: Partial<BlogSubmission>) => {
    setIsSubmitting(true);
    
    try {
      // Validate the submission
      const validationResult = await BlogValidationSystem.validateSubmission(submission);
      
      // Determine moderation status
      const userReputation = 75; // This would come from user context
      const isFirstSubmission = false; // This would come from user history
      const moderationStatus = BlogValidationSystem.determineModerationStatus(
        validationResult.score,
        userReputation,
        isFirstSubmission
      );

      // Create full submission object
      const fullSubmission: BlogSubmission = {
        id: `blog_${Date.now()}`,
        title: submission.title!,
        content: submission.content!,
        backlinks: submission.backlinks || [],
        author: submission.author || "Current User",
        authorId: submission.authorId || "user_current",
        category: submission.category!,
        featured_image: submission.featured_image,
        timestamp: submission.timestamp || new Date().toISOString(),
        checklist: submission.checklist!,
        platform_safety_score: validationResult.score,
        moderation: {
          status: moderationStatus,
          reason_codes: validationResult.flags,
          admin_notes: validationResult.suggestions.join('; ')
        },
        user_reputation_score: userReputation,
        community_reports: [],
        badges: validationResult.score >= 80 ? ["Safe for Social Sharing"] : []
      };

      // In a real app, this would be an API call
      console.log('Submitting blog:', fullSubmission);

      // Show appropriate success message based on status
      if (moderationStatus === 'approved') {
        toast({
          title: "Blog Submitted Successfully!",
          description: "Your blog has been auto-approved and is ready for social sharing.",
        });
      } else if (moderationStatus === 'pending') {
        toast({
          title: "Blog Submitted for Review",
          description: "Your blog is in the moderation queue and will be reviewed soon.",
        });
      } else {
        toast({
          title: "Submission Issues Found",
          description: "Please address the highlighted issues and resubmit.",
          variant: "destructive"
        });
      }

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your blog. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Blog Management</h1>
        <p className="text-muted-foreground">
          Manage blog submissions and moderation for the TribalPulse community.
        </p>
      </div>

      <Tabs defaultValue="moderation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="moderation">Moderation Queue</TabsTrigger>
          <TabsTrigger value="submit">Submit Blog</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="space-y-6">
          <ModerationDashboard />
        </TabsContent>

        <TabsContent value="submit" className="space-y-6">
          <BlogSubmissionForm 
            onSubmit={handleSubmission}
            isLoading={isSubmitting}
          />
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <BlogWorkflowDiagram />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogManagement;