import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { BlogValidationSystem } from "@/lib/blogValidationSystem";
import { 
  type BlogSubmission, 
  type BlogCategory, 
  type BlogSubmissionChecklist,
  type ValidationResult 
} from "@/types/blogSubmission";
import { 
  FileText, 
  Link, 
  Image, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  Clock,
  ExternalLink,
  Plus,
  X
} from "lucide-react";

interface BlogSubmissionFormProps {
  onSubmit: (submission: Partial<BlogSubmission>) => void;
  isLoading?: boolean;
}

interface FormData {
  title: string;
  content: string;
  category: BlogCategory;
  featured_image: string;
  backlinks: string[];
}

export const BlogSubmissionForm = ({ onSubmit, isLoading = false }: BlogSubmissionFormProps) => {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<BlogSubmissionChecklist>({
    original_content: false,
    family_safe: false,
    accurate: false,
    links_safe: false,
    headline_not_clickbait: false,
    social_platform_compliant: false,
    community_value: false
  });
  
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [currentBacklink, setCurrentBacklink] = useState("");
  const [backlinks, setBacklinks] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      category: "Guide",
      featured_image: "",
      backlinks: []
    }
  });

  const watchedValues = watch();

  const checklistItems = [
    { 
      key: 'original_content' as keyof BlogSubmissionChecklist, 
      label: "Content is original and not plagiarized",
      description: "Ensure all content is your own work or properly attributed"
    },
    { 
      key: 'family_safe' as keyof BlogSubmissionChecklist, 
      label: "Content is family-safe and appropriate",
      description: "No adult, violent, hateful, or discriminatory material"
    },
    { 
      key: 'accurate' as keyof BlogSubmissionChecklist, 
      label: "Information is accurate and truthful",
      description: "All facts are verified and sources are cited when needed"
    },
    { 
      key: 'links_safe' as keyof BlogSubmissionChecklist, 
      label: "All backlinks are safe and legitimate",
      description: "Links point to reputable, trustworthy websites"
    },
    { 
      key: 'headline_not_clickbait' as keyof BlogSubmissionChecklist, 
      label: "Headline is not misleading or clickbait",
      description: "Title accurately represents the content"
    },
    { 
      key: 'social_platform_compliant' as keyof BlogSubmissionChecklist, 
      label: "Content complies with social platform rules",
      description: "Meets guidelines for Facebook, Instagram, TikTok, WeChat"
    },
    { 
      key: 'community_value' as keyof BlogSubmissionChecklist, 
      label: "Content provides value to the diaspora community",
      description: "Educational, cultural, or business-focused content"
    }
  ];

  const handleChecklistChange = (key: keyof BlogSubmissionChecklist, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  // Zod schema for URL validation
  const backlinkSchema = z.object({
    url: z.string()
      .url('Invalid URL format')
      .regex(/^https?:\/\//, 'Only HTTP(S) URLs allowed')
      .max(2048, 'URL too long')
      .refine(
        (url) => {
          try {
            const parsed = new URL(url);
            // Block dangerous protocols
            const dangerousProtocols = ['javascript', 'data', 'file', 'vbscript'];
            if (dangerousProtocols.includes(parsed.protocol.replace(':', ''))) {
              return false;
            }
            // Block localhost/private IPs
            const hostname = parsed.hostname;
            if (hostname === 'localhost' || 
                hostname.startsWith('127.') ||
                hostname.startsWith('10.') ||
                hostname.startsWith('192.168.')) {
              return false;
            }
            return true;
          } catch {
            return false;
          }
        },
        'Unsafe or invalid URL'
      )
  });

  const addBacklink = () => {
    try {
      // Validate URL
      backlinkSchema.parse({ url: currentBacklink.trim() });
      
      if (!backlinks.includes(currentBacklink.trim())) {
        const newBacklinks = [...backlinks, currentBacklink.trim()];
        setBacklinks(newBacklinks);
        setValue('backlinks', newBacklinks);
        setCurrentBacklink("");
        
        toast({
          title: 'Backlink added',
          description: 'URL will be verified during moderation'
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Invalid URL',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      }
    }
  };

  const removeBacklink = (index: number) => {
    const newBacklinks = backlinks.filter((_, i) => i !== index);
    setBacklinks(newBacklinks);
    setValue('backlinks', newBacklinks);
  };

  const validateContent = async () => {
    setIsValidating(true);
    try {
      const submission: Partial<BlogSubmission> = {
        title: watchedValues.title,
        content: watchedValues.content,
        backlinks: backlinks,
        category: watchedValues.category,
        featured_image: watchedValues.featured_image
      };

      const result = await BlogValidationSystem.validateSubmission(submission);
      setValidationResult(result);

      if (result.score >= 80) {
        toast({
          title: "Content Validation Passed",
          description: "Your content looks great and is ready for submission!",
        });
      } else if (result.score >= 60) {
        toast({
          title: "Content Needs Review",
          description: "Your content will require manual moderation.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Content Issues Found",
          description: "Please address the issues before submitting.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Unable to validate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const isChecklistComplete = Object.values(checklist).every(value => value === true);
  const canSubmit = isChecklistComplete && watchedValues.title && watchedValues.content;

  const onFormSubmit = (data: FormData) => {
    if (!isChecklistComplete) {
      toast({
        title: "Checklist Incomplete",
        description: "Please complete all checklist items before submitting.",
        variant: "destructive"
      });
      return;
    }

    const submission: Partial<BlogSubmission> = {
      ...data,
      backlinks,
      checklist,
      author: "Current User", // This would come from auth context
      authorId: "user_current", // This would come from auth context
      timestamp: new Date().toISOString()
    };

    onSubmit(submission);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Submit Blog Post & Backlinks
          </CardTitle>
          <CardDescription>
            Share your story with the TribalPulse community. All submissions are reviewed for quality and safety.
          </CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Blog Title *</label>
              <Input
                {...register("title", { required: "Title is required" })}
                placeholder="Enter a descriptive title for your blog post"
                className="w-full"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category *</label>
              <Select 
                value={watchedValues.category} 
                onValueChange={(value) => setValue('category', value as BlogCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cultural Story">Cultural Story</SelectItem>
                  <SelectItem value="Business Feature">Business Feature</SelectItem>
                  <SelectItem value="Guide">Guide</SelectItem>
                  <SelectItem value="News">News</SelectItem>
                  <SelectItem value="Educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Featured Image (Optional)</label>
              <Input
                {...register("featured_image")}
                placeholder="https://example.com/image.jpg"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium mb-2 block">Blog Content *</label>
              <Textarea
                {...register("content", { 
                  required: "Content is required",
                  minLength: { value: 200, message: "Content must be at least 200 characters" }
                })}
                placeholder="Write your blog content here. Minimum 200 characters for quality content."
                className="min-h-[300px] w-full"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-muted-foreground">
                  {watchedValues.content?.length || 0} / 200 minimum characters
                </p>
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backlinks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link className="w-5 h-5" />
              Backlinks (Optional)
            </CardTitle>
            <CardDescription>
              Add relevant, high-quality links that support your content. All links will be verified for safety.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={currentBacklink}
                onChange={(e) => setCurrentBacklink(e.target.value)}
                placeholder="https://example.com/relevant-article"
                className="flex-1"
              />
              <Button type="button" onClick={addBacklink} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {backlinks.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Added Backlinks:</p>
                {backlinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm truncate">{link}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBacklink(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5" />
              Content Validation
            </CardTitle>
            <CardDescription>
              Check your content for quality and platform compliance before submitting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              onClick={validateContent}
              disabled={!watchedValues.title || !watchedValues.content || isValidating}
              variant="outline"
              className="w-full"
            >
              {isValidating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Validating Content...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Validate Content
                </>
              )}
            </Button>

            {validationResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Platform Safety Score</span>
                  <Badge variant={validationResult.score >= 80 ? "default" : validationResult.score >= 60 ? "secondary" : "destructive"}>
                    {validationResult.score}/100
                  </Badge>
                </div>
                <Progress value={validationResult.score} className="w-full" />

                {validationResult.safe_for_platforms.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Safe for Platforms:</p>
                    <div className="flex gap-2 flex-wrap">
                      {validationResult.safe_for_platforms.map((platform) => (
                        <Badge key={platform} variant="outline">{platform}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.suggestions.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">Suggestions for improvement:</p>
                        {validationResult.suggestions.map((suggestion, index) => (
                          <p key={index} className="text-sm">• {suggestion}</p>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mandatory Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5" />
              Mandatory Checklist
            </CardTitle>
            <CardDescription>
              You must confirm all items below before submitting your blog post.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {checklistItems.map((item) => (
              <div key={item.key} className="space-y-2">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={item.key}
                    checked={checklist[item.key]}
                    onCheckedChange={(checked) => 
                      handleChecklistChange(item.key, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={item.key}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {item.label}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                {item.key !== checklistItems[checklistItems.length - 1].key && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}

            {!isChecklistComplete && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  All checklist items must be confirmed before submission.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Blog Post"
              )}
            </Button>
            
            {!canSubmit && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Complete all required fields and checklist items to submit
              </p>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};