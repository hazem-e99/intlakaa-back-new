# 🚀 دليل التنفيذ السريع - خطوة بخطوة

## ✅ الخطوة 1: إنشاء ملف .env

1. افتح مجلد `backend/`
2. أنشئ ملف جديد اسمه `.env`
3. انسخ المحتوى التالي:

```env
MONGODB_URI=mongodb+srv://intlakaa_db:intlakaa123@intlakaacluster.zqrwn3q.mongodb.net/intlakaa?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=intlakaa-super-secret-jwt-key-2026-xyz123
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@intlakaa.com
SITE_URL=http://localhost:5173
SITE_NAME=انطلاقة
SUPABASE_URL=https://sxpaphmltbnangdubutm.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4cGFwaG1sdGJuYW5nZHVidXRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDc1NzYwNCwiZXhwIjoyMDgwMzMzNjA0fQ.jeIdCDlJMO865do74ny-MReMZl8QJKVa2x5VSPiN4zA
```

---

## ✅ الخطوة 2: تثبيت Supabase Client

افتح Terminal في مجلد `backend/` ونفذ:

```bash
npm install @supabase/supabase-js
```

---

## ✅ الخطوة 3: إنشاء أول Owner User

في Terminal، نفذ:

```bash
npm run create-owner
```

سيطلب منك:
- **Email:** أدخل البريد الإلكتروني (مثلاً: `admin@intlakaa.com`)
- **Password:** أدخل كلمة مرور قوية (6 أحرف على الأقل)

---

## ✅ الخطوة 4: نقل البيانات من Supabase

بعد إنشاء Owner، نفذ:

```bash
npm run migrate
```

هذا سينقل:
- ✅ جميع المستخدمين (Users) من Supabase Auth
- ✅ جميع الطلبات (Requests) من جدول requests

**ملحوظة مهمة:**
- كلمات مرور المستخدمين لا يمكن نقلها من Supabase
- سيتم إنشاء كلمات مرور مؤقتة
- المستخدمون سيحتاجون إعادة تعيين كلمات المرور

---

## ✅ الخطوة 5: تشغيل Backend Server

```bash
npm run dev
```

يجب أن ترى:
```
✅ MongoDB Connected: intlakaacluster.zqrwn3q.mongodb.net
🚀 Server is running on port 5000
```

---

## ✅ الخطوة 6: اختبار API

افتح متصفح واذهب إلى:
```
http://localhost:5000/health
```

يجب أن ترى:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

---

## 🧪 اختبار Login

استخدم Postman أو curl:

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@intlakaa.com\",\"password\":\"your-password\"}"
```

يجب أن تحصل على:
```json
{
  "success": true,
  "message": "نجح تسجيل الدخول",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

---

## 📊 التحقق من البيانات في MongoDB

1. اذهب إلى [MongoDB Atlas](https://cloud.mongodb.com)
2. اضغط على **Browse Collections**
3. اختر database **intlakaa**
4. يجب أن ترى:
   - Collection **users** (المستخدمين)
   - Collection **requests** (الطلبات)

---

## ⚠️ المشاكل الشائعة

### خطأ: "Cannot find module"
```bash
npm install
```

### خطأ: "MongoDB connection failed"
- تحقق من صحة MONGODB_URI في .env
- تأكد من أن IP مسموح في MongoDB Atlas

### خطأ: "SUPABASE_SERVICE_KEY is not defined"
- تأكد من إنشاء ملف .env
- تأكد من نسخ Service Role Key بشكل صحيح

---

## 🎉 بعد النجاح

بعد نقل البيانات بنجاح:
1. ✅ Backend جاهز ويعمل
2. ✅ البيانات منقولة من Supabase
3. ✅ يمكنك البدء في تحديث Frontend

---

## 📞 الخطوة التالية

بعد التأكد من نجاح كل الخطوات أعلاه، أخبرني لنبدأ في:
- 🔄 تحديث Frontend للتعامل مع API الجديد
- 🗑️ إزالة Supabase من Frontend
- ✨ اختبار كل الوظائف

---

**ملحوظة:** احفظ ملف `.env` في مكان آمن ولا ترفعه على Git!
