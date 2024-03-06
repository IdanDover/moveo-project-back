import express from 'express';
import codeBlockController from '../controllers/codeBlockController';

const router = express.Router();

router.get('/', codeBlockController.getAllCodeBlock);
router.get('/:id', codeBlockController.getCodeBlock);

export = router;
