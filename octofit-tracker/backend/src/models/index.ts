import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, trim: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true, collection: 'users' },
);

const teamSchema = new Schema(
  {
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'teams' },
);

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    type: { type: String, trim: true },
    activityType: { type: String, trim: true },
    duration: { type: Number, min: 0 },
    durationMinutes: { type: Number, min: 0 },
    points: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'activities' },
);

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, default: 0 },
    rank: { type: Number, min: 1 },
  },
  { timestamps: true, collection: 'leaderboard' },
);

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

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
export const Leaderboard =
  mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);
export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
