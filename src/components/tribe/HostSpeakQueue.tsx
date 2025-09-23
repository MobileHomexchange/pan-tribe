import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FirebaseService } from "@/lib/firebaseService";
import { formatDistanceToNow } from "date-fns";

interface SpeakRequest {
  id: string;
  userId: string;
  userName: string;
  method: 'hand' | 'drum';
  status: 'pending' | 'approved' | 'denied';
  createdAt: any;
  updatedAt?: any;
}

interface HostSpeakQueueProps {
  tribeId: string;
  isHost: boolean;
}

export function HostSpeakQueue({ tribeId, isHost }: HostSpeakQueueProps) {
  const [requests, setRequests] = useState<SpeakRequest[]>([]);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (!isHost) return;

    // Subscribe to real-time speak requests
    const unsubscribe = FirebaseService.subscribeToSpeakRequests(tribeId, (newRequests) => {
      setRequests(newRequests as SpeakRequest[]);
    });

    return unsubscribe;
  }, [tribeId, isHost]);

  const handleRequestAction = async (requestId: string, action: 'approved' | 'denied') => {
    setIsLoading(prev => ({ ...prev, [requestId]: true }));

    try {
      await FirebaseService.updateSpeakRequestStatus(tribeId, requestId, action);
      
      const actionText = action === 'approved' ? 'approved' : 'denied';
      toast({
        title: "Request Updated",
        description: `Speak request has been ${actionText}.`,
      });
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || `Failed to ${action} request.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  if (!isHost) {
    return null;
  }

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const completedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <Card className="bg-card shadow-card border border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <i className="fas fa-hand-paper text-primary"></i>
          Requests to Speak
          {pendingRequests.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {pendingRequests.length === 0 && completedRequests.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <i className="fas fa-inbox text-3xl mb-3 block"></i>
            No speak requests yet
          </div>
        ) : (
          <>
            {/* Pending Requests */}
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {request.method === 'hand' ? '✋' : '🥁'}
                  </span>
                  <div>
                    <div className="font-medium text-foreground">
                      {request.userName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {request.createdAt && formatDistanceToNow(
                        request.createdAt.toDate ? request.createdAt.toDate() : new Date(request.createdAt),
                        { addSuffix: true }
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRequestAction(request.id, 'approved')}
                    disabled={isLoading[request.id]}
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  >
                    <i className="fas fa-check mr-1"></i>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRequestAction(request.id, 'denied')}
                    disabled={isLoading[request.id]}
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  >
                    <i className="fas fa-times mr-1"></i>
                    Deny
                  </Button>
                </div>
              </div>
            ))}

            {/* Completed Requests (Recent) */}
            {completedRequests.slice(0, 3).map((request) => (
              <div
                key={request.id}
                className={`flex items-center justify-between p-3 rounded-lg border opacity-60 ${
                  request.status === 'approved' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl opacity-50">
                    {request.method === 'hand' ? '✋' : '🥁'}
                  </span>
                  <div>
                    <div className="font-medium text-foreground">
                      {request.userName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {request.status === 'approved' ? 'Approved' : 'Denied'} • 
                      {request.updatedAt && formatDistanceToNow(
                        request.updatedAt.toDate ? request.updatedAt.toDate() : new Date(request.updatedAt),
                        { addSuffix: true }
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={`text-sm font-medium ${
                  request.status === 'approved' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {request.status === 'approved' ? (
                    <i className="fas fa-check-circle"></i>
                  ) : (
                    <i className="fas fa-times-circle"></i>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}