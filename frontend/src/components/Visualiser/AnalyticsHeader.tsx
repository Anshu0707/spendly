import type { ReactNode } from "react";

type AnalyticsHeaderProps = {
  icon: ReactNode;
};

export default function AnalyticsHeader({ icon }: AnalyticsHeaderProps) {
  return (
    <div className="flex items-center mb-8">
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex items-center gap-4">
        {icon}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Smart Financial Visualiser
          </h1>
          <p className="text-sm text-violet-300 mt-1">
            Data-driven insights at your fingertips.
          </p>
        </div>
      </div>
    </div>
  );
}
