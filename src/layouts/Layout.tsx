import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/common/Sidebar";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { FileAnalysis } from "@/features/analysis/FileAnalysis";
import { CostCalculator } from "@/features/calculator/CostCalculator";
import { Reports } from "@/features/reports/Reports";
import type { Report, AnalysisResult } from "@/types";

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [reportData, setReportData] = useState<Report | null>(null);

  useEffect(() => {
    const updateReportData = () => {
      try {
        const analysisResults = localStorage.getItem('analysisResults');
        const fileName = localStorage.getItem('currentFileName');
        
        if (analysisResults && fileName) {
          const parsedAnalysis = JSON.parse(analysisResults) as AnalysisResult[];
          
          const report: Report = {
            id: 'current-analysis',
            fileName: fileName,
            date: new Date().toLocaleDateString(),
            analysisResults: parsedAnalysis,
            costResults: []
          };

          const costResults = localStorage.getItem('costResults');
          if (costResults) {
            const parsedCosts = JSON.parse(costResults);
            report.costResults = parsedCosts.map((cost: any, index: number) => ({
              pageNumber: index + 1,
              colorCost: cost.colorCost || 0,
              grayscaleCost: cost.grayscaleCost || 0,
              potentialSavings: (cost.colorCost || 0) - (cost.grayscaleCost || 0)
            }));
          } else {
            report.costResults = parsedAnalysis.map((_: AnalysisResult, index: number) => ({
              pageNumber: index + 1,
              colorCost: 0,
              grayscaleCost: 0,
              potentialSavings: 0
            }));
          }

          setReportData(report);
        }
      } catch (error) {
        console.error('Error updating report data:', error);
      }
    };

    updateReportData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'analysisResults' || e.key === 'costResults' || e.key === 'currentFileName') {
        updateReportData();
      }
    };

    const handleCustomEvent = () => {
      updateReportData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('reportDataUpdate', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('reportDataUpdate', handleCustomEvent);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onMenuClick={() => setShowMobileSidebar(!showMobileSidebar)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          showMobile={showMobileSidebar}
          onMobileClose={() => setShowMobileSidebar(false)}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="analysis" element={<FileAnalysis />} />
              <Route path="calculator" element={<CostCalculator />} />
              <Route path="reports" element={<Reports reportData={reportData} />} />
            </Routes>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}