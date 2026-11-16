import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { employeeService } from '../services/employeeService';

export const employeeController = {
    async list(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await employeeService.list() });
        }
        catch (error) { next(error); }
    },
    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            res.status(201).json({ success: true, data: await employeeService.create(req.body) });
        }
        catch (error) { next(error); }
    },
    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await employeeService.update(req.params.id, req.body) });
        }
        catch (error) { next(error); }
    },
    async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await employeeService.remove(req.params.id, req.user!.id); res.status(204).send();
        }
        catch (error) { next(error); }
    },
};
