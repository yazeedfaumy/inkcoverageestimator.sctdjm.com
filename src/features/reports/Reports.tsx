import { useRef } from 'react';
import { FileText, Download, PieChart, Calculator, Info } from 'lucide-react';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import { StepsProgress } from '@/components/common/StepsProgress';
import { ExportHeader } from '@/components/ExportHeader';
import { ExportFooter } from '@/components/ExportFooter';
import type { Report } from '@/types';

interface ReportsProps {
  reportData: Report | null;
}

export function Reports({ reportData }: ReportsProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const calculateTotals = () => {
    if (!reportData) return null;

    return {
      colorCoverage: reportData.analysisResults.reduce((acc, result) => acc + result.colorCoverage.total, 0) / reportData.analysisResults.length,
      grayscaleCoverage: reportData.analysisResults.reduce((acc, result) => acc + result.grayscaleCoverage.black, 0) / reportData.analysisResults.length,
      colorCost: reportData.costResults.reduce((acc, result) => acc + result.colorCost, 0),
      grayscaleCost: reportData.costResults.reduce((acc, result) => acc + result.grayscaleCost, 0),
      potentialSavings: reportData.costResults.reduce((acc, result) => acc + result.potentialSavings, 0)
    };
  };

  const exportReport = async (format: 'pdf' | 'csv' | 'txt' | 'png') => {
    if (!reportRef.current || !reportData) return;

    try {
      switch (format) {
        case 'pdf': {
          const doc = new jsPDF({
            format: 'a4',
            unit: 'mm',
            orientation: 'portrait'
          });

          // Calculate dimensions
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const margin = 10;
          const contentWidth = pageWidth - (2 * margin);

          // Add header
          doc.setFontSize(16);
          doc.text('Analysis Report', margin, margin + 10);
          doc.setFontSize(12);
          doc.text(`File: ${reportData.fileName}`, margin, margin + 20);
          doc.text(`Date: ${reportData.date}`, margin, margin + 30);

          let currentY = margin + 40;

          // Add totals
          const totals = calculateTotals();
          if (totals) {
            doc.setFontSize(14);
            doc.text('Document Summary', margin, currentY);
            currentY += 10;
            doc.setFontSize(12);
            doc.text(`Average Color Coverage: ${totals.colorCoverage.toFixed(2)}%`, margin, currentY);
            currentY += 8;
            doc.text(`Average Grayscale Coverage: ${totals.grayscaleCoverage.toFixed(2)}%`, margin, currentY);
            currentY += 8;
            doc.text(`Total Color Cost: $${totals.colorCost.toFixed(4)}`, margin, currentY);
            currentY += 8;
            doc.text(`Total Grayscale Cost: $${totals.grayscaleCost.toFixed(4)}`, margin, currentY);
            currentY += 8;
            doc.text(`Total Potential Savings: $${totals.potentialSavings.toFixed(4)}`, margin, currentY);
            currentY += 20;
          }

          // Split content into sections
          const sections = reportRef.current.querySelectorAll('.report-section');
          
          for (let i = 0; i < sections.length; i++) {
            const section = sections[i] as HTMLElement;
            const canvas = await html2canvas(section, {
              scale: 2,
              logging: false,
              useCORS: true
            });

            // Calculate scaled dimensions
            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Check if we need a new page
            if (currentY + imgHeight > pageHeight - margin) {
              doc.addPage();
              currentY = margin;
            }

            // Add image to PDF
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 10;
          }

          doc.save(`${reportData.fileName}-report.pdf`);
          break;
        }

        case 'csv': {
          const rows = [
            ['Sterling Carter Technology Distributors'],
            ['22 Cargill Avenue, Kingston 10, Jamaica'],
            ['Tel: 876-968-6637, Email: info@sctdjm.com'],
            [''],
            ['Analysis Report'],
            [`File: ${reportData.fileName}`],
            [`Date: ${reportData.date}`],
            [''],
            ['Coverage Analysis'],
            ['Page', 'Color Coverage', 'Cyan', 'Magenta', 'Yellow', 'Black', 'Grayscale Coverage'],
            ...reportData.analysisResults.map(result => [
              result.pageNumber,
              result.colorCoverage.total.toFixed(2) + '%',
              result.colorCoverage.cyan.toFixed(1) + '%',
              result.colorCoverage.magenta.toFixed(1) + '%',
              result.colorCoverage.yellow.toFixed(1) + '%',
              result.colorCoverage.black.toFixed(1) + '%',
              result.grayscaleCoverage.black.toFixed(2) + '%'
            ]),
            [''],
            ['Cost Analysis'],
            ['Page', 'Color Cost', 'Grayscale Cost', 'Potential Savings'],
            ...reportData.costResults.map(result => [
              result.pageNumber,
              '$' + result.colorCost.toFixed(4),
              '$' + result.grayscaleCost.toFixed(4),
              '$' + result.potentialSavings.toFixed(4)
            ])
          ];

          const csv = Papa.unparse(rows);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          saveAs(blob, `${reportData.fileName}-report.csv`);
          break;
        }

        case 'txt': {
          let content = 'Sterling Carter Technology Distributors\n';
          content += '22 Cargill Avenue, Kingston 10, Jamaica\n';
          content += 'Tel: 876-968-6637\n';
          content += 'Email: info@sctdjm.com\n\n';
          content += `Analysis Report\n`;
          content += `File: ${reportData.fileName}\n`;
          content += `Date: ${reportData.date}\n\n`;
          
          content += `Coverage Analysis\n`;
          content += `----------------\n`;
          reportData.analysisResults.forEach(result => {
            content += `\nPage ${result.pageNumber}\n`;
            content += `Color Coverage: ${result.colorCoverage.total.toFixed(2)}%\n`;
            content += `CMYK: C=${result.colorCoverage.cyan.toFixed(1)}%, M=${result.colorCoverage.magenta.toFixed(1)}%, Y=${result.colorCoverage.yellow.toFixed(1)}%, K=${result.colorCoverage.black.toFixed(1)}%\n`;
            content += `Grayscale Coverage: ${result.grayscaleCoverage.black.toFixed(2)}%\n`;
          });

          content += `\nCost Analysis\n`;
          content += `-------------\n`;
          reportData.costResults.forEach(result => {
            content += `\nPage ${result.pageNumber}\n`;
            content += `Color Cost: $${result.colorCost.toFixed(4)}\n`;
            content += `Grayscale Cost: $${result.grayscaleCost.toFixed(4)}\n`;
            content += `Potential Savings: $${result.potentialSavings.toFixed(4)}\n`;
          });

          const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
          saveAs(blob, `${reportData.fileName}-report.txt`);
          break;
        }

        case 'png': {
          const canvas = await html2canvas(reportRef.current, {
            scale: 2,
            logging: false,
            useCORS: true
          });
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, `${reportData.fileName}-report.png`);
            }
          });
          break;
        }
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('An error occurred while exporting the report. Please try again.');
    }
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <StepsProgress />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Analysis Report</h1>
        {reportData && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportReport('pdf')}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={() => exportReport('csv')}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </button>
            <button
              onClick={() => exportReport('txt')}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              TXT
            </button>
            <button
              onClick={() => exportReport('png')}
              className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              PNG
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg" ref={reportRef}>
        {!reportData ? (
          <div className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start by analyzing a document to generate reports.
            </p>
          </div>
        ) : (
          <>
            <ExportHeader fileName={reportData.fileName} date={reportData.date} />
            
            {totals && (
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold mb-4">Document Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Coverage Analysis</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        Average Color Coverage: {totals.colorCoverage.toFixed(2)}%
                      </p>
                      <p className="text-sm">
                        Average Grayscale Coverage: {totals.grayscaleCoverage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Cost Analysis</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        Total Color Cost: ${totals.colorCost.toFixed(4)}
                      </p>
                      <p className="text-sm">
                        Total Grayscale Cost: ${totals.grayscaleCost.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg relative group">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-700">Potential Savings</h3>
                      <Info className="h-4 w-4 text-gray-400" />
                      <div className="hidden group-hover:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs rounded p-2 w-48 z-10">
                        Difference between color and grayscale costs indicating potential savings when printing in grayscale
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-green-600 mt-2">
                      ${totals.potentialSavings.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="report-section mb-8">
                <div className="flex items-center mb-4">
                  <PieChart className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold">Coverage Analysis</h3>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Color Coverage
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CMYK Values
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grayscale Coverage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.analysisResults.map((result) => (
                          <tr key={result.pageNumber}>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Page {result.pageNumber}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.colorCoverage.total.toFixed(2)}%
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span>C: {result.colorCoverage.cyan.toFixed(1)}%</span>
                                <span>M: {result.colorCoverage.magenta.toFixed(1)}%</span>
                                <span>Y: {result.colorCoverage.yellow.toFixed(1)}%</span>
                                <span>K: {result.colorCoverage.black.toFixed(1)}%</span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.grayscaleCoverage.black.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="report-section">
                <div className="flex items-center mb-4">
                  <Calculator className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold">Cost Analysis</h3>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Color Cost
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grayscale Cost
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Potential Savings
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.costResults.map((result) => (
                          <tr key={result.pageNumber}>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Page {result.pageNumber}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${result.colorCost.toFixed(4)}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${result.grayscaleCost.toFixed(4)}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${result.potentialSavings.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <ExportFooter />
          </>
        )}
      </div>
    </div>
  );
}