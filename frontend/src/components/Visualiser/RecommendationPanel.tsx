// src/components/visualiser/RecommendationsPanel.tsx
import type { Transaction } from "@/types/transaction";
import { useMemo } from "react";
import { getRecommendations } from "../../utils/getRecommendations";

type Props = {
  transactions: Transaction[];
};

export default function RecommendationsPanel({ transactions }: Props) {
  const recommendations = useMemo(
    () => getRecommendations(transactions),
    [transactions]
  );

  return (
    <div className="bg-gray-900 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        🎯 Recommendations
      </h2>
      <ul className="list-disc ml-6 text-sm text-gray-300 space-y-1">
        {recommendations.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
