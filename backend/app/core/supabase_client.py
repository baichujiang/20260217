from supabase import create_client, Client
from .config import settings

SUPABASE_URL: str = settings.SUPABASE_URL
SUPABASE_KEY: str = settings.SUPABASE_KEY

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
