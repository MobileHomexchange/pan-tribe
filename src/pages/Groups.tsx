import { Layout } from "@/components/layout/Layout";
import { VideoConference } from "@/components/groups/VideoConference";
import { GroupDiscussions } from "@/components/groups/GroupDiscussions";
import { GroupChat } from "@/components/groups/GroupChat";

export default function Groups() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-primary to-pan-black text-primary-foreground">
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pan-black flex items-center justify-center font-bold text-accent cursor-pointer">
              JS
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-pan-black px-5">
        <div className="flex justify-between items-center h-[50px]">
          <div className="flex gap-1">
            <a href="/" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-users"></i>
              <span>My Tribe</span>
            </a>
            <a href="/groups" className="flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-md">
              <i className="fas fa-user-friends"></i>
              <span>Groups</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-video"></i>
              <span>Reels</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-briefcase"></i>
              <span>Careers</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center bg-white/15 rounded-full px-4 py-2 w-64">
            <i className="fas fa-search text-white/70 mr-3"></i>
            <input 
              type="text" 
              placeholder="Search Tribe Pulse..." 
              className="bg-transparent text-white placeholder-white/70 border-none outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex p-5 gap-5">
        <div className="flex-1 lg:flex-[2] space-y-5">
          <VideoConference />
          <GroupDiscussions />
        </div>
        
        <div className="hidden lg:block w-80">
          <GroupChat />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-pan-black text-white p-5 mt-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <i className="fas fa-users text-accent text-xl"></i>
            <span className="text-xl font-bold">Tribe Pulse</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-accent hover:underline">About Us</a>
            <a href="#" className="text-accent hover:underline">Privacy Policy</a>
            <a href="#" className="text-accent hover:underline">Terms of Service</a>
            <a href="#" className="text-accent hover:underline">Contact</a>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2023 Tribe Pulse. Connecting Africa.
          </div>
        </div>
      </footer>
    </div>
  );
}