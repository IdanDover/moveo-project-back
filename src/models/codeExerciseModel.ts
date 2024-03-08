import mongoose from 'mongoose';
import { onlyLettersAndSpaces, slugify } from '../utils/stringUtils';

export type Level = 'easy' | 'intermediate' | 'hard' | 'expert';

export type CodeExerciseType = {
  title: string;
  explanation: string;
  code: string;
  solution: string;
  level: Level;
};

const codeExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'code exercise must have a title'],
    unique: true,
    trim: true,
    maxlength: [
      40,
      'A code exercise title must have less or equal than 40 characters',
    ],
    validate: [
      onlyLettersAndSpaces,
      'code exercise title must only contain characters',
    ],
  },
  slug: String,
  explanation: {
    type: String,
    required: [true, 'code exercise must have an explanation'],
  },
  code: {
    type: String,
    required: [true, 'you must add the starting code for the exercise'],
    trim: true,
  },
  solution: {
    type: String,
    trim: true,
  },
  level: {
    type: String,
    enum: {
      values: ['easy', 'intermediate', 'hard', 'expert'],
      message: 'The level you specified does not exist',
    },
    default: 'intermediate',
  },
});

codeExerciseSchema.pre('save', function (next) {
  this.slug = slugify(this.title);
  next();
});

const CodeExercise = mongoose.model('CodeExercise', codeExerciseSchema);

export default CodeExercise;
