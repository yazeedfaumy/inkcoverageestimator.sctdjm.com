import { useEffect, useState } from "react";
import { FileUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  filesAnalyzed: number;
  pagesProcessed: number;
  totalInkCoverage: string;
  averageCost: string;
}

interface UsageInfo {
  title: string;
  description: string;
  icon: string;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    filesAnalyzed: 153,
    pagesProcessed: 2000,
    totalInkCoverage: "60%",
    averageCost: "$0.00"
  });

  const usageInfo: UsageInfo[] = [
    {
      title: "Print Shops",
      description: "Perfect for print shops to estimate ink costs and provide accurate quotes to customers.",
      icon: "🏪"
    },
    {
      title: "Design Studios",
      description: "Help designers optimize their designs for cost-effective printing while maintaining quality.",
      icon: "🎨"
    },
    {
      title: "Business Offices",
      description: "Track and optimize printing costs for large document volumes and reports.",
      icon: "🏢"
    }
  ];

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('dashboardStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    // Update stats when new analysis is completed
    const analysisResults = localStorage.getItem('analysisResults');
    if (analysisResults) {
      const results = JSON.parse(analysisResults);
      
      // Calculate new stats
      const newStats = {
        filesAnalyzed: stats.filesAnalyzed + 1,
        pagesProcessed: stats.pagesProcessed + results.length,
        totalInkCoverage: calculateAverageInkCoverage(results),
        averageCost: "$0.00" // Reset since calculator is removed
      };

      // Save updated stats
      setStats(newStats);
      localStorage.setItem('dashboardStats', JSON.stringify(newStats));
    }
  }, []);

  const calculateAverageInkCoverage = (results: any[]): string => {
    if (!results.length) return "0%";
    const totalCoverage = results.reduce((sum, page) => sum + page.colorCoverage.total, 0);
    return `${(totalCoverage / results.length).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Files Analyzed</p>
          <p className="text-2xl font-bold text-green-700">
            {stats.filesAnalyzed}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pages Processed</p>
          <p className="text-2xl font-bold text-green-700">
            {stats.pagesProcessed}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Avg. Ink Coverage</p>
          <p className="text-2xl font-bold text-green-700">
            {stats.totalInkCoverage}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <FileUp className="h-12 w-12 text-green-600" />
          <h2 className="text-xl font-medium text-gray-900">Analyze File</h2>
          <p className="text-gray-500">
            Upload a PDF file to analyze ink coverage
          </p>
          <Link
            to="/dashboard/analysis"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Upload File
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Who Can Benefit from Ink Calculator?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {usageInfo.map((info, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">{info.icon}</div>
              <h3 className="font-medium text-gray-900 mb-2">{info.title}</h3>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}