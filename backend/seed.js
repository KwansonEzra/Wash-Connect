// One-time (or repeatable) database bootstrap script.
//
// Usage:
//   node seed.js            # seed baseline data (states, locations, service categories)
//   node seed.js --admin    # also create an admin user from ADMIN_EMAIL / ADMIN_PASSWORD in .env
//   node seed.js --destroy  # wipe all seeded collections
//
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import State from './models/stateModel.js';
import Location from './models/locationModel.js';
import ServiceCategory from './models/serviceCategoryModel.js';

dotenv.config();

const states = [
  { name: 'Borno', code: 'BO' },
  { name: 'Yobe', code: 'YB' },
  { name: 'Lagos', code: 'LA' },
  { name: 'Abuja (FCT)', code: 'FC' },
];

const locationsByState = {
  Borno: ['Maiduguri', 'Jere'],
  Yobe: ['Damaturu', 'Potiskum'],
  Lagos: ['Ikeja', 'Lekki', 'Surulere'],
  'Abuja (FCT)': ['Garki', 'Wuse'],
};

const serviceCategories = [
  { name: 'Wash & Fold', items: ['tshirt', 'trousers', 'bedsheet', 'towel'], allowsCustomItem: true },
  { name: 'Ironing', items: ['shirt', 'trousers', 'agbada', 'suit'], allowsCustomItem: true },
  { name: 'Dry Cleaning', items: ['suit', 'coat', 'traditional_wear'], allowsCustomItem: false },
];

const seedData = async () => {
  const createdStates = {};
  for (const s of states) {
    const state = await State.findOneAndUpdate({ name: s.name }, s, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    createdStates[state.name] = state;
  }

  for (const [stateName, locationNames] of Object.entries(locationsByState)) {
    const state = createdStates[stateName];
    if (!state) continue;
    for (const name of locationNames) {
      await Location.findOneAndUpdate(
        { name, state: state._id },
        { name, state: state._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  }

  for (const category of serviceCategories) {
    await ServiceCategory.findOneAndUpdate({ name: category.name }, category, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }

  console.log('Seeded states, locations, and service categories.');
};

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('Skipping admin creation: set ADMIN_EMAIL and ADMIN_PASSWORD in .env to create one.');
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin user ${email} already exists.`);
    return;
  }

  await User.create({
    username: process.env.ADMIN_USERNAME || 'admin',
    email,
    password,
    role: 'admin',
  });
  console.log(`Created admin user: ${email}`);
};

const destroyData = async () => {
  await State.deleteMany();
  await Location.deleteMany();
  await ServiceCategory.deleteMany();
  console.log('Destroyed seeded states, locations, and service categories.');
};

const run = async () => {
  await connectDB();

  try {
    if (process.argv.includes('--destroy')) {
      await destroyData();
    } else {
      await seedData();
      if (process.argv.includes('--admin')) {
        await seedAdmin();
      }
    }
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

run();
