import { NextFunction, Request, Response } from 'express';
import { menuService } from '../services/menuService';

export const menuController = {
    async getMenu(_req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await menuService.getMenu() });
        } catch (error) { next(error); }
    },
    async listCategories(_req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await menuService.listCategories() });
        } catch (error) { next(error); }
    },
    async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(201).json({ success: true, data: await menuService.createCategory(req.body) });
        } catch (error) { next(error); }
    },
    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await menuService.updateCategory(req.params.id, req.body) });
        } catch (error) { next(error); }
    },
    async removeCategory(req: Request, res: Response, next: NextFunction) {
        try {
            await menuService.removeCategory(req.params.id);
            res.status(204).send();
        } catch (error) { next(error); }
    },
    async listDishes(_req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await menuService.listDishes() });
        } catch (error) { next(error); }
    },
    async createDish(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(201).json({ success: true, data: await menuService.createDish(req.body) });
        } catch (error) { next(error); }
    },
    async updateDish(req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await menuService.updateDish(req.params.id, req.body) });
        } catch (error) { next(error); }
    },
    async removeDish(req: Request, res: Response, next: NextFunction) {
        try {
            await menuService.removeDish(req.params.id);
            res.status(204).send();
        } catch (error) { next(error); }
    },
};
