import { Request, Response } from 'express';
import { dbClient } from '../db/client';
import { DB_CONSTANTS } from '../constants/dbConstants';
import { LOG_CONSTANTS } from '../constants/logConstants';

export async function getDbStatus(req: Request, res: Response) {
  try {
    const status = dbClient.getStatus();
    res.json(status);
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_DB_STATUS });
  }
}

export async function getAllData(req: Request, res: Response) {
  try {
    const data = await dbClient.getAllData();
    res.json(data);
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_LOAD_DATA });
  }
}

export async function getAgents(req: Request, res: Response) {
  try {
    const agents = await dbClient.getAgents();
    res.json(agents);
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_LOAD_AGENTS });
  }
}

export async function saveAgent(req: Request, res: Response) {
  try {
    const agent = req.body;
    const saved = await dbClient.saveAgent(agent);
    res.json(saved);
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_SAVE_AGENT });
  }
}

export async function deleteAgent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await dbClient.deleteAgent(id);
    res.json({ success: true, id });
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_DELETE_AGENT });
  }
}

export async function getWorkflows(req: Request, res: Response) {
  try {
    const workflows = await dbClient.getWorkflows();
    res.json(workflows);
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_LOAD_WORKFLOWS });
  }
}

export async function saveWorkflow(req: Request, res: Response) {
  try {
    const workflow = req.body;
    const saved = await dbClient.saveWorkflow(workflow);
    res.json(saved);
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_SAVE_WORKFLOW });
  }
}

export async function saveRun(req: Request, res: Response) {
  try {
    const run = req.body;
    const saved = await dbClient.saveRun(run);
    res.json(saved);
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_SAVE_RUN });
  }
}

export async function saveUser(req: Request, res: Response) {
  try {
    const user = req.body;
    const saved = await dbClient.saveUser(user);
    res.json(saved);
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_SAVE_USER });
  }
}

export async function saveEval(req: Request, res: Response) {
  try {
    const evalCase = req.body;
    const saved = await dbClient.saveEval(evalCase);
    res.json(saved);
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_SAVE_EVAL });
  }
}

export async function saveVersion(req: Request, res: Response) {
  try {
    const version = req.body;
    const saved = await dbClient.saveVersion(version);
    res.json(saved);
  } catch (error: any) {
    console.error(LOG_CONSTANTS.DATABASE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || DB_CONSTANTS.ERROR_SAVE_VERSION });
  }
}
