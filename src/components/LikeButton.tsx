
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toggleEventLike, getUserEventLike } from "@/lib/supabase-data";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LikeButtonProps {
  eventId: string;
  likesCount: number;
  className?: string;
}

const LikeButton = ({ eventId, likesCount, className }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUserLike = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const userLiked = await getUserEventLike(eventId, user.id);
          setLiked(userLiked);
        } catch (error) {
          console.error("Error checking user like:", error);
        }
      }
    };

    checkUserLike();
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

    setLoading(true);
    try {
      const isLiked = await toggleEventLike(eventId, user.id);
      setLiked(isLiked);
      setCurrentLikesCount(prev => isLiked ? prev + 1 : prev - 1);
      
      toast({
        title: isLiked ? "Event Liked!" : "Event Unliked",
        description: isLiked ? "Added to your liked events." : "Removed from your liked events.",
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`${liked ? "text-red-500 border-red-500" : ""} ${className}`}
      onClick={handleLike}
      disabled={loading}
    >
      <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-red-500" : ""}`} />
      {liked ? "Liked" : "Like"} ({currentLikesCount})
    </Button>
  );
};

export default LikeButton;
