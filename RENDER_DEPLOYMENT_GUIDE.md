# دليل رفع الباك إيند على Render

## الخطوات المطلوبة:

### 1. رفع الكود على GitHub

أولاً، تأكد من رفع الباك إيند على GitHub:

```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. إنشاء حساب على Render

1. اذهب إلى [Render.com](https://render.com)
2. سجل دخول باستخدام حساب GitHub الخاص بك
3. اربط حساب GitHub مع Render

### 3. إنشاء Web Service جديد

1. من لوحة التحكم في Render، اضغط على **"New +"**
2. اختر **"Web Service"**
3. اختر المستودع (Repository) الخاص بالباك إيند من GitHub
4. إذا كان الباك إيند في مجلد فرعي، حدد المسار: `backend`

### 4. إعدادات Web Service

املأ الحقول التالية:

- **Name**: `intlakaa-backend` (أو أي اسم تريده)
- **Region**: اختر المنطقة الأقرب لك (مثل Frankfurt للشرق الأوسط)
- **Branch**: `main`
- **Root Directory**: `backend` (إذا كان في مجلد فرعي)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (للبداية)

### 5. إضافة Environment Variables

اضغط على **"Advanced"** ثم أضف المتغيرات التالية:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://intlakaa_db:intlakaa123@intlakaacluster.zqrwn3q.mongodb.net/intlakaa?retryWrites=true&w=majority
JWT_SECRET=intlakaa-super-secret-jwt-key-2026-xyz123
JWT_EXPIRE=7d
FRONTEND_URL=YOUR_VERCEL_URL
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@intlakaa.com
SITE_URL=YOUR_VERCEL_URL
SITE_NAME=انطلاقة
SUPABASE_URL=https://sxpaphmltbnangdubutm.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4cGFwaG1sdGJuYW5nZHVidXRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDc1NzYwNCwiZXhwIjoyMDgwMzMzNjA0fQ.jeIdCDlJMO865do74ny-MReMZl8QJKVa2x5VSPiN4zA
```

**مهم جداً**: 
- استبدل `YOUR_VERCEL_URL` برابط الفرونت إيند الخاص بك على Vercel
- استبدل بيانات البريد الإلكتروني الحقيقية

### 6. إنشاء الخدمة

1. اضغط على **"Create Web Service"**
2. انتظر حتى يتم بناء ونشر المشروع (قد يستغرق 5-10 دقائق)
3. بعد النشر الناجح، ستحصل على رابط مثل: `https://intlakaa-backend.onrender.com`

### 7. تحديث الفرونت إيند

بعد الحصول على رابط الباك إيند من Render:

1. اذهب إلى مشروع الفرونت إيند على Vercel
2. اذهب إلى **Settings** > **Environment Variables**
3. أضف أو حدّث المتغير:
   ```
   VITE_API_URL=https://intlakaa-backend.onrender.com
   ```
4. أعد نشر الفرونت إيند من **Deployments** > **Redeploy**

### 8. اختبار الاتصال

1. افتح رابط الباك إيند: `https://intlakaa-backend.onrender.com/health`
2. يجب أن ترى رسالة:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "..."
   }
   ```

### 9. تحديث CORS في الباك إيند

تأكد من أن رابط Vercel مضاف في إعدادات CORS. الكود الحالي يستخدم `FRONTEND_URL` من المتغيرات البيئية، لذا تأكد من إضافته بشكل صحيح.

## ملاحظات مهمة:

### خطة Free في Render:
- الخدمة تتوقف بعد 15 دقيقة من عدم النشاط
- عند أول طلب بعد التوقف، قد يستغرق 30-60 ثانية للتشغيل
- 750 ساعة مجانية شهرياً

### للحفاظ على الخدمة نشطة:
يمكنك استخدام خدمة مثل [UptimeRobot](https://uptimerobot.com) لإرسال طلب كل 10 دقائق إلى:
```
https://intlakaa-backend.onrender.com/health
```

### مراقبة السجلات (Logs):
- من لوحة تحكم Render، اضغط على اسم الخدمة
- اذهب إلى تبويب **"Logs"** لمراقبة أي أخطاء

## استكشاف الأخطاء:

### إذا فشل البناء (Build Failed):
1. تحقق من أن `package.json` موجود
2. تحقق من أن جميع التبعيات (dependencies) صحيحة
3. راجع سجلات البناء (Build Logs)

### إذا فشل الاتصال بقاعدة البيانات:
1. تحقق من صحة `MONGODB_URI`
2. تأكد من أن MongoDB Atlas يسمح بالاتصالات من أي IP (0.0.0.0/0)
3. في MongoDB Atlas: **Network Access** > **Add IP Address** > **Allow Access from Anywhere**

### إذا كانت هناك مشاكل في CORS:
1. تأكد من أن `FRONTEND_URL` يحتوي على رابط Vercel الصحيح
2. تأكد من عدم وجود `/` في نهاية الرابط
3. أعد نشر الخدمة بعد تحديث المتغيرات

## الخطوات التالية:

بعد النشر الناجح:
1. ✅ اختبر تسجيل الدخول من الفرونت إيند
2. ✅ اختبر إنشاء حساب جديد
3. ✅ اختبر جميع الوظائف الأساسية
4. ✅ راقب السجلات للتأكد من عدم وجود أخطاء

---

**تم إنشاء هذا الدليل في:** 2026-01-02
