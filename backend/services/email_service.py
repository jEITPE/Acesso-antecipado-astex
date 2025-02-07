import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import EMAIL_USER, EMAIL_PASSWORD
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_welcome_email(to_email: str, name: str, company: str, niches: list):
    try:
        logger.info(f"Iniciando envio de email para {to_email}")
        
        # Configuração do email
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Bem-vindo à Astex AI - Acesso Antecipado"
        msg['From'] = EMAIL_USER
        msg['To'] = to_email
        
        # HTML do email
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3B82F6; margin-bottom: 24px;">Bem-vindo à Astex AI!</h1>
            
            <p>Olá {name},</p>
            
            <p>Obrigado por se cadastrar para o acesso antecipado da Astex AI! Estamos muito animados em tê-lo conosco.</p>
            
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <h2 style="color: #1F2937; margin-top: 0;">Seus dados:</h2>
                <p><strong>Empresa:</strong> {company}</p>
                <p><strong>Nicho:</strong> {', '.join(niches)}</p>
            </div>
            
            <p>Nossa equipe entrará em contato em breve com mais informações sobre o acesso à plataforma.</p>
            
            <p>Enquanto isso, fique à vontade para nos seguir nas redes sociais para acompanhar as novidades!</p>
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
                <p style="color: #6B7280; font-size: 14px;">
                    Atenciosamente,<br>
                    Equipe Astex AI
                </p>
            </div>
        </div>
        """
        
        # Anexar conteúdo HTML
        part = MIMEText(html_content, 'html')
        msg.attach(part)
        
        # Conectar ao servidor SMTP do Gmail
        logger.info("Conectando ao servidor SMTP...")
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        
        # Login
        logger.info("Realizando login...")
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        
        # Enviar email
        logger.info("Enviando email...")
        server.send_message(msg)
        server.quit()
        
        logger.info("Email enviado com sucesso!")
        return True, "Email enviado com sucesso"
        
    except Exception as e:
        logger.error(f"Erro ao enviar email: {str(e)}")
        return False, str(e) 