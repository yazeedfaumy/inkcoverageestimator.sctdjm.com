export interface AnalysisResult {
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

export interface CostResult {
  colorCost: number;
  grayscaleCost: number;
  colorDetails?: {
    cyan: number;
    magenta: number;
    yellow: number;
    black: number;
  };
}

export interface CartridgeSettings {
  mode: "separate" | "combined";
  separate: {
    [key: string]: {
      price: number;
      yield: number;
    };
  };
  combined: {
    color: {
      price: number;
      yield: number;
    };
    key: {
      price: number;
      yield: number;
    };
  };
}

export interface Report {
  id: string;
  fileName: string;
  date: string;
  analysisResults: AnalysisResult[];
  costResults: {
    pageNumber: number;
    colorCost: number;
    grayscaleCost: number;
    potentialSavings: number;
  }[];
}