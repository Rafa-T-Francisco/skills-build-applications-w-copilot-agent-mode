import { Router } from 'express';
import Activity from '../models/activity';
import Leaderboard from '../models/leaderboard';
import Team from '../models/team';
import User from '../models/user';
import Workout from '../models/workout';

const router = Router();

router.get('/api/users/', async (_request, response) => {
  const users = await User.find().lean().exec();
  response.json(users);
});

router.get('/api/teams/', async (_request, response) => {
  const teams = await Team.find().lean().exec();
  response.json(teams);
});

router.get('/api/activities/', async (_request, response) => {
  const activities = await Activity.find().lean().exec();
  response.json(activities);
});

router.get('/api/leaderboard/', async (_request, response) => {
  const leaderboard = await Leaderboard.find().sort({ points: -1, rank: 1 }).lean().exec();
  response.json(leaderboard);
});

router.get('/api/workouts/', async (_request, response) => {
  const workouts = await Workout.find().lean().exec();
  response.json(workouts);
});

export default router;
