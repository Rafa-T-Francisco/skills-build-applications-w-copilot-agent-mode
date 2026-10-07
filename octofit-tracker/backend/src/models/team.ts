import mongoose, { Schema } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'teams' },
);

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

export default Team;
