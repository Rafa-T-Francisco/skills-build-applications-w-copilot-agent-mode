import mongoose from 'mongoose';
import { connectToDatabase } from '../config/database';
import { Activity, Leaderboard, Team, User, Workout } from '../models';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectToDatabase();

    const teamData = [
      {
        name: 'Trailblazers',
        description: 'A team focused on running, hiking, and outdoor fitness.',
        points: 680,
      },
      {
        name: 'Power Paddlers',
        description: 'A team building strength and endurance together.',
        points: 540,
      },
    ];
    const teams = new Map<string, (typeof Team.prototype)>();

    for (const data of teamData) {
      const team = await Team.findOneAndUpdate(
        { name: data.name },
        { $set: data },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).exec();
      teams.set(data.name, team);
    }

    const userData = [
      { username: 'maya.chen', name: 'Maya Chen', email: 'maya.chen@example.com', team: 'Trailblazers' },
      { username: 'leo.martin', name: 'Leo Martin', email: 'leo.martin@example.com', team: 'Trailblazers' },
      { username: 'amina.hassan', name: 'Amina Hassan', email: 'amina.hassan@example.com', team: 'Power Paddlers' },
      { username: 'noah.williams', name: 'Noah Williams', email: 'noah.williams@example.com', team: 'Power Paddlers' },
    ];
    const users = new Map<string, (typeof User.prototype)>();

    for (const data of userData) {
      const team = teams.get(data.team);
      if (!team) {
        throw new Error(`Seed team "${data.team}" was not created`);
      }

      const user = await User.findOneAndUpdate(
        { username: data.username },
        { $set: { name: data.name, email: data.email, team: team._id } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ).exec();
      users.set(data.username, user);
    }

    for (const teamDataEntry of teamData) {
      const team = teams.get(teamDataEntry.name);
      if (!team) {
        throw new Error(`Seed team "${teamDataEntry.name}" was not created`);
      }

      const memberIds = userData
        .filter((user) => user.team === teamDataEntry.name)
        .map((user) => {
          const seededUser = users.get(user.username);
          if (!seededUser) {
            throw new Error(`Seed user "${user.username}" was not created`);
          }
          return seededUser._id;
        });

      await Team.updateOne({ _id: team._id }, { $set: { members: memberIds } }).exec();
    }

    const activityData = [
      { username: 'maya.chen', type: 'Running', duration: 35, points: 120, date: '2026-10-06' },
      { username: 'maya.chen', type: 'Yoga', duration: 40, points: 80, date: '2026-10-04' },
      { username: 'leo.martin', type: 'Cycling', duration: 50, points: 140, date: '2026-10-06' },
      { username: 'leo.martin', type: 'Hiking', duration: 65, points: 160, date: '2026-10-03' },
      { username: 'amina.hassan', type: 'Swimming', duration: 30, points: 110, date: '2026-10-06' },
      { username: 'amina.hassan', type: 'Strength training', duration: 45, points: 130, date: '2026-10-05' },
      { username: 'noah.williams', type: 'Rowing', duration: 40, points: 125, date: '2026-10-06' },
      { username: 'noah.williams', type: 'Running', duration: 25, points: 95, date: '2026-10-04' },
    ];

    for (const data of activityData) {
      const user = users.get(data.username);
      if (!user) {
        throw new Error(`Seed user "${data.username}" was not created`);
      }

      const activityDate = new Date(`${data.date}T12:00:00.000Z`);
      await Activity.updateOne(
        { user: user._id, type: data.type, date: activityDate },
        {
          $set: {
            team: user.team,
            activityType: data.type,
            duration: data.duration,
            durationMinutes: data.duration,
            points: data.points,
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      ).exec();
    }

    const leaderboardData = [
      { username: 'maya.chen', points: 350, rank: 1 },
      { username: 'leo.martin', points: 330, rank: 2 },
      { username: 'amina.hassan', points: 300, rank: 3 },
      { username: 'noah.williams', points: 240, rank: 4 },
    ];

    for (const data of leaderboardData) {
      const user = users.get(data.username);
      if (!user) {
        throw new Error(`Seed user "${data.username}" was not created`);
      }

      await Leaderboard.updateOne(
        { user: user._id, team: user.team },
        { $set: { points: data.points, rank: data.rank } },
        { upsert: true, setDefaultsOnInsert: true },
      ).exec();
    }

    const workoutData = [
      {
        username: 'maya.chen',
        name: 'Steady-state run',
        description: 'A conversational-paced run to build aerobic endurance.',
        difficulty: 'Beginner',
        duration: 30,
        category: 'Cardio',
      },
      {
        username: 'leo.martin',
        name: 'Hill interval ride',
        description: 'Alternate focused climbs with easy recovery periods.',
        difficulty: 'Intermediate',
        duration: 45,
        category: 'Cycling',
      },
      {
        username: 'amina.hassan',
        name: 'Full-body strength',
        description: 'A balanced session of bodyweight and resistance exercises.',
        difficulty: 'Intermediate',
        duration: 40,
        category: 'Strength',
      },
      {
        username: 'noah.williams',
        name: 'Endurance swim',
        description: 'A relaxed set of continuous laps with technique breaks.',
        difficulty: 'Beginner',
        duration: 35,
        category: 'Swimming',
      },
      {
        username: 'maya.chen',
        name: 'Recovery flow',
        description: 'Gentle mobility and stretching after an active day.',
        difficulty: 'Beginner',
        duration: 20,
        category: 'Flexibility',
      },
    ];

    for (const data of workoutData) {
      const user = users.get(data.username);
      if (!user) {
        throw new Error(`Seed user "${data.username}" was not created`);
      }

      await Workout.updateOne(
        { name: data.name },
        {
          $set: {
            user: user._id,
            title: data.name,
            description: data.description,
            difficulty: data.difficulty,
            duration: data.duration,
            durationMinutes: data.duration,
            category: data.category,
            activityType: data.category,
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      ).exec();
    }

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();
