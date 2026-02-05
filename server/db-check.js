import mongoose from 'mongoose';
import 'dotenv/config';
import fs from 'fs';

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI + '/pahadibazaar');

        const db = mongoose.connection.db;
        const report = [];

        report.push('=== PAHADI BAZAAR DATABASE REPORT ===\n');

        // Users
        const users = await db.collection('users').find({}).toArray();
        report.push(`USERS: ${users.length}`);
        users.forEach(u => {
            report.push(`  - Name: ${u.name}, Email: ${u.email}, Phone: ${u.phone || 'N/A'}`);
        });

        // Products
        const products = await db.collection('products').find({}).toArray();
        report.push(`\nPRODUCTS: ${products.length}`);
        products.slice(0, 5).forEach(p => {
            report.push(`  - ${p.name}: Rs${p.offerPrice} (${p.category})`);
        });

        // Messages
        const messages = await db.collection('messages').find({}).toArray();
        report.push(`\nCONTACT MESSAGES: ${messages.length}`);
        messages.forEach(m => {
            report.push(`  - From: ${m.name} (${m.email})`);
        });

        // Orders
        const orders = await db.collection('orders').find({}).toArray();
        report.push(`\nORDERS: ${orders.length}`);

        // Addresses
        const addresses = await db.collection('addresses').find({}).toArray();
        report.push(`ADDRESSES: ${addresses.length}`);

        // Coupons
        const coupons = await db.collection('coupons').find({}).toArray();
        report.push(`COUPONS: ${coupons.length}`);
        coupons.forEach(c => {
            report.push(`  - Code: ${c.code}, Discount: ${c.discountValue}`);
        });

        // Write to file
        fs.writeFileSync('db-report.md', report.join('\n'), 'utf8');
        console.log('Report saved to db-report.md');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkDB();
