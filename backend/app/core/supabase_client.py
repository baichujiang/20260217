from typing import Optional
from supabase import create_client, Client
from .config import settings

# 未配置时为 None，评论图片上传功能不可用，其余功能正常
supabase: Optional[Client] = None
if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
