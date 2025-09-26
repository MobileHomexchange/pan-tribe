import { Layout } from "@/components/layout/Layout";
import { Code, Users, MessageCircle, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Tech() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Code className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Tech Africa</h1>
                <p className="text-muted-foreground">Building the future of technology in Africa</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Users className="h-4 w-4 mr-2" />
              Join Community
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">25.8K</p>
                    <p className="text-sm text-muted-foreground">Developers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-sm text-muted-foreground">Startups</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-sm text-muted-foreground">Tech Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latest Discussions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    C
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Chidi Okwu</p>
                    <p className="text-sm text-muted-foreground">AI in African fintech: opportunities and challenges</p>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    F
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Fatima Hassan</p>
                    <p className="text-sm text-muted-foreground">Looking for React developers in Lagos</p>
                    <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tech Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">Africa Tech Summit 2024</p>
                    <p className="text-sm text-muted-foreground">Virtual conference on emerging technologies</p>
                    <p className="text-xs text-muted-foreground mt-1">March 25-27</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">Startup Pitch Night</p>
                    <p className="text-sm text-muted-foreground">Monthly pitch event for African startups</p>
                    <p className="text-xs text-muted-foreground mt-1">March 18, 6:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}