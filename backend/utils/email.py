import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

def send_contact_notification(
    contact_name: str,
    contact_email: str, 
    contact_company: Optional[str],
    contact_message: str,
    contact_id: str
) -> bool:
    """Send email notification for contact form submissions"""
    
    try:
        # SMTP Configuration from environment
        smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        notification_email = os.environ.get('NOTIFICATION_EMAIL', 'alaamacreative@gmail.com')
        
        if not all([smtp_user, smtp_password]):
            logger.error("SMTP credentials not configured")
            return False
            
        # Create message
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = notification_email
        msg['Subject'] = f"New Contact Form Submission from {contact_name}"
        
        # Email body
        body = f"""
        New contact form submission received:
        
        Contact Information:
        - Name: {contact_name}
        - Email: {contact_email}
        - Company: {contact_company or 'Not provided'}
        - Submission ID: {contact_id}
        
        Message:
        {contact_message}
        
        ---
        This is an automated notification from the Alaama Creative Studio website.
        Please reply directly to {contact_email} to respond to this inquiry.
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, notification_email, msg.as_string())
        server.quit()
        
        logger.info(f"Contact notification sent for submission {contact_id}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email notification: {e}")
        return False

def send_welcome_email(contact_email: str, contact_name: str) -> bool:
    """Send welcome/confirmation email to the contact"""
    
    try:
        smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        
        if not all([smtp_user, smtp_password]):
            return False
            
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = contact_email
        msg['Subject'] = "Thank you for contacting Alaama Creative Studio"
        
        body = f"""
        Dear {contact_name},
        
        Thank you for reaching out to Alaama Creative Studio! We've received your message and appreciate your interest in our services.
        
        Our team will review your inquiry and get back to you within 24 hours. In the meantime, feel free to explore our portfolio at www.alaama.co or follow us on Instagram @alaama.bh.
        
        If you have any urgent questions, you can also reach us directly at info@alaama.co.
        
        Best regards,
        The Alaama Creative Studio Team
        
        ---
        Alaama Creative Studio
        Strategy-led brand and digital studio
        Website: www.alaama.co
        Instagram: @alaama.bh
        Email: info@alaama.co
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, contact_email, msg.as_string())
        server.quit()
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email: {e}")
        return False