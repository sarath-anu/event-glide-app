
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { createEventReview, updateEventReview, getEventReviews, getUserEventReview } from "@/lib/supabase-data";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ReviewSectionProps {
  eventId: string;
  eventRating: number;
  onRatingUpdate?: () => void;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  user_email?: string;
}

const ReviewSection = ({ eventId, eventRating, onRatingUpdate }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReviews();
    checkUserReview();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      const data = await getEventReviews(eventId);
      // Fetch user emails for each review
      const reviewsWithEmails = await Promise.all(
        data.map(async (review) => {
          try {
            const { data: userData } = await supabase.auth.admin.getUserById(review.user_id);
            return {
              ...review,
              user_email: userData.user?.email || 'Anonymous User'
            };
          } catch {
            return {
              ...review,
              user_email: 'Anonymous User'
            };
          }
        })
      );
      setReviews(reviewsWithEmails);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const checkUserReview = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const review = await getUserEventReview(eventId, user.id);
        if (review) {
          setUserReview(review);
          setRating(review.rating);
          setComment(review.comment || "");
        }
      } catch (error) {
        // User hasn't reviewed yet, which is fine
      }
    }
  };

  const handleSubmitReview = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (userReview) {
        // Update existing review
        await updateEventReview(userReview.id, {
          rating,
          comment: comment.trim() || null,
        });
        toast({
          title: "Review Updated",
          description: "Your review has been updated successfully.",
        });
      } else {
        // Create new review
        await createEventReview({
          event_id: eventId,
          user_id: user.id,
          rating,
          comment: comment.trim() || null,
        });
        toast({
          title: "Review Submitted",
          description: "Thank you for your review!",
        });
      }
      
      setShowReviewForm(false);
      fetchReviews();
      checkUserReview();
      onRatingUpdate?.(); // Trigger event data refresh
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count: number, interactive = false, onClick?: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < count
            ? "text-yellow-500 fill-yellow-500"
            : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={() => interactive && onClick && onClick(i + 1)}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reviews</CardTitle>
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {renderStars(Math.floor(eventRating))}
            </div>
            <span className="font-medium">{eventRating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">({reviews.length})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!showReviewForm && (
          <Button
            onClick={() => setShowReviewForm(true)}
            variant={userReview ? "outline" : "default"}
            className="mb-4"
          >
            {userReview ? "Edit Your Review" : "Write a Review"}
          </Button>
        )}

        {showReviewForm && (
          <div className="mb-6 p-4 border rounded-lg">
            <h4 className="font-medium mb-3">
              {userReview ? "Edit Your Review" : "Write a Review"}
            </h4>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex">
                {renderStars(rating, true, setRating)}
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmitReview} disabled={loading}>
                {loading ? "Submitting..." : userReview ? "Update Review" : "Submit Review"}
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center mb-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 font-medium">{review.user_email}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(review.created_at), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm mt-2">{review.comment}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No reviews yet. Be the first to review this event!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
