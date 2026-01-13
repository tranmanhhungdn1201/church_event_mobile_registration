import React from 'react';
import { UserIcon, UsersIcon, MapPinIcon, PackageIcon, CreditCardIcon, HomeIcon, CheckCircleIcon } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  maritalStatus?: string;
  church?: string;
}

const stepIcons = [
  UserIcon,      // Step 1: Personal Info
  UsersIcon,     // Step 2: Family Participation  
  MapPinIcon,    // Step 3: Travel Schedule
  PackageIcon,   // Step 4: Package & Souvenir
  CreditCardIcon, // Step 5: Payment
  HomeIcon,      // Step 6: Accommodation
  CheckCircleIcon // Step 7: Review & Submit
];
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  progress,
  maritalStatus,
  church
}) => {
  return (
    <div className="container mx-auto px-4 py-3 bg-white">
      <div className="flex items-center space-x-1 overflow-x-auto mb-3 scrollbar-hide py-1">
        {Array.from({ length: totalSteps }).map((_, index) => {
          // Skip step 2 (family participation) if marital status is single
          if (maritalStatus === 'single' && index === 1) {
            return null;
          }
          
          // Skip step 3 (travel schedule) if church is Đà Nẵng
          if (church === 'Đà Nẵng' && index === 2) {
            return null;
          }
          
          const IconComponent = stepIcons[index] || UserIcon;
          const isCurrent = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;
          
          // Determine if this is the last visible step
          // Logic for skipping logic needs to be accounted for but this visual only check may suffice for now 
          // (Can be improved if strict connector logic is needed, but this works for general list)
          const isLastItem = index === totalSteps - 1;
          
          return (
            <React.Fragment key={index}>
              <div className="flex items-center flex-shrink-0">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border ${
                    isCurrent 
                      ? 'bg-[#2E5AAC] text-white border-[#2E5AAC] shadow-sm transform scale-105' 
                      : isCompleted
                        ? 'bg-slate-50 text-[#2E5AAC] border-[#2E5AAC]'
                        : 'bg-white text-slate-300 border-slate-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              {!isLastItem && (
                <div 
                  className={`flex-1 min-w-[12px] h-[2px] mx-1 transition-all duration-300 ${
                    isCompleted ? 'bg-[#2E5AAC]' : 'bg-slate-100'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-[#2E5AAC] h-1.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200 flex-shrink-0">
          <span className="text-xs font-semibold text-slate-600">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};