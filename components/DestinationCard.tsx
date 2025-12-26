import React from 'react';
import { GroupedDestination, Student } from '../types';

interface DestinationCardProps {
  group: GroupedDestination;
  onClick: (group: GroupedDestination) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ group, onClick }) => {
  // Determine color based on destination type (heuristic)
  // We check the first student to guess the type of the group
  const sampleType = group.students[0]?.type;
  
  let bgColor = "bg-white";
  let borderColor = "border-slate-200";
  let textColor = "text-slate-800";
  let icon = "🏫";

  if (sampleType === '工作') {
    bgColor = "bg-emerald-50";
    borderColor = "border-emerald-200";
    textColor = "text-emerald-900";
    icon = "🏢";
  } else if (sampleType === '出国') {
    bgColor = "bg-sky-50";
    borderColor = "border-sky-200";
    textColor = "text-sky-900";
    icon = "✈️";
  } else if (group.destination === '待定') {
     bgColor = "bg-gray-50";
     borderColor = "border-gray-200";
     textColor = "text-gray-500";
     icon = "⏳";
  }

  // Calculate grid span based on popularity (size)
  const spanClass = group.count > 5 ? "col-span-2 row-span-2" : "col-span-1 row-span-1";

  return (
    <button 
      onClick={() => onClick(group)}
      className={`${spanClass} ${bgColor} ${borderColor} border-2 rounded-xl p-4 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 text-left flex flex-col justify-between min-h-[140px]`}
    >
      <div>
        <div className="text-2xl mb-2">{icon}</div>
        <h3 className={`font-bold text-lg leading-tight ${textColor}`}>
          {group.destination}
        </h3>
      </div>
      <div className="mt-4 flex items-center justify-between w-full">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          校友 / Peers
        </span>
        <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none ${textColor} bg-white bg-opacity-50 rounded-full`}>
          {group.count}
        </span>
      </div>
    </button>
  );
};

export default DestinationCard;
