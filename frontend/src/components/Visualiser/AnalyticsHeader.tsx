import type { ReactNode } from "react";

type AnalyticsHeaderProps = {
  icon: ReactNode;
};

export default function AnalyticsHeader({ icon }: AnalyticsHeaderProps) {
  return (
    <div className="flex items-center justify-center mb-2">
      <div className="bg-slate-800 p-2 rounded-lg shadow-lg flex items-center gap-4 align-center">
        {icon}
        <div>
          <h1 className="text-3xl md:text-3xl font-bold text-violet-300 tracking-tight">
            Smart Financial Visualiser
          </h1>
          <p className="text-xs text-white mt-1 text-center ">
            Data-driven insights at your fingertips.
          </p>
        </div>
      </div>
    </div>
  );
}
