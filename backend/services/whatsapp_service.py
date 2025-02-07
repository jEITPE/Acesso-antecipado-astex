import requests
from typing import Dict, Any
import time
from config import WHATSAPP_TOKEN, WHATSAPP_PHONE_ID

class WhatsAppRetryException(Exception):
    def __init__(self, message: str, last_attempt_data: Dict[str, Any] = None):
        self.message = message
        self.last_attempt_data = last_attempt_data
        super().__init__(self.message)

def retry_with_backoff(func, max_retries=3, initial_delay=1):
    def wrapper(*args, **kwargs):
        delay = initial_delay
        last_exception = None
        last_attempt_data = None

        for retry in range(max_retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                if hasattr(e, 'last_attempt_data'):
                    last_attempt_data = e.last_attempt_data
                
                if retry < max_retries - 1:
                    time.sleep(delay)
                    delay *= 2
                
                print(f"Tentativa WhatsApp {retry + 1} falhou: {str(e)}")
                print(f"Próxima tentativa em {delay} segundos...")

        raise WhatsAppRetryException(
            f"Todas as {max_retries} tentativas falharam. Último erro: {str(last_exception)}",
            last_attempt_data
        )

    return wrapper

@retry_with_backoff
def send_whatsapp_message(phone_number: str, name: str, company: str, niches: list) -> dict:
    """Envia mensagem de WhatsApp usando a API do WhatsApp Cloud"""
    
    # Formata o número de telefone (remove caracteres não numéricos)
    phone_number = ''.join(filter(str.isdigit, phone_number))
    if not phone_number.startswith('55'):
        phone_number = f'55{phone_number}'

    url = f"https://graph.facebook.com/v17.0/{WHATSAPP_PHONE_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }

    # Template da mensagem
    message = f"""Olá {name}!

Obrigado por se inscrever para o acesso antecipado da Astex AI!

Confirmamos o recebimento do seu cadastro e em breve nossa equipe entrará em contato.

Dados do cadastro:
- Empresa: {company}
- Nicho: {', '.join(niches)}

Atenciosamente,
Equipe Astex AI"""

    data = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "text",
        "text": {"body": message}
    }

    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return {"status": "sent", "response": response.json()}
    else:
        raise Exception(f"Erro ao enviar mensagem: {response.text}")

def send_welcome_whatsapp(phone: str, name: str, company: str, niches: list):
    try:
        response_data = send_whatsapp_message(
            phone_number=phone,
            name=name,
            company=company,
            niches=niches
        )
        return True, response_data
    except WhatsAppRetryException as e:
        print(f"Falha no envio do WhatsApp após várias tentativas: {e.message}")
        print(f"Dados da última tentativa: {e.last_attempt_data}")
        return False, str(e)
    except Exception as e:
        print(f"Erro inesperado no WhatsApp: {e}")
        return False, str(e) 