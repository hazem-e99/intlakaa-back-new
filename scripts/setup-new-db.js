import dotenv from 'dotenv';
import dns from 'dns';
import mongoose from 'mongoose';

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);
import User from '../models/User.js';
import Page from '../models/Page.js';
import Post from '../models/Post.js';
import Request from '../models/Request.js';
import SeoSettings from '../models/SeoSettings.js';

dotenv.config();

const setupDatabase = async () => {
  try {
    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 Setup New Database                       ║
║                                               ║
╚═══════════════════════════════════════════════╝
    `);

    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}\n`);

    // 1. Create Users collection + indexes + owner account
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 1/5 - Creating Users collection...');
    await User.createCollection();
    await User.syncIndexes();
    
    // Check if owner exists
    const existingOwner = await User.findOne({ role: 'owner' });
    if (!existingOwner) {
      await User.create({
        email: 'hazem@intlakaa.com',
        password: 'He123456789',
        role: 'owner',
        mustChangePassword: false,
        isActive: true
      });
      console.log('   ✅ Users collection created');
      console.log('   👑 Owner account created (hazem@intlakaa.com)');
    } else {
      console.log('   ✅ Users collection created');
      console.log('   ℹ️  Owner already exists, skipping...');
    }

    // 2. Create Pages collection + indexes
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 2/5 - Creating Pages collection...');
    await Page.createCollection();
    await Page.syncIndexes();
    console.log('   ✅ Pages collection created');

    // 3. Create Posts collection + indexes
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 3/5 - Creating Posts collection...');
    await Post.createCollection();
    await Post.syncIndexes();
    console.log('   ✅ Posts collection created');

    // 4. Create Requests collection + indexes
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 4/5 - Creating Requests collection...');
    await Request.createCollection();
    await Request.syncIndexes();
    console.log('   ✅ Requests collection created');

    // 5. Create SeoSettings collection + default document
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 5/5 - Creating SeoSettings collection...');
    await SeoSettings.createCollection();
    await SeoSettings.syncIndexes();

    const existingSeo = await SeoSettings.findOne({ key: 'main' });
    if (!existingSeo) {
      await SeoSettings.create({ key: 'main' });
      console.log('   ✅ SeoSettings collection created');
      console.log('   📝 Default SEO settings inserted');
    } else {
      console.log('   ✅ SeoSettings collection created');
      console.log('   ℹ️  Default SEO settings already exist, skipping...');
    }

    // Summary
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
╔═══════════════════════════════════════════════╗
║                                               ║
║   ✅ Database Setup Complete!                 ║
║                                               ║
║   Collections created:                        ║`);
    
    collections.forEach(col => {
      console.log(`║   • ${col.name.padEnd(40)}║`);
    });
    
    console.log(`║                                               ║
║   Owner: hazem@intlakaa.com                   ║
║   Password: He123456789                       ║
║                                               ║
╚═══════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error(error);
    process.exit(1);
  }
};

setupDatabase();
