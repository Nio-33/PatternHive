import re
from typing import Any
from werkzeug.datastructures import FileStorage

class InputValidator:
    """Input validation and sanitization utilities"""
    
    def __init__(self):
        self.allowed_file_extensions = {'.txt', '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.csv'}
        self.max_text_length = 1000000  # 1MB of text
        self.min_text_length = 1
        
        # Malicious patterns to check for
        self.malicious_patterns = [
            re.compile(r'<script[^>]*>.*?</script>', re.IGNORECASE | re.DOTALL),
            re.compile(r'javascript:', re.IGNORECASE),
            re.compile(r'on\w+\s*=', re.IGNORECASE),
            re.compile(r'<iframe[^>]*>.*?</iframe>', re.IGNORECASE | re.DOTALL),
            re.compile(r'<object[^>]*>.*?</object>', re.IGNORECASE | re.DOTALL),
        ]
    
    def validate_text_input(self, text: str) -> bool:
        """Validate text input for safety and constraints"""
        if not isinstance(text, str):
            return False
        
        # Check length constraints
        if len(text) < self.min_text_length or len(text) > self.max_text_length:
            return False
        
        # Check for malicious patterns
        for pattern in self.malicious_patterns:
            if pattern.search(text):
                return False
        
        return True
    
    def validate_file(self, file: FileStorage) -> bool:
        """Validate uploaded file"""
        if not file or not file.filename:
            return False
        
        # Check file extension
        file_ext = self._get_file_extension(file.filename)
        if file_ext not in self.allowed_file_extensions:
            return False
        
        # Check file size (already handled by Flask config, but double-check)
        if hasattr(file, 'content_length') and file.content_length:
            if file.content_length > 16 * 1024 * 1024:  # 16MB
                return False
        
        return True
    
    def sanitize_text(self, text: str) -> str:
        """Sanitize text input by removing potentially harmful content"""
        if not text:
            return ""
        
        # Remove malicious patterns
        sanitized = text
        for pattern in self.malicious_patterns:
            sanitized = pattern.sub('', sanitized)
        
        # Remove null bytes and other control characters
        sanitized = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', sanitized)
        
        # Normalize whitespace
        sanitized = re.sub(r'\s+', ' ', sanitized).strip()
        
        return sanitized
    
    def validate_session_id(self, session_id: str) -> bool:
        """Validate session ID format"""
        if not isinstance(session_id, str):
            return False
        
        # Check if it's a valid UUID format
        uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.IGNORECASE)
        return bool(uuid_pattern.match(session_id))
    
    def validate_export_format(self, format_type: str) -> bool:
        """Validate export format"""
        allowed_formats = {'json', 'csv', 'report'}
        return format_type in allowed_formats
    
    def _get_file_extension(self, filename: str) -> str:
        """Get file extension in lowercase"""
        if '.' not in filename:
            return ''
        return '.' + filename.rsplit('.', 1)[1].lower()
    
    def is_safe_filename(self, filename: str) -> bool:
        """Check if filename is safe"""
        if not filename:
            return False
        
        # Check for path traversal attempts
        if '..' in filename or '/' in filename or '\\' in filename:
            return False
        
        # Check for reserved names (Windows)
        reserved_names = {'CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 
                         'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 
                         'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'}
        
        name_without_ext = filename.rsplit('.', 1)[0].upper()
        if name_without_ext in reserved_names:
            return False
        
        return True