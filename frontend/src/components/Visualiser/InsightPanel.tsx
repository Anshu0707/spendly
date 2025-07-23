import { Lightbulb, Target, ThumbsUp, ListChecks } from "lucide-react";
import { getInsights } from "@/utils/getInsights";
import { getRecommendations } from "@/utils/getRecommendations";
import type { Transaction } from "@/types/transaction";

type InsightPanelProps = {
  transactions: Transaction[];
};

export default function InsightPanel({ transactions }: InsightPanelProps) {
  const insights = getInsights(transactions);
  const recommendations = getRecommendations(transactions);

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full px-4 mt-14">
      <div className="bg-gradient-to-br from-violet-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-violet-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="text-yellow-400 w-5 h-5" />
          <h2 className="text-lg font-bold text-white">Key Insights</h2>
        </div>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
          {insights.map((insight, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-green-400" />
              {insight}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-blue-400 w-5 h-5" />
          <h2 className="text-lg font-bold text-white">Recommendations</h2>
        </div>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-violet-300" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
