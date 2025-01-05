using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Logging;

namespace RS1_2024_25.API.Services
{
    public class EmailService
    {
        private readonly string _smtpServer = "smtp.gmail.com";
        private readonly int _smtpPort = 587;
        private readonly string _smtpUser = "elmedinamaric42@gmail.com";
        private readonly string _smtpPassword = "wwzs vvhf umsv muvb";
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public void SendEmail(string toEmail, string subject, string body)
        {
            try
            {
                using (var smtpClient = new SmtpClient(_smtpServer, _smtpPort))
                {
                    smtpClient.Credentials = new NetworkCredential(_smtpUser, _smtpPassword);
                    smtpClient.EnableSsl = true;

                    using (var mailMessage = new MailMessage())
                    {
                        mailMessage.From = new MailAddress(_smtpUser);
                        mailMessage.To.Add(toEmail);
                        mailMessage.Subject = subject;
                        mailMessage.Body = body;
                        mailMessage.IsBodyHtml = true;

                        smtpClient.Send(mailMessage);
                        _logger.LogInformation($"✅ E-mail uspješno poslan na {toEmail}");
                    }
                }
            }
            catch (SmtpException ex)
            {
                _logger.LogError($"❌ SMTP Greška: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Opća greška: {ex.Message}");
                throw;
            }
        }
    }
}
