import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Workflow } from "lucide-react";

export const BlogWorkflowDiagram = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Workflow className="w-5 h-5" />
          Blog Submission & Moderation Workflow
        </CardTitle>
        <CardDescription>
          Visual workflow diagram showing the complete blog submission and validation process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Process Flow Diagram</h3>
          
          {/* Mermaid Diagram */}
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground mb-4">
                Visual workflow diagram showing the complete submission process
              </div>
              <div className="max-w-2xl mx-auto text-left space-y-2 text-sm">
                <p><strong>1. User Submission</strong> → Mandatory Checklist → Content Validation</p>
                <p><strong>2. Automated Scoring</strong> → Safety Score (0-100) → Route Decision</p>
                <p><strong>3. Score ≥80:</strong> Auto-Approve → Social Sharing</p>
                <p><strong>4. Score 60-79:</strong> Manual Review → Moderator Decision</p>
                <p><strong>5. Score &lt;60:</strong> Auto-Block → Request Revision</p>
                <p><strong>6. Community Reports</strong> → Auto-Suspend if 3+ Reports</p>
                <p><strong>7. Analytics & Logging</strong> → Track All Actions</p>
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Step-by-Step Process
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div className="flex-1">
                    <h5 className="font-medium">User Submission</h5>
                    <p className="text-sm text-muted-foreground">User fills form with title, content, backlinks, and confirms mandatory checklist</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div className="flex-1">
                    <h5 className="font-medium">Automated Validation</h5>
                    <p className="text-sm text-muted-foreground">System scans for scam keywords, validates backlinks, checks content quality, and platform compliance</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div className="flex-1">
                    <h5 className="font-medium">Score-Based Routing</h5>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">80-100</Badge>
                        <span className="text-sm">Auto-approve → Social sharing ready</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">60-79</Badge>
                        <span className="text-sm">Manual moderation queue</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">&lt;60</Badge>
                        <span className="text-sm">Auto-block → Request revision</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div className="flex-1">
                    <h5 className="font-medium">Moderation Dashboard</h5>
                    <p className="text-sm text-muted-foreground">Human moderators review flagged content with approve/reject/edit workflow</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div className="flex-1">
                    <h5 className="font-medium">Publication & Badges</h5>
                    <p className="text-sm text-muted-foreground">Approved content gets "Safe for Social Sharing" badge and platform distribution</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div className="flex-1">
                    <h5 className="font-medium">Community Reporting</h5>
                    <p className="text-sm text-muted-foreground">Users can report published content; 3+ reports trigger automatic review</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-sm font-bold">7</div>
                  <div className="flex-1">
                    <h5 className="font-medium">Reputation & Analytics</h5>
                    <p className="text-sm text-muted-foreground">System tracks user behavior, updates reputation scores, and logs all moderation actions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Safety Matrix */}
            <div>
              <h4 className="font-semibold mb-3">Platform Safety Matrix</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium">Facebook/Instagram</h5>
                  <div className="text-sm space-y-1">
                    <p>• Strict anti-spam enforcement</p>
                    <p>• No adult or violent content</p>
                    <p>• Verified backlinks required</p>
                    <p>• Community guidelines compliance</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">TikTok</h5>
                  <div className="text-sm space-y-1">
                    <p>• Anti-clickbait algorithms</p>
                    <p>• Educational content preferred</p>
                    <p>• Age-appropriate content only</p>
                    <p>• No misleading information</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">WeChat</h5>
                  <div className="text-sm space-y-1">
                    <p>• Cultural sensitivity required</p>
                    <p>• No political content</p>
                    <p>• Business content welcome</p>
                    <p>• Community-focused posts</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">General Requirements</h5>
                  <div className="text-sm space-y-1">
                    <p>• Original content only</p>
                    <p>• No sensitive info requests</p>
                    <p>• Family-safe material</p>
                    <p>• Value-driven content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};