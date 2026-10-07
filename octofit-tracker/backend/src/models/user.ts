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

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
