'use client';

import { useState } from 'react';
import { ScreenContainer } from '@/shared/ui/custom';
import { useAISummaryMutation } from '@/features/ai-summary/model/useAISummary';
import { SummaryInputPanel, SummaryResultCard } from '@/features/ai-summary/ui/SummaryPanel';
import { useAIGate } from '@/features/subscription/hooks/useAIGate';
import { PaywallModal } from '@/features/subscription/ui/PaywallModal';

export default function AISummaryPage() {
  const [showPaywall, setShowPaywall] = useState(false);
  const mutation = useAISummaryMutation();
  const { canUseSummary } = useAIGate();

  const handleSubmit = (text: string) => {
    if (!canUseSummary) {
      setShowPaywall(true);
      return;
    }
    mutation.mutate(text);
  };

  return (
    <ScreenContainer title="AI Summary" description="Generate concise summaries from your study material">
      <div className="space-y-6">
        <SummaryInputPanel onSubmit={handleSubmit} isLoading={mutation.isPending} />

        {mutation.data && (
          <SummaryResultCard
            bullets={mutation.data.bullets}
            originalLength={mutation.data.original_text.length}
          />
        )}

        {mutation.error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {mutation.error.message}
          </div>
        )}
      </div>

      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="summary"
      />
    </ScreenContainer>
  );
}
