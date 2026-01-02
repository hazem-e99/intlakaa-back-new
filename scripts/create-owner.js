import dotenv from 'dotenv';
import mongoose from 'mongoose';
import readline from 'readline';
import User from '../models/User.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createOwner = async () => {
  try {
    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   👑 Create Owner Account                     ║
║                                               ║
╚═══════════════════════════════════════════════╝
    `);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get email
    const email = await question('📧 Enter owner email: ');
    
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(`❌ User with email ${email} already exists`);
      process.exit(1);
    }

    // Get password
    const password = await question('🔒 Enter password (min 6 characters): ');
    
    if (!password || password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    // Create owner
    const owner = await User.create({
      email,
      password,
      role: 'owner',
      mustChangePassword: false,
      isActive: true
    });

    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   ✅ Owner Account Created Successfully!      ║
║                                               ║
║   Email: ${email.padEnd(37)}║
║   Role:  owner                                ║
║                                               ║
║   You can now login with these credentials    ║
║                                               ║
╚═══════════════════════════════════════════════╝
    `);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating owner:', error.message);
    rl.close();
    process.exit(1);
  }
};

createOwner();
