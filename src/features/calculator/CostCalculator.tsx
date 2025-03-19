import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { StepsProgress } from '@/components/common/StepsProgress';
import { NavigationButtons } from '@/components/common/NavigationButtons';
import type { AnalysisResult, CartridgeSettings, CostResult } from '@/types';

export function CostCalculator() {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [cartridgeSettings, setCartridgeSettings] = useState<CartridgeSettings>({
    mode: 'separate',
    separate: {
      cyan: { price: 0, yield: 0 },
      magenta: { price: 0, yield: 0 },
      yellow: { price: 0, yield: 0 },
      black: { price: 0, yield: 0 }
    },
    combined: {
      color: { price: 0, yield: 0 },
      key: { price: 0, yield: 0 }
    }
  });
  const [documentTotals, setDocumentTotals] = useState({
    colorCost: 0,
    grayscaleCost: 0,
    potentialSavings: 0
  });

  useEffect(() => {
    const savedResults = localStorage.getItem('analysisResults');
    if (savedResults) {
      setAnalysisResults(JSON.parse(savedResults));
    }

    const savedSettings = localStorage.getItem('cartridgeSettings');
    if (savedSettings) {
      setCartridgeSettings(JSON.parse(savedSettings));
    }
  }, []);

  const calculateCosts = () => {
    if (!analysisResults.length) return;

    const costs: CostResult[] = analysisResults.map(result => {
      let colorCost = 0;
      let grayscaleCost = 0;
      const colorDetails = { cyan: 0, magenta: 0, yellow: 0, black: 0 };

      if (cartridgeSettings.mode === 'separate') {
        const { cyan, magenta, yellow, black } = cartridgeSettings.separate;
        
        colorDetails.cyan = (result.colorCoverage.cyan / 100) * (cyan.price / cyan.yield);
        colorDetails.magenta = (result.colorCoverage.magenta / 100) * (magenta.price / magenta.yield);
        colorDetails.yellow = (result.colorCoverage.yellow / 100) * (yellow.price / yellow.yield);
        colorDetails.black = (result.colorCoverage.black / 100) * (black.price / black.yield);
        
        colorCost = Object.values(colorDetails).reduce((sum, cost) => sum + cost, 0);
        grayscaleCost = (result.grayscaleCoverage.black / 100) * (black.price / black.yield);
      } else {
        const { color, key } = cartridgeSettings.combined;
        const colorCoverage = (result.colorCoverage.cyan + result.colorCoverage.magenta + result.colorCoverage.yellow) / 300;
        
        colorCost = (colorCoverage * (color.price / color.yield)) + 
                   ((result.colorCoverage.black / 100) * (key.price / key.yield));
        grayscaleCost = (result.grayscaleCoverage.black / 100) * (key.price / key.yield);
      }

      return { colorCost, grayscaleCost, colorDetails };
    });

    // Calculate document totals
    const totals = costs.reduce((acc, cost) => ({
      colorCost: acc.colorCost + cost.colorCost,
      grayscaleCost: acc.grayscaleCost + cost.grayscaleCost,
      potentialSavings: acc.potentialSavings + (cost.colorCost - cost.grayscaleCost)
    }), { colorCost: 0, grayscaleCost: 0, potentialSavings: 0 });

    setDocumentTotals(totals);
    localStorage.setItem('costResults', JSON.stringify(costs));
    window.dispatchEvent(new Event('reportDataUpdate'));
  };

  return (
    <div className="space-y-6">
      <StepsProgress />
      <h1 className="text-2xl font-semibold text-gray-900">Cost Calculator</h1>

      {/* Document Totals */}
      {documentTotals.colorCost > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Document Cost Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Color Cost</p>
              <p className="text-2xl font-bold text-green-600">
                ${documentTotals.colorCost.toFixed(4)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Grayscale Cost</p>
              <p className="text-2xl font-bold text-green-600">
                ${documentTotals.grayscaleCost.toFixed(4)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg relative group">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Potential Savings</p>
                <Info className="h-4 w-4 text-gray-400" />
                <div className="hidden group-hover:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs rounded p-2 w-48 z-10">
                  Difference between color and grayscale printing costs
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">
                ${documentTotals.potentialSavings.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cartridge Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={() => setCartridgeSettings(prev => ({ ...prev, mode: 'separate' }))}
              className={`px-4 py-2 rounded-md ${
                cartridgeSettings.mode === 'separate'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Separate Cartridges
            </button>
            <button
              onClick={() => setCartridgeSettings(prev => ({ ...prev, mode: 'combined' }))}
              className={`px-4 py-2 rounded-md ${
                cartridgeSettings.mode === 'combined'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Combined Cartridges
            </button>
          </div>

          {cartridgeSettings.mode === 'separate' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(cartridgeSettings.separate).map(([color, settings]) => (
                <div key={color} className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium capitalize mb-3">{color}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                      <input
                        type="number"
                        value={settings.price}
                        onChange={(e) => {
                          const newSettings = { ...cartridgeSettings };
                          newSettings.separate[color].price = parseFloat(e.target.value) || 0;
                          setCartridgeSettings(newSettings);
                          localStorage.setItem('cartridgeSettings', JSON.stringify(newSettings));
                        }}
                        className="mt-1 form-input"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Yield (pages)</label>
                      <input
                        type="number"
                        value={settings.yield}
                        onChange={(e) => {
                          const newSettings = { ...cartridgeSettings };
                          newSettings.separate[color].yield = parseInt(e.target.value) || 0;
                          setCartridgeSettings(newSettings);
                          localStorage.setItem('cartridgeSettings', JSON.stringify(newSettings));
                        }}
                        className="mt-1 form-input"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(cartridgeSettings.combined).map(([type, settings]) => (
                <div key={type} className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium capitalize mb-3">
                    {type === 'color' ? 'Color Cartridge' : 'Black Cartridge'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                      <input
                        type="number"
                        value={settings.price}
                        onChange={(e) => {
                          const newSettings = { ...cartridgeSettings };
                          newSettings.combined[type].price = parseFloat(e.target.value) || 0;
                          setCartridgeSettings(newSettings);
                          localStorage.setItem('cartridgeSettings', JSON.stringify(newSettings));
                        }}
                        className="mt-1 form-input"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Yield (pages)</label>
                      <input
                        type="number"
                        value={settings.yield}
                        onChange={(e) => {
                          const newSettings = { ...cartridgeSettings };
                          newSettings.combined[type].yield = parseInt(e.target.value) || 0;
                          setCartridgeSettings(newSettings);
                          localStorage.setItem('cartridgeSettings', JSON.stringify(newSettings));
                        }}
                        className="mt-1 form-input"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={calculateCosts}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Calculate Costs
          </button>
        </div>
      </div>

      <NavigationButtons />
    </div>
  );
}