import mongoose, { Schema } from 'mongoose';

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

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;
