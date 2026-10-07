import mongoose, { Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, default: 0 },
    rank: { type: Number, min: 1 },
  },
  { timestamps: true, collection: 'leaderboard' },
);

const Leaderboard =
  mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;
