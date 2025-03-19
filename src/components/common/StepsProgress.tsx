import React from 'react';
import { useLocation } from 'react-router-dom';

export function StepsProgress() {
  const location = useLocation();
  const currentPath = location.pathname;

  const steps = [
    { number: 1, label: 'Upload', path: '/analysis' },
    { number: 2, label: 'Calculate', path: '/calculator' },
    { number: 3, label: 'Report', path: '/reports' }
  ];

  const getCurrentStep = () => {
    switch (currentPath) {
      case '/dashboard/analysis':
        return 1;
      case '/dashboard/calculator':
        return 2;
      case '/dashboard/reports':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getCurrentStep();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.number <= currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.number}
              </div>
              <div
                className={`ml-2 text-sm ${
                  step.number <= currentStep ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-24 h-0.5 mx-4 ${
                  step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}