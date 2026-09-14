import { AIProvider, ExtractedText, AnalysisResult } from './pipeline.js';
import { RegexProvider } from './providers/RegexProvider.js';
import { ONNXProvider } from './providers/ONNXProvider.js';
import { TransformersProvider } from './providers/TransformersProvider.js';

export { AnalysisPipeline } from './pipeline.js';
export { RegexProvider, ONNXProvider, TransformersProvider };

// Factory for getting the default provider chain
export function getDefaultProviders(): AIProvider[] {
  return [
    new TransformersProvider(),
    new RegexProvider(),
    new ONNXProvider()
  ];
}
