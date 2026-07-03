import { Request, Response } from "express";
import * as applicationService from "../services/application.service";

export async function listHandler(req: Request, res: Response): Promise<void> {
  const applications = await applicationService.listApplications(req.user!.userId);
  res.status(200).json(applications);
}

export async function getHandler(req: Request, res: Response): Promise<void> {
  const application = await applicationService.getApplication(req.user!.userId, req.params.id);
  res.status(200).json(application);
}

export async function createHandler(req: Request, res: Response): Promise<void> {
  const application = await applicationService.createApplication(req.user!.userId, req.body);
  res.status(201).json(application);
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const application = await applicationService.updateApplication(
    req.user!.userId,
    req.params.id,
    req.body
  );
  res.status(200).json(application);
}

export async function deleteHandler(req: Request, res: Response): Promise<void> {
  await applicationService.deleteApplication(req.user!.userId, req.params.id);
  res.status(204).send();
}
