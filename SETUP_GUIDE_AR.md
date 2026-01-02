# 🚀 دليل التشغيل السريع - Quick Start Guide

## الخطوة 1: إعداد MongoDB Atlas (مجاني)

### 1. إنشاء حساب
1. اذهب إلى https://www.mongodb.com/cloud/atlas/register
2. سجل حساب جديد (مجاني)
3. اختر **M0 Free** tier

### 2. إنشاء Cluster
1. اختر **Build a Database**
2. اختر **M0 FREE**
3. اختر المنطقة الأقرب لك
4. اضغط **Create**

### 3. إعداد Database Access
1. اذهب إلى **Database Access**
2. اضغط **Add New Database User**
3. اختر **Password** authentication
4. احفظ Username و Password
5. اختر **Built-in Role: Atlas Admin**
6. اضغط **Add User**

### 4. إعداد Network Access
1. اذهب إلى **Network Access**
2. اضغط **Add IP Address**
3. اضغط **Allow Access from Anywhere** (0.0.0.0/0)
4. اضغط **Confirm**

### 5. الحصول على Connection String
1. اذهب إلى **Database**
2. اضغط **Connect** على الـ cluster
3. اختر **Connect your application**
4. انسخ الـ connection string
5. استبدل `<password>` بكلمة المرور الخاصة بك

---

## الخطوة 2: إعداد Gmail App Password

### 1. تفعيل Two-Factor Authentication
1. اذهب إلى https://myaccount.google.com/security
2. فعّل **2-Step Verification**

### 2. إنشاء App Password
1. اذهب إلى https://myaccount.google.com/apppasswords
2. اختر **Mail** و **Other (Custom name)**
3. اكتب "Intlakaa Backend"
4. اضغط **Generate**
5. احفظ الـ 16-digit password

---

## الخطوة 3: إعداد Backend

### 1. تثبيت Dependencies
```bash
cd backend
npm install
```

### 2. إنشاء ملف .env
```bash
# في مجلد backend
cp .env.example .env
```

### 3. تعديل ملف .env
افتح `backend/.env` وعدّل القيم التالية:

```env
# MongoDB - ضع connection string من Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intlakaa?retryWrites=true&w=majority

# JWT - غيّر هذا لشيء عشوائي وقوي
JWT_SECRET=اكتب-هنا-نص-عشوائي-طويل-ومعقد-جداً

# Email - ضع بيانات Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password

# باقي الإعدادات (اتركها كما هي للتطوير)
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SITE_URL=http://localhost:5173
SITE_NAME=انطلاقة
```

### 4. تشغيل Backend
```bash
npm run dev
```

يجب أن ترى:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server is running on port 5000
```

---

## الخطوة 4: نقل البيانات من Supabase (اختياري)

إذا كان عندك بيانات في Supabase:

### 1. أضف بيانات Supabase للـ .env
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 2. ثبّت Supabase client
```bash
npm install @supabase/supabase-js
```

### 3. شغّل Migration
```bash
npm run migrate
```

**ملحوظة مهمة:**
- كلمات المرور لا يمكن نقلها من Supabase
- جميع المستخدمين سيحتاجون إعادة تعيين كلمات المرور
- سيتم إنشاء كلمات مرور مؤقتة

---

## الخطوة 5: إنشاء أول مستخدم Owner

### الطريقة 1: يدوياً في MongoDB Atlas
1. اذهب إلى MongoDB Atlas
2. افتح **Browse Collections**
3. اختر database **intlakaa**
4. اختر collection **users**
5. اضغط **Insert Document**
6. أضف:
```json
{
  "email": "admin@intlakaa.com",
  "password": "$2a$10$XYZ...", 
  "role": "owner",
  "mustChangePassword": true,
  "isActive": true,
  "createdAt": {"$date": "2026-01-02T18:00:00.000Z"}
}
```

**ملحوظة:** لكلمة المرور، استخدم أي bcrypt hash أو شغّل السكريبت التالي:

### الطريقة 2: باستخدام Script
أنشئ ملف `backend/scripts/create-owner.js`:

```javascript
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const createOwner = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const owner = await User.create({
      email: 'admin@intlakaa.com',
      password: 'ChangeMe123!', // غيّر هذا
      role: 'owner',
      mustChangePassword: true,
      isActive: true
    });
    
    console.log('✅ Owner created:', owner.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createOwner();
```

ثم شغّله:
```bash
node scripts/create-owner.js
```

---

## الخطوة 6: اختبار API

### 1. اختبار Health Check
```bash
curl http://localhost:5000/health
```

### 2. اختبار Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@intlakaa.com","password":"ChangeMe123!"}'
```

يجب أن تحصل على token.

---

## الخطوة 7: تحديث Frontend

سيتم تحديث Frontend في الخطوة التالية لاستخدام الـ API الجديد بدلاً من Supabase.

---

## 🆘 المشاكل الشائعة

### MongoDB Connection Failed
- تأكد من صحة connection string
- تأكد من IP whitelist (0.0.0.0/0)
- تأكد من صحة username و password

### Email Not Sending
- تأكد من تفعيل 2FA في Gmail
- تأكد من صحة App Password
- جرب email آخر

### Port Already in Use
```bash
# غيّر PORT في .env
PORT=5001
```

---

## 📞 الدعم

إذا واجهت أي مشكلة، تحقق من:
1. Logs في Terminal
2. MongoDB Atlas logs
3. Gmail security settings

---

## ✅ Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Connection string copied
- [ ] Gmail App Password created
- [ ] `backend/.env` configured
- [ ] Dependencies installed (`npm install`)
- [ ] Server running (`npm run dev`)
- [ ] Owner user created
- [ ] Login tested successfully

---

**بعد إتمام كل الخطوات، Backend جاهز للاستخدام! 🎉**
