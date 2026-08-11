// ============================================================
// utils/seedData.js - Populate Database with Sample Data
// ============================================================
// Run this once to create test accounts and sample events.
// Command: node utils/seedData.js
// ============================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Venue from '../models/Venue.js';
import Speaker from '../models/Speaker.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Event.deleteMany();
    await Venue.deleteMany();
    await Speaker.deleteMany();

    // Create Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventops.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'Regular User',
      email: 'user@eventops.com',
      password: 'user123',
      role: 'user',
    });
    console.log('✅ Users created');

    // Create Venues
    const venue1 = await Venue.create({
      name: 'Grand Convention Center',
      address: '123 Main Street',
      city: 'Mumbai',
      capacity: 500,
      facilities: 'WiFi, Projector, Stage, Parking',
    });

    const venue2 = await Venue.create({
      name: 'Tech Hub Auditorium',
      address: '456 Tech Park',
      city: 'Bangalore',
      capacity: 200,
      facilities: 'WiFi, Multiple Screens, AC',
    });
    console.log('✅ Venues created');

    // Create Events
    await Event.create([
      {
        title: 'Annual Tech Summit 2026',
        description: 'A premier technology conference bringing together industry leaders, innovators, and developers.',
        date: new Date('2026-09-15'),
        endDate: new Date('2026-09-17'),
        location: 'Mumbai',
        venue: venue1._id,
        category: 'Technology',
        status: 'Upcoming',
        capacity: 500,
        price: 999,
        imageUrl: '',
      },
      {
        title: 'AI & Machine Learning Workshop',
        description: 'Hands-on workshop covering the latest in artificial intelligence and machine learning.',
        date: new Date('2026-08-20'),
        endDate: new Date('2026-08-21'),
        location: 'Bangalore',
        venue: venue2._id,
        category: 'Workshop',
        status: 'Upcoming',
        capacity: 100,
        price: 499,
        imageUrl: '',
      },
      {
        title: 'Startup Networking Night',
        description: 'Connect with founders, investors, and mentors in a casual networking environment.',
        date: new Date('2026-08-30'),
        location: 'Delhi',
        category: 'Networking',
        status: 'Upcoming',
        capacity: 150,
        price: 0,
        imageUrl: '',
      },
    ]);
    console.log('✅ Events created');

    // Create Speakers
    await Speaker.create([
      { name: 'Dr. Sarah Johnson', bio: 'AI researcher with 15 years of experience', expertise: 'Artificial Intelligence', organization: 'MIT', email: 'sarah@example.com' },
      { name: 'Raj Patel', bio: 'Serial entrepreneur and startup mentor', expertise: 'Entrepreneurship', organization: 'StartupHub', email: 'raj@example.com' },
    ]);
    console.log('✅ Speakers created');

    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────');
    console.log('Admin login: admin@eventops.com / admin123');
    console.log('User login:  user@eventops.com / user123');
    console.log('─────────────────────────────');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
