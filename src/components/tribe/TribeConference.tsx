import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import LiveEventButton from "@/components/LiveEventButton";

export function TribeConference() {
  const [isLive, setIsLive] = useState(false);

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <h2 className="text-2xl font-bold text-foreground">African Music Lovers Tribe</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <LiveEventButton eventId="african-music-tribe-main" />
          <Button variant="secondary" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <i className="fas fa-calendar mr-2"></i>
            Schedule Event
          </Button>
        </div>
      </div>
      
      {/* Live Toggle */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-muted-foreground">Show Live Event:</span>
        <Switch 
          checked={isLive} 
          onCheckedChange={setIsLive}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      
      {isLive ? (
        /* Video Feeds */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative bg-gradient-to-br from-primary to-black rounded-lg h-48 flex items-center justify-center text-accent text-4xl border-4 border-accent">
            <i className="fas fa-user"></i>
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded text-sm">
              Host: Kwame A.
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-primary to-black rounded-lg h-48 flex items-center justify-center text-accent text-4xl">
            <i className="fas fa-user"></i>
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded text-sm">
              Co-host: Amina D.
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-primary to-black rounded-lg h-48 flex items-center justify-center text-accent text-4xl">
            <i className="fas fa-user"></i>
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded text-sm">
              Co-host: Thabo J.
            </div>
          </div>
        </div>
      ) : (
        /* Ad Space */
        <div className="bg-gradient-to-br from-primary to-black rounded-lg h-48 flex flex-col items-center justify-center text-accent p-5 text-center">
          <i className="fas fa-music text-5xl mb-4"></i>
          <h3 className="text-2xl font-bold mb-2">African Music Festival 2023</h3>
          <p className="text-lg max-w-md">
            Join us for the biggest African music festival of the year! Featuring artists from across the continent.
          </p>
        </div>
      )}
    </div>
  );
}