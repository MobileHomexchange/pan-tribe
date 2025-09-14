import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: string;
  author: {
    name: string;
    initials: string;
  };
  content: string;
  time: string;
  isOwn?: boolean;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    author: { name: "Kwame Asante", initials: "KA" },
    content: "Hey everyone! Excited for our live session later today.",
    time: "2:30 PM"
  },
  {
    id: "2",
    author: { name: "Amina Diallo", initials: "AD" },
    content: "Can't wait! I've prepared some great content about West African rhythms.",
    time: "2:32 PM"
  },
  {
    id: "3",
    author: { name: "Thabo Johnson", initials: "TJ" },
    content: "I'll be joining from South Africa. Looking forward to it!",
    time: "2:35 PM"
  },
  {
    id: "4",
    author: { name: "Nia Mbeki", initials: "NM" },
    content: "Will there be a Q&A session after the presentation?",
    time: "2:40 PM"
  },
  {
    id: "5",
    author: { name: "Kwame Asante", initials: "KA" },
    content: "Yes, we'll have 30 minutes for Q&A at the end.",
    time: "2:42 PM"
  }
];

const autoReplyMessages = [
  { name: "Kwame Asante", initials: "KA", message: "Great point!" },
  { name: "Amina Diallo", initials: "AD", message: "I agree with that." },
  { name: "Thabo Johnson", initials: "TJ", message: "Thanks for sharing!" },
  { name: "Nia Mbeki", initials: "NM", message: "Interesting perspective." }
];

export function TribeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      author: { name: "You", initials: "JS" },
      content: newMessage,
      time: "Just now",
      isOwn: true
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate auto-reply
    setTimeout(() => {
      const randomReply = autoReplyMessages[Math.floor(Math.random() * autoReplyMessages.length)];
      const replyMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        author: { name: randomReply.name, initials: randomReply.initials },
        content: randomReply.message,
        time: "Just now"
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-card border border-border h-[calc(100vh-140px)] flex flex-col sticky top-32">
      <div className="flex justify-between items-center p-5 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
          <i className="fas fa-comments text-primary"></i>
          Tribe Chat
        </h3>
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            24 Online
          </span>
          <i className="fas fa-cog text-muted-foreground cursor-pointer hover:text-foreground"></i>
        </div>
      </div>
      
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-black flex items-center justify-center font-bold text-sm text-accent flex-shrink-0">
              {message.author.initials}
            </div>
            <div className="flex-1">
              <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                message.isOwn 
                  ? "bg-primary text-primary-foreground ml-auto" 
                  : "bg-muted text-foreground"
              }`}>
                <h4 className="text-sm font-medium mb-1">{message.author.name}</h4>
                <p className="text-sm">{message.content}</p>
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {message.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-5 border-t border-border">
        <div className="flex gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-border"
          />
          <Button 
            onClick={sendMessage}
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <i className="fas fa-paper-plane"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}