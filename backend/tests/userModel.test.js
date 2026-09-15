import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/userModel.js';

let mongod;

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test('hashes the password on creation', async () => {
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'plaintextpassword',
    role: 'customer',
  });

  assert.notEqual(user.password, 'plaintextpassword');
  assert.ok(await bcrypt.compare('plaintextpassword', user.password));
});

test('does NOT re-hash the password on an unrelated update (regression test)', async () => {
  const user = await User.create({
    username: 'testuser2',
    email: 'test2@example.com',
    password: 'plaintextpassword',
    role: 'customer',
  });

  const hashAfterCreate = user.password;

  // Update an unrelated field and save again - this used to silently
  // re-hash the already-hashed password every time, eventually breaking
  // login for any user who ever updated their profile.
  user.phone = '08012345678';
  await user.save();

  assert.equal(user.password, hashAfterCreate);
  assert.ok(await bcrypt.compare('plaintextpassword', user.password));
});

test('does re-hash the password when it is actually changed', async () => {
  const user = await User.create({
    username: 'testuser3',
    email: 'test3@example.com',
    password: 'oldpassword',
    role: 'customer',
  });

  user.password = 'newpassword';
  await user.save();

  assert.ok(await bcrypt.compare('newpassword', user.password));
  assert.equal(await bcrypt.compare('oldpassword', user.password), false);
});
