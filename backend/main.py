from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for SvelteKit dev server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sveltefastapi.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Only allow these specific domains
    allow_credentials=True,
    allow_methods=["*"],             # Allows GET, POST, etc.
    allow_headers=["*"],             # Allows custom headers
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

@app.get("/health")
async def health_check():
    return {"status": "online"}

@app.get("/authors")
async def get_authors():
    # Fetch all authors to populate the picklist
    response = supabase.table("authors").select("id, first_name, last_name").execute()
    return response.data

@app.get("/titles-by-author")
async def get_all_titles():
    # We select specific columns from 'titles'
    # Then we reach through 'author_title' into 'authors'
    response = (
        supabase.table("titles")
        .select("""
            id,
            created_at,
            title,
            genre,
            olid,
            pgid,
            author_title(
                authors(
                    first_name,
                    last_name
                )
            )
        """)
        .execute()
    )
    return response.data

@app.get("/titles-by-author/{author_id}")
async def get_titles(author_id: int):
    # This implements your JOIN logic using Supabase's syntax
    # We query 'titles', join 'author_title', and filter by the 'author_fk'
    response = (
        supabase.table("titles")
        .select("*, at:author_title!inner(author_fk)")
        .eq("at.author_fk", author_id)
        .execute()
    )
    return response.data

@app.patch("/titles/{title_id}")
async def update_title(title_id: int, updates: dict):
    # Supabase .update() only changes the columns provided in the dict
    response = (
        supabase.table("titles")
        .update(updates)
        .eq("id", title_id)
        .execute()
    )
    return response.data
