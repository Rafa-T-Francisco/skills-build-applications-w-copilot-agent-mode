import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import activity from '../models/activity';
import leaderboard from '../models/leaderboard';
import team from '../models/team';
import user from '../models/user';
import workout from '../models/workout';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase(): Promise<void> {
  try {
    await connectDatabase();

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
    const teamIds = new Map<string, mongoose.Types.ObjectId>();

    for (const data of teamData) {
      const existingTeam = await team.findOne({ name: data.name }).exec();
      const seededTeam = existingTeam ?? (await team.create(data));
      teamIds.set(data.name, seededTeam._id);
    }

    const userData = [
      { username: 'maya.chen', name: 'Maya Chen', email: 'maya.chen@example.com', team: 'Trailblazers' },
      { username: 'leo.martin', name: 'Leo Martin', email: 'leo.martin@example.com', team: 'Trailblazers' },
      { username: 'amina.hassan', name: 'Amina Hassan', email: 'amina.hassan@example.com', team: 'Power Paddlers' },
      { username: 'noah.williams', name: 'Noah Williams', email: 'noah.williams@example.com', team: 'Power Paddlers' },
    ];
    const userIds = new Map<string, mongoose.Types.ObjectId>();

    for (const data of userData) {
      const teamId = teamIds.get(data.team);
      if (!teamId) {
        throw new Error(`Seed team "${data.team}" was not created`);
      }

      const existingUser = await user.findOne({ username: data.username }).exec();
      const seededUser =
        existingUser ??
        (await user.create({
          username: data.username,
          name: data.name,
          email: data.email,
          team: teamId,
        }));

      if (!existingUser) {
        continue;
      }

      existingUser.name = data.name;
      existingUser.email = data.email;
      existingUser.team = teamId;
      await existingUser.save();
      userIds.set(data.username, existingUser._id);
      continue;
    }

    for (const data of userData) {
      const existingUser = await user.findOne({ username: data.username }).exec();
      if (!existingUser) {
        throw new Error(`Seed user "${data.username}" was not created`);
      }
      userIds.set(data.username, existingUser._id);
    }

    for (const data of teamData) {
      const teamId = teamIds.get(data.name);
      if (!teamId) {
        throw new Error(`Seed team "${data.name}" was not created`);
      }
      const memberIds = userData
        .filter((member) => member.team === data.name)
        .map((member) => {
          const userId = userIds.get(member.username);
          if (!userId) {
            throw new Error(`Seed user "${member.username}" was not created`);
          }
          return userId;
        });
      await team.updateOne({ _id: teamId }, { $set: { members: memberIds } }).exec();
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
      const userId = userIds.get(data.username);
      const userDataEntry = userData.find((entry) => entry.username === data.username);
      const teamId = userDataEntry ? teamIds.get(userDataEntry.team) : undefined;
      if (!userId || !teamId) {
        throw new Error(`Seed user "${data.username}" was not created`);
      }

      const date = new Date(`${data.date}T12:00:00.000Z`);
      const existingActivity = await activity
        .findOne({ user: userId, type: data.type, date })
        .exec();

      if (!existingActivity) {
        await activity.create({
          user: userId,
          team: teamId,
          type: data.type,
          activityType: data.type,
          duration: data.duration,
          durationMinutes: data.duration,
          points: data.points,
          date,
        });
      }
    }

    const leaderboardData = [
      { username: 'maya.chen', points: 350, rank: 1 },
      { username: 'leo.martin', points: 330, rank: 2 },
      { username: 'amina.hassan', points: 300, rank: 3 },
      { username: 'noah.williams', points: 240, rank: 4 },
    ];

    for (const data of leaderboardData) {
      const userId = userIds.get(data.username);
      const userDataEntry = userData.find((entry) => entry.username === data.username);
      const teamId = userDataEntry ? teamIds.get(userDataEntry.team) : undefined;
      if (!userId || !teamId) {
        throw new Error(`Seed user "${data.username}" was not created`);
      }

      const existingEntry = await leaderboard.findOne({ user: userId, team: teamId }).exec();
      if (existingEntry) {
        existingEntry.points = data.points;
        existingEntry.rank = data.rank;
        await existingEntry.save();
      } else {
        await leaderboard.create({ user: userId, team: teamId, points: data.points, rank: data.rank });
      }
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
      const userId = userIds.get(data.username);
      if (!userId) {
        throw new Error(`Seed user "${data.username}" was not created`);
      }

      const existingWorkout = await workout.findOne({ name: data.name }).exec();
      if (!existingWorkout) {
        await workout.create({
          user: userId,
          name: data.name,
          title: data.name,
          description: data.description,
          difficulty: data.difficulty,
          duration: data.duration,
          durationMinutes: data.duration,
          category: data.category,
          activityType: data.category,
        });
      }
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
