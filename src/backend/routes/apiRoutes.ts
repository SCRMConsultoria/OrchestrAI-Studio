import { Router } from 'express';
import { generateModelContent } from '../controllers/modelController';
import { synthesizeSpeech } from '../controllers/voiceController';
import { searchWeb } from '../controllers/toolsController';
import { runEvaluationTest } from '../controllers/evalsController';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

apiRouter.post('/models/generate', generateModelContent);
apiRouter.post('/voice/tts', synthesizeSpeech);
apiRouter.post('/tools/search', searchWeb);
apiRouter.post('/evals/run-test', runEvaluationTest);
