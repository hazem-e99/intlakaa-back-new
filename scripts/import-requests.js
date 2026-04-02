import dotenv from 'dotenv';
import dns from 'dns';
import mongoose from 'mongoose';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

import Request from '../models/Request.js';

const requestsData = [
    { name: "عمر يوسف", phone: "+966 59 617 3776", storeUrl: "https://luna-elegance.com/", monthlySales: "10000", createdAt: "2025-12-06T09:00:23.952Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "Faisal", phone: "966/537457237", storeUrl: "https://ferza.sa/", monthlySales: "من غير تحديد", createdAt: "2025-12-06T12:45:51.358Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "محمد علي", phone: "0554139009", storeUrl: "https://salla.sa/maystrk-llttryz-mystric-embroidery", monthlySales: "المتجر لسا جديد مرحلة تجهيز", createdAt: "2025-12-06T16:37:10.365Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "تيار", phone: "596446485", storeUrl: "متحر مسك العطاره", monthlySales: "600", createdAt: "2025-12-09T06:19:31.860Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "عبدالله", phone: "966/532236431", storeUrl: "http://digital-Hup-sa.com", monthlySales: "متجر إلكترونيات", createdAt: "2025-12-09T09:16:45.620Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "خالد", phone: "0554829682", storeUrl: "Alhdfsh@gmail.com", monthlySales: "50000", createdAt: "2025-12-09T10:04:58.436Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "أبو فارس", phone: "0555355965", storeUrl: "lamah-ksa.com", monthlySales: "باقي ما أطلقنا", createdAt: "2025-12-09T12:01:56.344Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "علي الريعان", phone: "0592356666", storeUrl: "https://auratechsa.com/", monthlySales: "0", createdAt: "2025-12-09T13:04:39.742Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "Aaz A", phone: "+966502042267", storeUrl: "مبسوطة", monthlySales: "جديد", createdAt: "2025-12-09T18:18:55.530Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "علاء مطهر", phone: "+966574810212", storeUrl: "goldenperfumessa@gmail.com", monthlySales: "لا شي", createdAt: "2025-12-09T20:30:19.322Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "Mohamed Yaser", phone: "506177551", storeUrl: "https://orthostor123.aryaf.sa/", monthlySales: "0", createdAt: "2025-12-10T16:35:23.181Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "Omar Thameen", phone: "+9647518838203", storeUrl: "Thameen.shop", monthlySales: "اطلاق المشروع قريباً", createdAt: "2025-12-10T22:39:16.763Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "Feyzah Rabah", phone: "+212 702-843827", storeUrl: "Feyzahenglish.com", monthlySales: "15,000", createdAt: "2025-12-12T18:19:20.941Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "Jamela ALTHAKAFI", phone: "966555182043", storeUrl: "https://www.instagram.com/jamila_fashion_designer?igsh=MTI4em5uZ2JneXoyNw==", monthlySales: "1 1", createdAt: "2025-12-12T18:22:23.164Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "درانجولا", phone: "966/552402481", storeUrl: "https://wa.me/c/966552402481", monthlySales: "0 ريال", createdAt: "2025-12-12T19:06:22.621Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "درانجولا", phone: "966/552402481", storeUrl: "https://wa.me/c/966552402481", monthlySales: "0 ريال", createdAt: "2025-12-12T19:07:31.287Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "درانجولا", phone: "966/552402481", storeUrl: "https://www.instagram.com/_drangoula?igsh=Z2FkcDV6aTYzZDdt", monthlySales: "0ريال", createdAt: "2025-12-12T19:09:32.062Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "صلاح", phone: "0561247777", storeUrl: "Ff", monthlySales: "Ggg", createdAt: "2025-12-13T03:05:10.636Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "نيو بيبي", phone: "0546783676", storeUrl: "New baby", monthlySales: "5000", createdAt: "2025-12-13T14:21:40.248Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "محمدخالدالهادی", phone: "0916477089", storeUrl: "محمدخالدالهادی", monthlySales: "محمد خالدالهادی", createdAt: "2025-12-21T16:21:48.490Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "محمدخالدالهادی", phone: "0916477089", storeUrl: "محمدخالدالهادی", monthlySales: "محمد خالدالهادی", createdAt: "2025-12-21T16:24:26.490Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "فهد", phone: "552725555", storeUrl: "شركة شموع الماضي", monthlySales: "250000", createdAt: "2025-12-23T04:04:59.623Z", ipAddress: null, country: null, phoneCountry: null },
    { name: "هيثم بنتن", phone: "506646055", storeUrl: "https://4b-sa.com/", monthlySales: "500 ريال", createdAt: "2025-12-31T20:17:31.898Z", ipAddress: null, country: null, phoneCountry: null },
];

const importRequests = async () => {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!\n');

        console.log(`📦 Importing ${requestsData.length} requests...\n`);

        let inserted = 0;
        for (const req of requestsData) {
            const doc = new Request(req);
            doc.createdAt = new Date(req.createdAt);
            doc.updatedAt = new Date(req.createdAt);
            await doc.save();
            inserted++;
            console.log(`   ✅ ${inserted}. ${req.name}`);
        }

        console.log(`\n🎉 Done! ${inserted}/${requestsData.length} requests imported successfully.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

importRequests();
