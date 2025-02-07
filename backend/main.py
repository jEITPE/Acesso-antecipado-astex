# -*- coding: utf-8 -*-
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from typing import List, Optional
from datetime import datetime
import json
import os
from services.email_service import send_welcome_email
# from services.whatsapp_service import send_welcome_whatsapp

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://astexai.com",
        "https://www.astexai.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class WhitelistEntry(BaseModel):
    name: str
    phone: str
    email: str
    company: str
    niches: List[str]
    other_niche: Optional[str] = None
    recommend: Optional[str] = None
    created_at: datetime = datetime.now()

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# JSON file path
JSON_FILE = "whitelist_entries.json"

def load_entries():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def save_entry(entry_dict: dict):
    try:
        # Carregar entradas existentes
        try:
            with open('whitelist_entries.json', 'r', encoding='utf-8') as f:
                entries = json.load(f)
        except FileNotFoundError:
            entries = []
        
        # Adicionar nova entrada
        entries.append(entry_dict)
        
        # Salvar arquivo
        with open('whitelist_entries.json', 'w', encoding='utf-8') as f:
            json.dump(entries, f, ensure_ascii=False, indent=2)
            
    except Exception as e:
        print(f"Error saving entry: {str(e)}")
        raise e

@app.post("/api/whitelist")
async def create_whitelist_entry(entry: WhitelistEntry):
    try:
        # Validação adicional
        if not entry.name or not entry.phone or not entry.email or not entry.company or not entry.niches:
            raise HTTPException(status_code=400, detail="Todos os campos obrigatórios devem ser preenchidos")

        # Garante que o other_niche está preenchido quando necessário
        if "Outros" in entry.niches and not entry.other_niche:
            raise HTTPException(status_code=400, detail="Especifique o outro nicho")

        # Converte para dict e salva
        entry_dict = entry.dict()
        
        # Garante que a data está no formato correto
        entry_dict["created_at"] = entry.created_at.isoformat()
        
        save_entry(entry_dict)
        
        # Envia email com mais logs
        email_success, email_message = send_welcome_email(
            to_email=entry.email,
            name=entry.name,
            company=entry.company,
            niches=entry.niches
        )
        
        if not email_success:
            print(f"Failed to send email: {email_message}")
            # Ainda retornamos sucesso pois o cadastro foi feito
            return {
                "status": "success", 
                "message": "Entry created successfully but email failed",
                "email_error": email_message
            }
        
        return {"status": "success", "message": "Entry created successfully"}
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error creating entry: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/whitelist")
async def get_whitelist_entries():
    return load_entries()

@app.get("/api/admin/stats")
async def get_stats():
    try:
        with open('whitelist_entries.json', 'r', encoding='utf-8') as f:
            entries = json.load(f)
            
        total_entries = len(entries)
        niches_count = {}
        recommendations = {"Sim": 0, "Não": 0}
        
        for entry in entries:
            # Count niches
            for niche in entry["niches"]:
                niches_count[niche] = niches_count.get(niche, 0) + 1
            
            # Count recommendations
            if entry["recommend"]:
                recommendations[entry["recommend"]] = recommendations.get(entry["recommend"], 0) + 1
        
        return {
            "total_entries": total_entries,
            "niches_distribution": niches_count,
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/entries")
async def get_entries():
    try:
        with open('whitelist_entries.json', 'r', encoding='utf-8') as f:
            entries = json.load(f)
        return entries
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 