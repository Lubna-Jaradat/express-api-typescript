import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-error';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  console.error('Unexpected error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
};