import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  QuestionMarkCircleIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { GiHamburger } from "react-icons/gi";

type CategoryIconProps = {
  category: string;
  className?: string;
};

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const iconClasses = className || "w-6 h-6";

  switch (category.toUpperCase()) {
    case "SALARY":
      return <span className="text-green-400 text-lg">💰</span>;
    case "BUSINESS":
      return <BriefcaseIcon className={`${iconClasses} text-blue-400`} />;
    case "RENT":
      return (
        <BuildingOffice2Icon className={`${iconClasses} text-yellow-400`} />
      );
    case "TRAVEL":
      return <TruckIcon className={`${iconClasses} text-purple-400`} />;
    case "FOOD":
      return <GiHamburger size={24} color="#fde047" />; // Tailwind yellow-300
    default:
      return (
        <QuestionMarkCircleIcon className={`${iconClasses} text-gray-400`} />
      );
  }
}
