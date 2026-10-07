import { Router } from 'express';
import { Activity, Leaderboard, Team, User, Workout } from '../models';

const apiRouter = Router();

apiRouter.get('/users/', async (_request, response) => {
  const users = await User.find().lean().exec();
  response.json(users);
});

apiRouter.get('/teams/', async (_request, response) => {
  const teams = await Team.find().lean().exec();
  response.json(teams);
});

apiRouter.get('/activities/', async (_request, response) => {
  const activities = await Activity.find().lean().exec();
  response.json(activities);
});

apiRouter.get('/leaderboard/', async (_request, response) => {
  const leaderboard = await Leaderboard.find().sort({ points: -1, rank: 1 }).lean().exec();
  response.json(leaderboard);
});

apiRouter.get('/workouts/', async (_request, response) => {
  const workouts = await Workout.find().lean().exec();
  response.json(workouts);
});

export default apiRouter;
