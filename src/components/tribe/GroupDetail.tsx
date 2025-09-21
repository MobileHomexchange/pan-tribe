import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, MessageCircle, Calendar, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock group data - matches the groups from Profile.tsx
const groupsData: { [key: string]: any } = {
  "african-music-producers": {
    id: "african-music-producers",
    name: "African Music Producers",
    description: "A community for African music producers to share beats, collaborate, and support each other's creative journey.",
    members: 2847,
    posts: 156,
    category: "Music & Arts",
    isPrivate: false,
    coverImage: "/placeholder.svg",
    recentActivity: [
      { type: "post", user: "Kofi Beats", content: "Just dropped a new Afrobeats sample pack!", time: "2 hours ago" },
      { type: "discussion", user: "Amara Sound", content: "Looking for collaborators on a highlife fusion project", time: "4 hours ago" },
      { type: "event", title: "Virtual Beat Battle - Friday 8PM", time: "6 hours ago" }
    ]
  },
  "diaspora-artists": {
    id: "diaspora-artists",
    name: "Diaspora Artists Network",
    description: "Connecting African artists across the globe. Share your work, find collaborators, and celebrate our culture.",
    members: 5234,
    posts: 342,
    category: "Arts & Culture",
    isPrivate: false,
    coverImage: "/placeholder.svg",
    recentActivity: [
      { type: "post", user: "Zara Gallery", content: "New exhibition opening in London featuring diaspora artists", time: "1 hour ago" },
      { type: "discussion", user: "Marcus Art", content: "Thoughts on representing heritage in contemporary art?", time: "3 hours ago" }
    ]
  },
  "tech-entrepreneurs": {
    id: "tech-entrepreneurs",
    name: "African Tech Entrepreneurs",
    description: "Building the future of technology in Africa. Connect with fellow entrepreneurs, share insights, and grow together.",
    members: 3156,
    posts: 289,
    category: "Business & Tech",
    isPrivate: false,
    coverImage: "/placeholder.svg",
    recentActivity: [
      { type: "post", user: "Sarah Tech", content: "Just closed our Series A! Happy to share lessons learned", time: "30 minutes ago" },
      { type: "event", title: "Startup Pitch Night - Next Wednesday", time: "2 hours ago" }
    ]
  }
};

export function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const group = groupId ? groupsData[groupId] : null;

  if (!group) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Group Not Found</h2>
          <Link to="/my-tribe">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Tribe
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - Same as MyTribe */}
      <div className="bg-gradient-to-r from-primary to-black text-primary-foreground">
        <div className="flex justify-between items-center px-5 h-[70px]">
          <div className="flex items-center gap-3">
            <i className="fas fa-users text-accent text-2xl"></i>
            <span className="text-2xl font-bold">Tribe Pulse</span>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-accent/30 transition-colors">
              <i className="fas fa-fire"></i>
            </div>
            <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-accent/30 transition-colors">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
            </div>
            <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-accent/30 transition-colors">
              <i className="fas fa-envelope"></i>
              <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">7</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-black flex items-center justify-center font-bold text-accent cursor-pointer">
              JS
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation with Breadcrumb */}
      <div className="bg-black px-5">
        <div className="flex justify-between items-center h-[50px]">
          <div className="flex gap-1 items-center">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
            <Link to="/friends" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-heart"></i>
              <span>Friends</span>
            </Link>
            <Link to="/my-tribe" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-user-friends"></i>
              <span>My Tribe</span>
            </Link>
            <span className="text-white/50 px-2">/</span>
            <span className="text-accent font-medium">{group.name}</span>
          </div>
        </div>
      </div>

      {/* Group Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <Link to="/my-tribe">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Tribe
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Group Settings
            </Button>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{group.name}</h1>
              <p className="text-muted-foreground mb-3">{group.description}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {group.members.toLocaleString()} members
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {group.posts} posts
                </span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  {group.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      {activity.type === 'post' && <MessageCircle className="w-4 h-4 text-primary" />}
                      {activity.type === 'discussion' && <Users className="w-4 h-4 text-primary" />}
                      {activity.type === 'event' && <Calendar className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      {activity.user && (
                        <div className="font-medium text-sm">{activity.user}</div>
                      )}
                      {activity.title && (
                        <div className="font-medium text-sm">{activity.title}</div>
                      )}
                      {activity.content && (
                        <p className="text-sm text-muted-foreground mt-1">{activity.content}</p>
                      )}
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Group Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Join the conversation with {group.members.toLocaleString()} other members.</p>
                <Button className="mt-4">Start New Discussion</Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Privacy</span>
                  <span>{group.isPrivate ? 'Private' : 'Public'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{group.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span>{group.members.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Event
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Friends
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}