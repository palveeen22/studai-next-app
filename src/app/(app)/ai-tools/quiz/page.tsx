'use client';

import { useState } from 'react';
import { ScreenContainer } from '@/shared/ui/custom';
import { useAIQuizMutation } from '@/features/ai-quiz/model/useAIQuiz';
import { QuizInputPanel, QuizPlayView } from '@/features/ai-quiz/ui/QuizPanel';
import { useAIGate } from '@/features/subscription/hooks/useAIGate';
import { PaywallModal } from '@/features/subscription/ui/PaywallModal';
import type { PreparationGoal, QuizQuestion } from '@/shared/types';
import { Button } from '@/shared/ui/button';
import { RotateCcw } from 'lucide-react';

export default function AIQuizPage() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const mutation = useAIQuizMutation();
  const { canUseQuiz } = useAIGate();

  const handleSubmit = (text: string, count: number, goal: PreparationGoal) => {
    if (!canUseQuiz) {
      setShowPaywall(true);
      return;
    }
    mutation.mutate(
      { text, count, goal },
      { onSuccess: (data) => setQuestions(data.questions) }
    );
  };

  const handleReset = () => {
    setQuestions(null);
    mutation.reset();
  };

  return (
    <ScreenContainer title="AI Quiz" description="Test your knowledge with AI-generated quizzes">
      {!questions ? (
        <QuizInputPanel onSubmit={handleSubmit} isLoading={mutation.isPending} />
      ) : (
        <div className="space-y-4">
          <QuizPlayView
            questions={questions}
            onComplete={(score) => {
              console.log('Quiz completed with score:', score);
            }}
          />
          <Button variant="outline" onClick={handleReset} className="w-full">
            <RotateCcw className="h-4 w-4" />
            New Quiz
          </Button>
        </div>
      )}

      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="quiz"
      />
    </ScreenContainer>
  );
}
