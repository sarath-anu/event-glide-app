
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for initial messages
const initialMessages = [
  {
    id: "1",
    author: "Jane Doe",
    content: "Hello everyone! Has anyone attended the music festival last week?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
  },
  {
    id: "2",
    author: "John Smith",
    content: "Yes, it was amazing! The headliner performance was incredible.",
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  },
  {
    id: "3",
    author: "Alex Johnson",
    content: "I'm looking forward to the tech conference next month. Anyone else going?",
    timestamp: new Date(Date.now() - 2800000).toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  }
];

export type Message = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
};

const CommunityChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      author: "You", // In a real app, this would be the current user's name
      content: content.trim(),
      timestamp: new Date().toISOString(),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You"
    };
    
    setMessages((prev) => [...prev, newMessage]);
  };
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Community Chat</h1>
        </div>
        
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-muted/50 p-3 border-b">
            <h2 className="font-medium">Event Community</h2>
            <p className="text-sm text-muted-foreground">
              Connect with other attendees and discuss upcoming events
            </p>
          </div>
          
          <div className="h-[60vh] flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <ChatMessages messages={messages} />
            </ScrollArea>
            
            <div className="border-t p-3">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityChat;
