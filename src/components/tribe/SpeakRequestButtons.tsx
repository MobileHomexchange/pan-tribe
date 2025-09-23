import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FirebaseService } from "@/lib/firebaseService";

interface SpeakRequestButtonsProps {
  tribeId: string;
}

export function SpeakRequestButtons({ tribeId }: SpeakRequestButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) return;

    // Check for existing active request
    const checkActiveRequest = async () => {
      try {
        const request = await FirebaseService.getUserActiveSpeakRequest(tribeId, currentUser.uid);
        setActiveRequest(request);
      } catch (error) {
        console.error('Error checking active request:', error);
      }
    };

    checkActiveRequest();
  }, [tribeId, currentUser]);

  const handleSpeakRequest = async (method: 'hand' | 'drum') => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request to speak.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await FirebaseService.createSpeakRequest(
        tribeId, 
        currentUser.uid, 
        currentUser.displayName || currentUser.email || 'Anonymous',
        method
      );

      const methodText = method === 'hand' ? 'raised your hand' : 'hit the drum';
      toast({
        title: "Request Submitted!",
        description: `You ${methodText} to speak. Waiting for host approval.`,
      });

      // Refresh active request status
      const updatedRequest = await FirebaseService.getUserActiveSpeakRequest(tribeId, currentUser.uid);
      setActiveRequest(updatedRequest);

    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to submit speak request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasActiveRequest = activeRequest && activeRequest.status === 'pending';

  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-3">Request to Speak</h3>
      
      <div className="flex gap-3">
        <Button
          onClick={() => handleSpeakRequest('hand')}
          disabled={isLoading || hasActiveRequest}
          variant="outline"
          className="flex-1 h-12 text-base hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <span className="mr-2 text-xl">✋</span>
          Raise Hand
        </Button>

        <Button
          onClick={() => handleSpeakRequest('drum')}
          disabled={isLoading || hasActiveRequest}
          variant="outline"
          className="flex-1 h-12 text-base hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <span className="mr-2 text-xl">🥁</span>
          Hit Drum
        </Button>
      </div>

      {hasActiveRequest && (
        <div className="mt-3 p-3 bg-secondary rounded-lg">
          <div className="flex items-center gap-2 text-sm text-secondary-foreground">
            <span className="text-lg">
              {activeRequest.method === 'hand' ? '✋' : '🥁'}
            </span>
            <span>
              Your request is pending approval...
            </span>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-3 text-sm text-muted-foreground text-center">
          Submitting request...
        </div>
      )}
    </div>
  );
}