"""Менеджер сессий пользователя"""
import time
import os

user_sessions = {}

class SessionManager:
    @staticmethod
    def get_user_session(request):
        session_id = request.cookies.get("session_id")
        if not session_id:
            session_id = f"web_{int(time.time())}_{os.urandom(4).hex()}"
        
        if session_id not in user_sessions:
            user_sessions[session_id] = {
                'filters': {},
                'catalog_context': {},
                'navigation_history': [],
                'last_activity': time.time()
            }
        
        return session_id, user_sessions[session_id]
