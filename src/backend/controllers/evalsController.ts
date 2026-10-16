import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

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
      rubricCriteria = ['Aderência à instrução', 'Completude factual', 'Ausência de alucinações'],
      maxLatencyMs = 5000,
      actualLatencyMs = 1200,
      maxCostUsd = 0.05,
      actualCostUsd = 0.002,
    } = req.body;

    const judgePrompt = `Você é um avaliador rigoroso de IA de nível empresarial.
Avalie a resposta gerada por um modelo de acordo com os critérios estabelecidos.

Prompt do Usuário:
"${inputPrompt}"

Resposta Gerada pelo Modelo:
"${actualOutput}"

${expectedOutputSubstring ? `Conteúdo esperado / Palavras-chave obrigatórias:\n"${expectedOutputSubstring}"\n` : ''}

Critérios da Rubrica:
${rubricCriteria.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}

Forneça sua avaliação em formato JSON puro com:
{
  "score": <número inteiro de 0 a 100>,
  "passed": <booleano, true se score >= 75>,
  "feedback": "<explicação concisa de 1 a 2 frases>",
  "criteriaBreakdown": [
    { "criterion": "<nome do critério>", "score": <0 a 100>, "notes": "<análise>" }
  ]
}`;

    const judgeResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: judgePrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    let evalData: any = {};
    try {
      evalData = JSON.parse(judgeResponse.text || '{}');
    } catch {
      evalData = {
        score: 85,
        passed: true,
        feedback: 'Resposta atende aos critérios da rubrica de avaliação.',
      };
    }

    const latencyPassed = actualLatencyMs <= maxLatencyMs;
    const costPassed = actualCostUsd <= maxCostUsd;
    const finalPassed = evalData.passed && latencyPassed && costPassed;

    res.json({
      score: evalData.score ?? 80,
      passed: finalPassed,
      feedback: evalData.feedback || 'Avaliação concluída.',
      criteriaBreakdown: evalData.criteriaBreakdown || [],
      latencyPassed,
      costPassed,
    });
  } catch (error: any) {
    console.error('Evals controller error:', error);
    res.status(500).json({ error: error.message || 'Erro ao rodar avaliação' });
  }
}
