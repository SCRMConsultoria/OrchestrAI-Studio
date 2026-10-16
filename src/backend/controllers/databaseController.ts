import { Request, Response } from 'express';
import { dbClient } from '../db/client';

export async function getDbStatus(req: Request, res: Response) {
  try {
    const status = dbClient.getStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao verificar banco de dados' });
  }
}

export async function getAllData(req: Request, res: Response) {
  try {
    const data = await dbClient.getAllData();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao carregar dados' });
  }
}

export async function getAgents(req: Request, res: Response) {
  try {
    const agents = await dbClient.getAgents();
    res.json(agents);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao carregar agentes' });
  }
}

export async function saveAgent(req: Request, res: Response) {
  try {
    const agent = req.body;
    const saved = await dbClient.saveAgent(agent);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao salvar agente' });
  }
}

export async function deleteAgent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await dbClient.deleteAgent(id);
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao remover agente' });
  }
}

export async function getWorkflows(req: Request, res: Response) {
  try {
    const workflows = await dbClient.getWorkflows();
    res.json(workflows);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao carregar fluxos' });
  }
}

export async function saveWorkflow(req: Request, res: Response) {
  try {
    const workflow = req.body;
    const saved = await dbClient.saveWorkflow(workflow);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao salvar fluxo' });
  }
}

export async function saveRun(req: Request, res: Response) {
  try {
    const run = req.body;
    const saved = await dbClient.saveRun(run);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao registrar execução' });
  }
}

export async function saveUser(req: Request, res: Response) {
  try {
    const user = req.body;
    const saved = await dbClient.saveUser(user);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao salvar usuário' });
  }
}

export async function saveEval(req: Request, res: Response) {
  try {
    const evalCase = req.body;
    const saved = await dbClient.saveEval(evalCase);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao salvar avaliação' });
  }
}

export async function saveVersion(req: Request, res: Response) {
  try {
    const version = req.body;
    const saved = await dbClient.saveVersion(version);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao salvar versão' });
  }
}
