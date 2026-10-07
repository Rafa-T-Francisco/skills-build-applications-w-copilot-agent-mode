import mongoose, { Schema } from 'mongoose';

const workoutSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    difficulty: { type: String, trim: true },
    duration: { type: Number, min: 0 },
    durationMinutes: { type: Number, min: 0 },
    category: { type: String, trim: true },
    activityType: { type: String, trim: true },
  },
  { timestamps: true, collection: 'workouts' },
);

const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);

export default Workout;
