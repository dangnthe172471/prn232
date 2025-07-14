using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _config.GetSection("EmailSettings");
            var smtpClient = new SmtpClient(emailSettings["SmtpServer"])
            {
                Port = int.Parse(emailSettings["Port"]),
                Credentials = new NetworkCredential(emailSettings["Username"], emailSettings["Password"]),
                EnableSsl = bool.Parse(emailSettings["EnableSsl"]),
                Timeout = int.Parse(emailSettings["Timeout"])
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(emailSettings["FromEmail"], emailSettings["FromName"]),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }

        public async Task SendPasswordResetPinEmailAsync(string toEmail, string pin, string? userName)
        {
            var subject = "Mã PIN đặt lại mật khẩu CareU";
            var body = GeneratePasswordResetPinHtml(pin, userName);
            await SendEmailAsync(toEmail, subject, body);
        }

        private string GeneratePasswordResetPinHtml(string pin, string? userName = null)
        {
            return $@"
        <html>
        <body style='font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;'>
            <div style='max-width: 480px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px #0002; overflow: hidden;'>
                <div style='background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%); padding: 32px 0 20px 0; text-align: center;'>
                    <img src='https://i.imgur.com/8Km9tLL.png' alt='CareU Logo' style='height: 56px; margin-bottom: 12px;' />
                    <h2 style='color: #fff; margin: 0; font-size: 2rem; letter-spacing: 1px;'>Đặt lại mật khẩu</h2>
                </div>
                <div style='padding: 36px 28px 28px 28px;'>
                    <p style='font-size: 1.15rem; color: #222; margin-bottom: 18px;'>
                        {(string.IsNullOrEmpty(userName) ? "" : $"Chào <b>{userName}</b>,<br>")}
                        Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản <b>CareU</b>.
                    </p>
                    <div style='background: #f1f5f9; border-radius: 10px; padding: 24px 0; text-align: center; margin: 24px 0;'>
                        <div style='color: #2563eb; font-size: 1.1rem; margin-bottom: 8px;'>Mã PIN đặt lại mật khẩu của bạn:</div>
                        <div style='font-size: 2.2rem; font-weight: bold; letter-spacing: 8px; color: #9333ea;'>{pin}</div>
                    </div>
                    <p style='color: #dc2626; font-weight: bold; text-align: center; margin-bottom: 18px;'>⚠️ Mã này có hiệu lực trong 15 phút</p>
                    <p style='color: #666; font-size: 1rem; text-align: center;'>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    <hr style='margin: 36px 0 16px 0; border: none; border-top: 1px solid #eee;'>
                    <div style='color: #888; font-size: 1rem; text-align: center;'>Trân trọng,<br>Đội ngũ <b>CareU</b></div>
                </div>
            </div>
        </body>
        </html>";
        }
    }
} 