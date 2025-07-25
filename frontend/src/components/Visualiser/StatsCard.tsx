import { TrendingUp } from "lucide-react";
import clsx from "clsx";

type StatCardProps = {
  label: string;
  value: number;
  className?: string;
};

export default function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between p-3 rounded-lg shadow-md",
        className
      )}
    >
      <div>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-2xl font-bold mt-1">
          ₹{value.toLocaleString("en-IN")}
        </p>
      </div>
      <TrendingUp className="w-6 h-6 opacity-30" />
    </div>
  );
}
