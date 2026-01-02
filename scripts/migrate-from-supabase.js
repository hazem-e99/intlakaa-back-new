import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Request from '../models/Request.js';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migrate Users
const migrateUsers = async () => {
  try {
    console.log('\n📋 Starting users migration...');

    // Get all users from Supabase Auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      throw error;
    }

    console.log(`Found ${users.length} users in Supabase`);

    let migrated = 0;
    let skipped = 0;

    for (const supabaseUser of users) {
      try {
        // Check if user already exists in MongoDB
        const existingUser = await User.findOne({ email: supabaseUser.email });

        if (existingUser) {
          console.log(`⏭️  Skipping ${supabaseUser.email} (already exists)`);
          skipped++;
          continue;
        }

        // Create user in MongoDB
        // Note: We can't migrate passwords from Supabase, so we'll set a temporary one
        const tempPassword = Math.random().toString(36).slice(-12);
        
        await User.create({
          email: supabaseUser.email,
          password: tempPassword,
          role: supabaseUser.user_metadata?.role || 'admin',
          mustChangePassword: true,
          lastSignInAt: supabaseUser.last_sign_in_at ? new Date(supabaseUser.last_sign_in_at) : null,
          isActive: true,
          createdAt: new Date(supabaseUser.created_at)
        });

        console.log(`✅ Migrated user: ${supabaseUser.email}`);
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating user ${supabaseUser.email}:`, error.message);
      }
    }

    console.log(`\n📊 Users Migration Summary:`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📝 Total: ${users.length}`);

    return { migrated, skipped, total: users.length };
  } catch (error) {
    console.error('❌ Error in users migration:', error);
    throw error;
  }
};

// Migrate Requests
const migrateRequests = async () => {
  try {
    console.log('\n📋 Starting requests migration...');

    // Get all requests from Supabase
    const { data: requests, error } = await supabase
      .from('requests')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`Found ${requests.length} requests in Supabase`);

    let migrated = 0;
    let skipped = 0;

    for (const supabaseRequest of requests) {
      try {
        // Check if request already exists (by matching name, phone, and created_at)
        const existingRequest = await Request.findOne({
          name: supabaseRequest.name,
          phone: supabaseRequest.phone,
          createdAt: new Date(supabaseRequest.created_at)
        });

        if (existingRequest) {
          console.log(`⏭️  Skipping request from ${supabaseRequest.name} (already exists)`);
          skipped++;
          continue;
        }

        // Create request in MongoDB
        await Request.create({
          name: supabaseRequest.name,
          phone: supabaseRequest.phone,
          storeUrl: supabaseRequest.store_url,
          monthlySales: supabaseRequest.monthly_sales,
          ipAddress: supabaseRequest.ip_address,
          country: supabaseRequest.country,
          phoneCountry: supabaseRequest.phone_country,
          createdAt: new Date(supabaseRequest.created_at),
          updatedAt: new Date(supabaseRequest.created_at)
        });

        console.log(`✅ Migrated request: ${supabaseRequest.name}`);
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating request from ${supabaseRequest.name}:`, error.message);
      }
    }

    console.log(`\n📊 Requests Migration Summary:`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📝 Total: ${requests.length}`);

    return { migrated, skipped, total: requests.length };
  } catch (error) {
    console.error('❌ Error in requests migration:', error);
    throw error;
  }
};

// Main migration function
const runMigration = async () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🔄 Starting Supabase to MongoDB Migration   ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);

  try {
    // Connect to MongoDB
    await connectDB();

    // Migrate users
    const usersResult = await migrateUsers();

    // Migrate requests
    const requestsResult = await migrateRequests();

    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   ✅ Migration Completed Successfully!        ║
║                                               ║
║   Users:    ${usersResult.migrated}/${usersResult.total} migrated                    ║
║   Requests: ${requestsResult.migrated}/${requestsResult.total} migrated                 ║
║                                               ║
╚═══════════════════════════════════════════════╝

⚠️  IMPORTANT NOTES:
1. All migrated users have temporary passwords and must reset them
2. Original Supabase passwords cannot be migrated
3. You should send password reset emails to all users
4. Verify the data in MongoDB before switching the frontend
    `);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
runMigration();
