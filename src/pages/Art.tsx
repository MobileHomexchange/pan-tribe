import { Layout } from "@/components/layout/Layout";
import { Palette, Users, MessageCircle, Calendar, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Art() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Palette className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Art Collective</h1>
                <p className="text-muted-foreground">Showcase and discover African contemporary art</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Users className="h-4 w-4 mr-2" />
              Join Collective
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">8.2K</p>
                    <p className="text-sm text-muted-foreground">Artists</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Image className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">15.7K</p>
                    <p className="text-sm text-muted-foreground">Artworks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Exhibitions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Artists</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Amara Okafor</p>
                    <p className="text-sm text-muted-foreground">Contemporary sculptor from Nigeria</p>
                    <p className="text-xs text-muted-foreground mt-1">12 artworks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    K
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Kwame Asante</p>
                    <p className="text-sm text-muted-foreground">Digital artist from Ghana</p>
                    <p className="text-xs text-muted-foreground mt-1">24 artworks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exhibitions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">African Voices Virtual Gallery</p>
                    <p className="text-sm text-muted-foreground">Contemporary African art showcase</p>
                    <p className="text-xs text-muted-foreground mt-1">March 20 - April 15</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">Digital Art Workshop</p>
                    <p className="text-sm text-muted-foreground">Learn digital painting techniques</p>
                    <p className="text-xs text-muted-foreground mt-1">March 22, 10:00 AM</p>
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