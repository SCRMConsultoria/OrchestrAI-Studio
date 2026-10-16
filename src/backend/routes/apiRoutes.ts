import { Router } from 'express';
import { generateModelContent } from '../controllers/modelController';
import { synthesizeSpeech } from '../controllers/voiceController';
import { searchWeb } from '../controllers/toolsController';
import { runEvaluationTest } from '../controllers/evalsController';
import {
  getDbStatus,
  getAllData,
  getAgents,
  saveAgent,
  deleteAgent,
  getWorkflows,
  saveWorkflow,
  saveRun,
  saveUser,
  saveEval,
  saveVersion,
} from '../controllers/databaseController';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Database & Data Endpoints
apiRouter.get('/db/status', getDbStatus);
apiRouter.get('/data/all', getAllData);

apiRouter.get('/agents', getAgents);
apiRouter.post('/agents', saveAgent);
apiRouter.delete('/agents/:id', deleteAgent);

apiRouter.get('/workflows', getWorkflows);
apiRouter.post('/workflows', saveWorkflow);

apiRouter.post('/runs', saveRun);
apiRouter.post('/users', saveUser);
apiRouter.post('/evals', saveEval);
apiRouter.post('/versions', saveVersion);

// AI & Services Endpoints
apiRouter.post('/models/generate', generateModelContent);
apiRouter.post('/voice/tts', synthesizeSpeech);
apiRouter.post('/tools/search', searchWeb);
apiRouter.post('/evals/run-test', runEvaluationTest);
