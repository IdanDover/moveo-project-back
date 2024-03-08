import express from 'express';
import codeExerciseController from '../controllers/codeExerciseController';
import { whiteListUrlQuery } from '../utils/middlewareUtils';

const router = express.Router();

router.get(
  '/',
  whiteListUrlQuery(['page', 'limit']),
  codeExerciseController.getAllCodeExercises
);
router.get(
  '/:id',
  whiteListUrlQuery(['findBy']),
  codeExerciseController.getCodeExercise
);

router.post('/', codeExerciseController.postCodeExercise);

router.patch('/:id', codeExerciseController.updateCodeExercise);

router.delete('/:id', codeExerciseController.deleteCodeExercise);

export = router;
