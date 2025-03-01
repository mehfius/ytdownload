import { Request, Response, NextFunction } from 'express';
/**
 * Middleware para tratar erros na aplicação
 */
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
