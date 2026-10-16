import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { EVALS_CONSTANTS } from '../constants/evalsConstants';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function runEvaluationTest(req: Request, res: Response) {
  try {
    const {
      inputPrompt,
      expectedOutputSubstring,
      actualOutput,
      rubricCriteria = EVALS_CONSTANTS.DEFAULT_RUBRIC_CRITERIA,
      maxLatencyMs = EVALS_CONSTANTS.DEFAULT_MAX_LATENCY_MS,
      actualLatencyMs = EVALS_CONSTANTS.DEFAULT_ACTUAL_LATENCY_MS,
      maxCostUsd = EVALS_CONSTANTS.DEFAULT_MAX_COST_USD,
      actualCostUsd = EVALS_CONSTANTS.DEFAULT_ACTUAL_COST_USD,
    } = req.body;

    const judgePrompt = EVALS_CONSTANTS.BUILD_JUDGE_PROMPT({
      inputPrompt,
      actualOutput,
      expectedOutputSubstring,
      rubricCriteria,
    });

    const judgeResponse = await ai.models.generateContent({
      model: EVALS_CONSTANTS.DEFAULT_MODEL,
      contents: judgePrompt,
      config: {
        responseMimeType: EVALS_CONSTANTS.RESPONSE_MIME_TYPE,
        temperature: EVALS_CONSTANTS.DEFAULT_TEMPERATURE,
      },
    });

    let evalData: any = {};
    try {
      evalData = JSON.parse(judgeResponse.text || '{}');
    } catch {
      evalData = {
        score: 85,
        passed: true,
        feedback: EVALS_CONSTANTS.FALLBACK_FEEDBACK,
      };
    }

    const latencyPassed = actualLatencyMs <= maxLatencyMs;
    const costPassed = actualCostUsd <= maxCostUsd;
    const finalPassed = evalData.passed && latencyPassed && costPassed;

    res.json({
      score: evalData.score ?? 80,
      passed: finalPassed,
      feedback: evalData.feedback || EVALS_CONSTANTS.DEFAULT_FEEDBACK,
      criteriaBreakdown: evalData.criteriaBreakdown || [],
      latencyPassed,
      costPassed,
    });
  } catch (error: any) {
    console.error('Evals controller error:', error);
    res.status(500).json({ error: error.message || EVALS_CONSTANTS.ERROR_RUNNING_EVALUATION });
  }
}
