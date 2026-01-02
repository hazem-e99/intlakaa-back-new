import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Send invite email
export const sendInviteEmail = async (email, inviteToken) => {
  try {
    const inviteUrl = `${process.env.SITE_URL}/admin/accept-invite?token=${inviteToken}`;
    const siteName = process.env.SITE_NAME || 'انطلاقة';

    const { data, error } = await resend.emails.send({
      from: `${siteName} <noreply@intlakaa.com>`,
      to: email,
      subject: `دعوة للانضمام إلى ${siteName}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>مرحباً بك في ${siteName}</h1>
            </div>
            <div class="content">
              <p>تم دعوتك للانضمام إلى لوحة إدارة ${siteName}.</p>
              <p>للقبول والبدء، يرجى النقر على الزر أدناه:</p>
              <div style="text-align: center;">
                <a href="${inviteUrl}" class="button">قبول الدعوة</a>
              </div>
              <p style="color: #666; font-size: 14px;">أو انسخ الرابط التالي في المتصفح:</p>
              <p style="background: #f8f8f8; padding: 10px; border-radius: 5px; word-break: break-all; direction: ltr;">${inviteUrl}</p>
              <p style="color: #999; font-size: 12px; margin-top: 20px;">هذا الرابط صالح لمدة 7 أيام.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${siteName}. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent successfully to:', email, 'ID:', data.id);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error(`فشل إرسال البريد الإلكتروني: ${error.message}`);
  }
};
