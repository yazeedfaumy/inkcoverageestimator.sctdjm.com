import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function NavigationButtons() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const getNextRoute = () => {
    switch (currentPath) {
      case '/dashboard/analysis':
        return { path: '/dashboard/calculator', label: 'Calculate Price' };
      case '/dashboard/calculator':
        return { path: '/dashboard/reports', label: 'View Report' };
      default:
        return null;
    }
  };

  const nextRoute = getNextRoute();

  if (!nextRoute) return null;

  return (
    <div className="flex justify-end mt-6">
      <button
        onClick={() => navigate(nextRoute.path)}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        <span className="mr-2">Next: {nextRoute.label}</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}