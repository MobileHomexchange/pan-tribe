import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface PollOption {
  text: string;
  votes: number;
}

interface PollData {
  question: string;
  options: PollOption[];
  voters: string[];
}

interface PollProps {
  pollId: string;
}

export const Poll = ({ pollId }: PollProps) => {
  const { currentUser } = useAuth();
  const [poll, setPoll] = useState<PollData | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Fetch poll data & listen for updates
  useEffect(() => {
    if (!pollId) return;
    
    const unsub = onSnapshot(doc(db, "polls", pollId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as PollData;
        setPoll(data);
        
        // Check if current user has already voted
        if (currentUser && data.voters?.includes(currentUser.uid)) {
          setHasVoted(true);
        }
      }
    });
    
    return () => unsub();
  }, [pollId, currentUser]);

  // Handle voting
  const handleVote = async (optionIndex: number) => {
    if (hasVoted || !currentUser) return;

    try {
      const pollRef = doc(db, "polls", pollId);
      const optionKey = `options.${optionIndex}.votes`;

      await updateDoc(pollRef, {
        [optionKey]: increment(1),
        voters: [...(poll?.voters || []), currentUser.uid]
      });

      setSelected(optionIndex);
      setHasVoted(true);
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  // Calculate total votes
  const totalVotes = poll?.options?.reduce((sum, o) => sum + (o.votes || 0), 0) || 0;

  if (!poll) return <p className="text-muted-foreground">Loading poll...</p>;

  return (
    <div className="p-4 bg-card rounded-lg border border-border space-y-3">
      <h4 className="text-lg font-semibold text-card-foreground">{poll.question}</h4>

      <div className="space-y-2">
        {poll.options.map((option, index) => {
          const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isSelected = selected === index;

          return (
            <div key={index} className="relative">
              <Button
                onClick={() => handleVote(index)}
                disabled={hasVoted || !currentUser}
                variant="outline"
                className={`w-full justify-start relative overflow-hidden ${
                  isSelected ? "border-primary bg-primary/10" : ""
                }`}
              >
                {/* Progress bar background */}
                {hasVoted && (
                  <div 
                    className="absolute left-0 top-0 h-full bg-primary/20 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                )}
                
                {/* Option text */}
                <span className="relative z-10 flex-1 text-left">{option.text}</span>
                
                {/* Percentage */}
                {hasVoted && (
                  <span className="relative z-10 text-sm font-medium ml-3">
                    {percent}%
                  </span>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-right">
        {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
      </p>
    </div>
  );
};
