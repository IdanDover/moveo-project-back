import { NextFunction, Request, Response } from 'express';
import catchAsync from '../errors/catchAsync';
import AppError from '../errors/appError';
import fsUtils from '../utils/fsUtils';
import CodeExercise, { CodeExerciseType } from '../models/codeExerciseModel';

const getAllCodeExercises = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page: number = +req?.query?.page || 1;
    const limit: number = +req?.query?.limit || 100;
    const skip = (page - 1) * limit;
    const codeExercises: CodeExerciseType[] = await CodeExercise.find(
      {},
      null,
      { limit, skip }
    );

    res.status(200).json({
      status: 'success',
      length: codeExercises.length,
      data: codeExercises,
    });
  }
);

const getCodeExercise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let findBy: string | null = null;
    if (req.query.findBy) {
      findBy = req.query.findBy as string;
    }

    const codeExercise: CodeExerciseType = await CodeExercise.findOne({
      [findBy ?? '_id']: req.params.id,
    });

    if (!codeExercise) {
      return next(
        new AppError('no code exercise found with the given id or field', 400)
      );
    }

    res.status(200).json({
      status: 'success',
      data: codeExercise,
    });
  }
);

const postCodeExercise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return next(new AppError("You didn't send data to save", 400));
    }

    const codeExercise = await CodeExercise.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: codeExercise,
      },
    });
  }
);

const updateCodeExercise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return next(new AppError("You didn't send data to update", 400));
    }

    let codeExercise = await CodeExercise.findById(req.params.id);

    if (!codeExercise) {
      return next(
        new AppError('no code exercise found with the provided ID', 400)
      );
    }

    codeExercise = await CodeExercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      status: 'success',
      data: {
        data: codeExercise,
      },
    });
  }
);

const deleteCodeExercise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const codeExercise = await CodeExercise.findById(req.params.id);

    if (!codeExercise) {
      return next(
        new AppError('no code exercise found with the given ID', 404)
      );
    }

    await CodeExercise.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
    });
  }
);

export = {
  getAllCodeExercises,
  getCodeExercise,
  postCodeExercise,
  updateCodeExercise,
  deleteCodeExercise,
};
