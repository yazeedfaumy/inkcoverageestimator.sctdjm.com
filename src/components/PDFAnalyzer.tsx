import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface AnalysisResult {
  pageNumber: number;
  colorCoverage: {
    cyan: number;
    magenta: number;
    yellow: number;
    black: number;
    total: number;
  };
  grayscaleCoverage: {
    black: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  dpi: number;
}

interface PDFAnalyzerProps {
  onAnalysisComplete: (results: AnalysisResult[], fileName: string) => void;
}

const COLORS = {
  cyan: '#00BCD4',
  magenta: '#E91E63',
  yellow: '#FFC107',
  black: '#212121'
};

export function PDFAnalyzer({ onAnalysisComplete }: PDFAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<string[]>(['cyan', 'magenta', 'yellow', 'black']);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [viewMode, setViewMode] = useState<'color' | 'grayscale'>('color');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasInitialized, setCanvasInitialized] = useState(false);

  useEffect(() => {
    if (canvasRef.current && !canvasInitialized) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 1000;
        canvas.height = 1000;
        setCanvasInitialized(true);
      }
    }
  }, [canvasInitialized]);

  const onDrop = async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile?.type === 'application/pdf') {
      setFile(pdfFile);
      try {
        await analyzePDF(pdfFile);
      } catch (err) {
        console.error('Error analyzing PDF:', err);
        setError('Failed to analyze the PDF. Please try again.');
      }
    } else {
      setError('Please upload a valid PDF file');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const analyzeGrayscale = (imageData: ImageData): number => {
    const pixels = imageData.data;
    let totalGray = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const gray = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
      totalGray += (255 - gray) / 255;
    }
    
    return (totalGray / (pixels.length / 4)) * 100;
  };

  const analyzePage = async (page: any): Promise<AnalysisResult> => {
    if (!canvasRef.current) {
      throw new Error('Canvas not initialized');
    }

    const viewport = page.getViewport({ scale: 1.0 });
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    context.clearRect(0, 0, canvas.width, canvas.height);

    try {
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const totalPixels = canvas.width * canvas.height;
      
      let cTotal = 0, mTotal = 0, yTotal = 0, kTotal = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i] / 255;
        const g = pixels[i + 1] / 255;
        const b = pixels[i + 2] / 255;

        const k = 1 - Math.max(r, g, b);
        const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
        const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
        const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

        cTotal += c;
        mTotal += m;
        yTotal += y;
        kTotal += k;
      }

      context.filter = 'grayscale(100%)';
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      const grayscaleImageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const grayscaleCoverage = analyzeGrayscale(grayscaleImageData);

      return {
        pageNumber: page.pageNumber,
        colorCoverage: {
          cyan: (cTotal / totalPixels) * 100,
          magenta: (mTotal / totalPixels) * 100,
          yellow: (yTotal / totalPixels) * 100,
          black: (kTotal / totalPixels) * 100,
          total: ((cTotal + mTotal + yTotal + kTotal) / (totalPixels * 4)) * 100
        },
        grayscaleCoverage: {
          black: grayscaleCoverage
        },
        dimensions: {
          width: viewport.width / 72,
          height: viewport.height / 72
        },
        dpi: Math.round(viewport.width / (viewport.width / 72))
      };
    } catch (error) {
      console.error('Error rendering page:', error);
      throw error;
    }
  };

  const analyzePDF = async (pdfFile: File) => {
    if (!canvasInitialized) {
      setError('Canvas not initialized. Please try again.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      setNumPages(pdf.numPages);
      const analysisResults: AnalysisResult[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const result = await analyzePage(page);
        analysisResults.push(result);
      }

      setResults(analysisResults);
      onAnalysisComplete(analysisResults, pdfFile.name);
    } catch (err) {
      console.error('Error analyzing PDF:', err);
      setError('Failed to analyze the PDF. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setResults([]);
    setNumPages(0);
    setCurrentPage(1);
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const calculateTotals = () => {
    if (!results.length) return null;

    const totals = results.reduce((acc, result) => ({
      colorCoverage: {
        total: acc.colorCoverage.total + result.colorCoverage.total,
        cyan: acc.colorCoverage.cyan + result.colorCoverage.cyan,
        magenta: acc.colorCoverage.magenta + result.colorCoverage.magenta,
        yellow: acc.colorCoverage.yellow + result.colorCoverage.yellow,
        black: acc.colorCoverage.black + result.colorCoverage.black
      },
      grayscaleCoverage: {
        black: acc.grayscaleCoverage.black + result.grayscaleCoverage.black
      }
    }), {
      colorCoverage: { total: 0, cyan: 0, magenta: 0, yellow: 0, black: 0 },
      grayscaleCoverage: { black: 0 }
    });

    return {
      colorCoverage: {
        total: totals.colorCoverage.total / results.length,
        cyan: totals.colorCoverage.cyan / results.length,
        magenta: totals.colorCoverage.magenta / results.length,
        yellow: totals.colorCoverage.yellow / results.length,
        black: totals.colorCoverage.black / results.length
      },
      grayscaleCoverage: {
        black: totals.grayscaleCoverage.black / results.length
      },
      potentialSavings: (totals.colorCoverage.total - totals.grayscaleCoverage.black) / results.length
    };
  };

  const chartData = results.length > 0 ? [
    {
      name: 'Cyan',
      value: results[currentPage - 1].colorCoverage.cyan,
      color: COLORS.cyan
    },
    {
      name: 'Magenta',
      value: results[currentPage - 1].colorCoverage.magenta,
      color: COLORS.magenta
    },
    {
      name: 'Yellow',
      value: results[currentPage - 1].colorCoverage.yellow,
      color: COLORS.yellow
    },
    {
      name: 'Black',
      value: results[currentPage - 1].colorCoverage.black,
      color: COLORS.black
    }
  ].filter(item => selectedColors.includes(item.name.toLowerCase())) : [];

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />
      
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 sm:p-10 transition-colors ${
            isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-900 mb-2">
              Drop your PDF here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to select a file
            </p>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAnalyzing && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                <span className="ml-2 text-sm text-gray-600">
                  Analyzing PDF...
                </span>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {file && !error && results.length > 0 && (
            <>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Document Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Average Color Coverage</p>
                    <p className="text-2xl font-bold text-green-600">
                      {calculateTotals()?.colorCoverage.total.toFixed(2)}%
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Average Grayscale Coverage</p>
                    <p className="text-2xl font-bold text-green-600">
                      {calculateTotals()?.grayscaleCoverage.black.toFixed(2)}%
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg relative group">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">Potential Savings</p>
                      <Info className="h-4 w-4 text-gray-400" />
                      <div className="hidden group-hover:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs rounded p-2 w-48">
                        Difference between color and grayscale coverage indicating potential cost savings when printing in grayscale
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {calculateTotals()?.potentialSavings.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm">
                      Page {currentPage} of {numPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                      disabled={currentPage >= numPages}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('color')}
                      className={`px-3 py-1 rounded text-sm ${
                        viewMode === 'color' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Color
                    </button>
                    <button
                      onClick={() => setViewMode('grayscale')}
                      className={`px-3 py-1 rounded text-sm ${
                        viewMode === 'grayscale' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Grayscale
                    </button>
                  </div>
                </div>

                <div className="flex justify-center mb-6">
                  <div className={`max-w-full overflow-hidden ${viewMode === 'grayscale' ? 'grayscale' : ''}`}>
                    <Document file={file}>
                      <Page
                        pageNumber={currentPage}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={Math.min(500, window.innerWidth - 64)}
                        className="mx-auto"
                      />
                    </Document>
                  </div>
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
                        {results.map((result) => (
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

                <div className="mt-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-1 rounded ${
                          chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Bar Chart
                      </button>
                      <button
                        onClick={() => setChartType('pie')}
                        className={`px-3 py-1 rounded ${
                          chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Pie Chart
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(COLORS).map(([color, hex]) => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`w-8 h-8 rounded ${
                            selectedColors.includes(color) ? 'ring-2 ring-blue-500' : ''
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' ? (
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8">
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}