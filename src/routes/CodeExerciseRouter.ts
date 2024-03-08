import express from 'express';
import codeExerciseController from '../controllers/codeExerciseController';

const router = express.Router();

router.get('/', codeExerciseController.getAllCodeExercises);
router.get('/:id', codeExerciseController.getCodeExercise);

router.post('/', codeExerciseController.postCodeExercise);

router.patch('/:id', codeExerciseController.postCodeExercise);

router.delete('/:id', codeExerciseController.deleteCodeExercise);

export = router;
