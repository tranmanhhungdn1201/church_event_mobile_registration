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
  return <div className="container mx-auto px-4 py-3">
      <div className="flex items-center space-x-1 overflow-x-auto mb-2">
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
          const isActive = index + 1 <= currentStep;
          const isCompleted = index + 1 < currentStep;
          
          // Determine if this is the last visible step
          const isLastVisibleStep = index === totalSteps - 1 || 
            (maritalStatus === 'single' && index === totalSteps - 2 && index !== 1);
          
          return (
            <React.Fragment key={index}>
              <div className="flex items-center flex-shrink-0">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] text-white shadow-md' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              {!isLastVisibleStep && (
                <div 
                  className={`w-3 h-0.5 mx-1 transition-all duration-300 ${
                    isCompleted ? 'bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a]' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] h-1.5 rounded-full transition-all duration-500 ease-out shadow-sm" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="bg-white px-2 py-1 rounded-full shadow-sm border border-gray-200 flex-shrink-0">
          <span className="text-xs font-semibold text-gray-600">
            {progress}%
          </span>
        </div>
      </div>
    </div>;
};