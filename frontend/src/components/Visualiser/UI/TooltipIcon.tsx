// src/components/visualiser/ui/TooltipIcon.tsx
type TooltipIconProps = {
  text: string;
};

const TooltipIcon = ({ text }: TooltipIconProps) => (
  <div className="relative group inline-block z-30">
    <span
      className="ml-1 inline-flex items-center justify-center w-4 h-4 text-black bg-white border border-gray-400 rounded-full text-xs font-bold cursor-help"
      tabIndex={0}
      aria-label={text}
    >
      ?
    </span>
    <div className="absolute z-30 hidden group-hover:block group-focus:block w-[90vw] max-w-sm p-2 text-sm bg-white text-black border border-gray-300 rounded shadow-md top-full mt-1 left-0 whitespace-normal">
      {text}
    </div>
  </div>
);

export default TooltipIcon;
