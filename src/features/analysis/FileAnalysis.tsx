import { useState} from 'react';
import { PDFAnalyzer } from '@/components/PDFAnalyzer';
import { StepsProgress } from '@/components/common/StepsProgress';
import { NavigationButtons } from '@/components/common/NavigationButtons';
import type { AnalysisResult } from '@/types';

export function FileAnalysis() {
const [, setAnalysisResults] = useState<AnalysisResult[]>([]);

  const handleAnalysisComplete = (results: AnalysisResult[], fileName: string) => {
    setAnalysisResults(results);
    localStorage.setItem('analysisResults', JSON.stringify(results));
    localStorage.setItem('currentFileName', fileName);
    
    // Clear any existing cost results when new analysis is done
    localStorage.removeItem('costResults');
    
    // Dispatch custom event to notify Layout component
    window.dispatchEvent(new Event('reportDataUpdate'));
  };

  return (
    <div className="space-y-6">
      <StepsProgress />
      <h1 className="text-2xl font-semibold text-gray-900">File Analysis</h1>
      <PDFAnalyzer onAnalysisComplete={handleAnalysisComplete} />
      <NavigationButtons />
    </div>
  );
}