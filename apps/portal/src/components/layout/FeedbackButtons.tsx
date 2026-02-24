import { useState, useEffect } from "react";
import { Button } from "@harnessio/ui/components";
import { IconV2 } from "@harnessio/ui/components";

interface FeedbackData {
  helpful: number;
  notHelpful: number;
  userVote?: 'helpful' | 'notHelpful';
}

export function FeedbackButtons() {
  const [feedback, setFeedback] = useState<FeedbackData>({
    helpful: 0,
    notHelpful: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load feedback data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('page-feedback');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFeedback(data);
      } catch (e) {
        console.error('Failed to parse feedback data:', e);
      }
    }
  }, []);

  const handleVote = (type: 'helpful' | 'notHelpful') => {
    if (isLoading) return;

    setIsLoading(true);
    
    // If user already voted, remove previous vote and add new one
    let newFeedback = { ...feedback };
    
    if (feedback.userVote && feedback.userVote !== type) {
      // User is changing their vote - decrement previous and increment new
      newFeedback = {
        ...feedback,
        [feedback.userVote]: Math.max(0, feedback[feedback.userVote] - 1),
        [type]: feedback[type] + 1,
        userVote: type,
      };
    } else if (!feedback.userVote) {
      // First time voting
      newFeedback = {
        ...feedback,
        [type]: feedback[type] + 1,
        userVote: type,
      };
    }
    // If clicking the same vote again, do nothing
    
    setFeedback(newFeedback);

    // Save to localStorage
    try {
      localStorage.setItem('page-feedback', JSON.stringify(newFeedback));
    } catch (e) {
      console.error('Failed to save feedback:', e);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-cn-sm text-cn-size-4 text-cn-3">
      <span>Was this page helpful?</span>
      <Button
        onClick={() => handleVote('helpful')}
        disabled={isLoading}
        variant={feedback.userVote === 'helpful' ? 'secondary' : 'outline'}
        size="xs"
        className="inline-flex items-center gap-cn-3xs"
        aria-label="Yes, this page was helpful"
      >
        <IconV2 name={feedback.userVote === 'helpful' ? 'thumbs-up-solid' : 'thumbs-up'} size="xs" />
        Good {feedback.helpful > 0 && `(${feedback.helpful})`}
      </Button>
      <Button
        onClick={() => handleVote('notHelpful')}
        disabled={isLoading}
        variant={feedback.userVote === 'notHelpful' ? 'secondary' : 'outline'}
        size="xs"
        className="inline-flex items-center gap-cn-3xs"
        aria-label="No, this page was not helpful"
      >
        <IconV2 name={feedback.userVote === 'notHelpful' ? 'thumbs-down-solid' : 'thumbs-down'} size="xs" />
        Bad {feedback.notHelpful > 0 && `(${feedback.notHelpful})`}
      </Button>
    </div>
  );
}

export default FeedbackButtons;
