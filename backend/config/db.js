import mongoose from 'mongoose';
import User from '../models/User.js';

const seedUsers = async () => {
    try {
        const adminEmail = 'admin@gmail.com';
        const superadminEmail = 'superadmin@gmail.com';

        // Try to drop the legacy unique index on 'username' if it exists
        try {
            await mongoose.connection.db.collection('users').dropIndex('username_1');
            console.log('Dropped legacy unique index username_1');
        } catch (indexError) {
            // Index might not exist, which is fine to ignore
        }

        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: 'admin123',
                role: 'admin',
            });
            console.log('Admin user seeded successfully');
        } else {
            admin.role = 'admin';
            admin.password = 'admin123'; // reset password to default
            await admin.save();
            console.log('Admin user role and password updated');
        }

        let superadmin = await User.findOne({ email: superadminEmail });
        if (!superadmin) {
            await User.create({
                name: 'Super Admin',
                email: superadminEmail,
                password: 'superadmin123',
                role: 'superadmin',
            });
            console.log('Superadmin user seeded successfully');
        } else {
            superadmin.role = 'superadmin';
            superadmin.password = 'superadmin123'; // reset password to default
            await superadmin.save();
            console.log('Superadmin user role and password updated');
        }
    } catch (error) {
        console.error(`Error seeding users: ${error.message}`);
    }
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ticketing-system');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await seedUsers();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
