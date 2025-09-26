import { Layout } from "@/components/layout/Layout";
import { Music as MusicIcon, Users, MessageCircle, Calendar, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Music() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <MusicIcon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">African Music</h1>
                <p className="text-muted-foreground">Connect with music lovers across Africa</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Users className="h-4 w-4 mr-2" />
              Join Group
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">12.5K</p>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">2.3K</p>
                    <p className="text-sm text-muted-foreground">Discussions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">15</p>
                    <p className="text-sm text-muted-foreground">Events This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Discussions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    K
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Kemi Adetola</p>
                    <p className="text-sm text-muted-foreground">New Afrobeats releases this week</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    T
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Tunde Bakare</p>
                    <p className="text-sm text-muted-foreground">Looking for collaboration on new track</p>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">Lagos Music Festival</p>
                    <p className="text-sm text-muted-foreground">Virtual concert featuring top African artists</p>
                    <p className="text-xs text-muted-foreground mt-1">Tomorrow, 8:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">Producer Meetup</p>
                    <p className="text-sm text-muted-foreground">Monthly virtual meetup for music producers</p>
                    <p className="text-xs text-muted-foreground mt-1">March 15, 2:00 PM</p>
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