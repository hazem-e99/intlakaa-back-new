# خطوات سريعة للنشر على Render 🚀

## 1️⃣ رفع الكود على GitHub

```bash
# إذا لم تكن قد أنشأت Git repository بعد
git init
git add .
git commit -m "Ready for Render deployment"

# أنشئ repository جديد على GitHub ثم:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2️⃣ إنشاء Web Service على Render

1. اذهب إلى: https://render.com
2. سجل دخول بحساب GitHub
3. اضغط **"New +"** → **"Web Service"**
4. اختر المستودع من GitHub
5. املأ الإعدادات:
   - **Name**: `intlakaa-backend`
   - **Root Directory**: `backend` (إذا كان في مجلد فرعي)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

## 3️⃣ إضافة Environment Variables

اضغط **"Advanced"** وأضف:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://intlakaa_db:intlakaa123@intlakaacluster.zqrwn3q.mongodb.net/intlakaa?retryWrites=true&w=majority` |
| `JWT_SECRET` | `intlakaa-super-secret-jwt-key-2026-xyz123` |
| `JWT_EXPIRE` | `7d` |
| `FRONTEND_URL` | **رابط Vercel الخاص بك** |
| `SITE_URL` | **رابط Vercel الخاص بك** |
| `SITE_NAME` | `انطلاقة` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | **بريدك الإلكتروني** |
| `EMAIL_PASSWORD` | **App Password من Gmail** |
| `EMAIL_FROM` | `noreply@intlakaa.com` |
| `SUPABASE_URL` | `https://sxpaphmltbnangdubutm.supabase.co` |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## 4️⃣ اضغط "Create Web Service"

انتظر 5-10 دقائق للبناء والنشر.

## 5️⃣ احصل على رابط الباك إيند

بعد النشر الناجح، ستحصل على رابط مثل:
```
https://intlakaa-backend.onrender.com
```

## 6️⃣ اختبر الباك إيند

افتح في المتصفح:
```
https://intlakaa-backend.onrender.com/health
```

يجب أن ترى:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-02T..."
}
```

## 7️⃣ حدّث الفرونت إيند على Vercel

1. اذهب إلى مشروع Vercel
2. **Settings** → **Environment Variables**
3. أضف/حدّث:
   ```
   VITE_API_URL=https://intlakaa-backend.onrender.com
   ```
4. **Deployments** → **Redeploy**

## 8️⃣ تحديث MongoDB Atlas (مهم!)

1. اذهب إلى MongoDB Atlas
2. **Network Access** → **Add IP Address**
3. اختر **"Allow Access from Anywhere"** (0.0.0.0/0)
4. احفظ التغييرات

## ✅ تم! 

الآن الباك إيند يعمل على Render والفرونت إيند على Vercel!

---

## 🔧 استكشاف الأخطاء

### الخدمة لا تعمل؟
- راجع **Logs** في Render
- تأكد من صحة جميع Environment Variables
- تأكد من أن MongoDB يسمح بالاتصالات

### CORS Error؟
- تأكد من أن `FRONTEND_URL` صحيح
- لا تضع `/` في نهاية الرابط
- أعد نشر الخدمة بعد التحديث

### الخدمة بطيئة؟
- الخطة المجانية تتوقف بعد 15 دقيقة
- أول طلب بعد التوقف يستغرق 30-60 ثانية
- استخدم UptimeRobot للحفاظ على الخدمة نشطة

---

📖 للمزيد من التفاصيل، راجع: `RENDER_DEPLOYMENT_GUIDE.md`
