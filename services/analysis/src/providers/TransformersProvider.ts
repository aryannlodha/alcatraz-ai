import { pipeline, env } from '@xenova/transformers';
import { Fact } from '@alcatraz/contracts';
import { AIProvider, ExtractedText } from '../pipeline.js';
import { v4 as uuidv4 } from 'uuid';

// Suppress local file warnings for WebGPU
env.allowLocalModels = false;
env.useBrowserCache = true;

export class TransformersProvider implements AIProvider {
  name = 'Transformers.js NER';
  isCloud = false;
  private modelPipeline: any = null;
  private initializing = false;

  private async getPipeline() {
    if (this.modelPipeline) return this.modelPipeline;
    if (this.initializing) {
      // Wait for initialization to complete if already requested
      while (this.initializing) {
        await new Promise(r => setTimeout(r, 100));
      }
      return this.modelPipeline;
    }
    
    this.initializing = true;
    try {
      console.log('Loading local Xenova NER model (only runs once)...');
      // Using a quantized model for fast inference in browser
      this.modelPipeline = await pipeline('token-classification', 'Xenova/bert-base-NER', {
        quantized: true,
      });
      console.log('Model loaded successfully.');
    } catch (err) {
      console.error('Failed to load local model:', err);
    } finally {
      this.initializing = false;
    }
    return this.modelPipeline;
  }

  async extractFacts(text: ExtractedText): Promise<Fact[]> {
    const facts: Fact[] = [];
    if (!text.content.trim()) return facts;

    try {
      const ner = await this.getPipeline();
      if (!ner) return facts;

      // NER pipeline extracts entities: PER (Person), ORG (Organization), LOC (Location), MISC
      const results = await ner(text.content);
      
      let currentEntity = '';
      let currentType = '';
      let currentScore = 0;
      
      // Group B/I tokens
      for (const token of results) {
        if (token.entity.startsWith('B-')) {
          if (currentEntity) {
            this.pushFact(facts, currentType, currentEntity, currentScore, text);
          }
          currentEntity = token.word.replace('##', '');
          currentType = token.entity.replace('B-', '');
          currentScore = token.score;
        } else if (token.entity.startsWith('I-') && currentType === token.entity.replace('I-', '')) {
          currentEntity += token.word.startsWith('##') ? token.word.replace('##', '') : ' ' + token.word;
          currentScore = Math.min(currentScore, token.score); // keep lowest confidence of the group
        }
      }
      
      if (currentEntity) {
        this.pushFact(facts, currentType, currentEntity, currentScore, text);
      }
      
    } catch (e) {
      console.error('Inference error:', e);
    }

    return facts;
  }

  private pushFact(facts: Fact[], type: string, value: string, score: number, text: ExtractedText) {
    if (value.length < 2) return;
    
    let attribute = '';
    let entity = 'Unknown';
    
    if (type === 'PER') {
      attribute = 'person_name';
      entity = 'User';
    } else if (type === 'ORG') {
      attribute = 'vendor_name';
      entity = 'Vendor';
    } else if (type === 'LOC') {
      attribute = 'location';
      entity = 'Location';
    } else {
      return; // Skip MISC for now to avoid noise
    }

    facts.push({
      id: uuidv4(),
      entity,
      attribute,
      value: value.trim(),
      normalizedValue: null,
      confidence: score,
      sourceId: text.sourceId,
      evidence: {
        excerpt: `Found ${type} entity: ${value.trim()}`
      }
    });
  }
}
