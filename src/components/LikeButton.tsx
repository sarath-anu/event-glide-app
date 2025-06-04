
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toggleEventLike, getUserEventLike } from "@/lib/supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface LikeButtonProps {
  eventId: string;
  likesCount: number;
}

const LikeButton = ({ eventId, likesCount }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likesCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const liked = await getUserEventLike(eventId, user.id);
          setIsLiked(liked);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
    };

    checkIfLiked();
  }, [eventId]);

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like events.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const liked = await toggleEventLike(eventId, user.id);
      setIsLiked(liked);
      setCurrentLikes(prev => liked ? prev + 1 : Math.max(0, prev - 1));
      
      toast({
        title: liked ? "Event Liked!" : "Event Unliked",
        description: liked ? "Event added to your favorites." : "Event removed from favorites.",
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 btn-secondary ${
        isLiked ? 'bg-red-50 border-red-200 hover:bg-red-100' : ''
      }`}
    >
      <Heart 
        className={`h-4 w-4 ${
          isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'
        }`} 
      />
      <span className="text-gray-700">{currentLikes}</span>
    </Button>
  );
};

export default LikeButton;
