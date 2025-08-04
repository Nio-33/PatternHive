import re
import csv
import io
from typing import Dict, List, Set
from email_validator import validate_email, EmailNotValidError
import phonenumbers
from phonenumbers import NumberParseException

class TextExtractor:
    """Core text extraction engine using regex patterns"""
    
    def __init__(self):
        # Email regex pattern - comprehensive but not overly strict
        self.email_pattern = re.compile(
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            re.IGNORECASE
        )
        
        # Phone number patterns for various formats
        self.phone_patterns = [
            # US formats: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
            re.compile(r'\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b'),
            # International format: +1-123-456-7890, +44 20 7946 0958
            re.compile(r'\+[1-9]\d{1,14}\b'),
            # General pattern with extensions
            re.compile(r'\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}(?:\s?(?:ext|x|extension)\.?\s?\d+)?\b', re.IGNORECASE)
        ]
        
        # Name patterns - First Last, Last First, titles, etc.
        self.name_patterns = [
            # Title + First + Last (Dr. John Smith, Ms. Jane Doe)
            re.compile(r'\b(?:Dr|Mr|Ms|Mrs|Miss|Prof|Professor)\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]*\.?\s+)?[A-Z][a-z]+)\b'),
            # First + Middle? + Last (John Smith, John A. Smith, John Alan Smith)
            re.compile(r'\b([A-Z][a-z]{1,15}(?:\s+[A-Z]\.?\s+|\s+[A-Z][a-z]{1,15}\s+)?[A-Z][a-z]{1,15})\b'),
            # Last, First format (Smith, John)
            re.compile(r'\b([A-Z][a-z]{1,15},\s+[A-Z][a-z]{1,15}(?:\s+[A-Z]\.?)?)\b')
        ]
        
        # Common words to exclude from name detection
        self.name_exclusions = {
            'and', 'the', 'for', 'with', 'from', 'about', 'into', 'through', 'during',
            'before', 'after', 'above', 'below', 'between', 'among', 'this', 'that',
            'these', 'those', 'company', 'corporation', 'inc', 'llc', 'ltd', 'co',
            'department', 'team', 'group', 'division', 'office', 'center', 'service',
            'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
            'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
            'september', 'october', 'november', 'december', 'dear', 'sincerely',
            'regards', 'thank', 'thanks', 'best', 'yours', 'email', 'phone', 'address'
        }
    
    def extract_emails(self, text: str) -> List[Dict]:
        """Extract and validate email addresses"""
        emails = []
        matches = self.email_pattern.findall(text)
        seen = set()
        
        for match in matches:
            email = match.lower().strip()
            if email not in seen:
                seen.add(email)
                
                # Validate email
                is_valid = True
                try:
                    validate_email(email)
                except EmailNotValidError:
                    is_valid = False
                
                emails.append({
                    'email': email,
                    'valid': is_valid,
                    'domain': email.split('@')[1] if '@' in email else None
                })
        
        return emails
    
    def extract_phones(self, text: str) -> List[Dict]:
        """Extract and validate phone numbers"""
        phones = []
        seen = set()
        
        for pattern in self.phone_patterns:
            matches = pattern.findall(text)
            for match in matches:
                if isinstance(match, tuple):
                    # For grouped patterns, reconstruct the number
                    phone_raw = ''.join(match)
                else:
                    phone_raw = match
                
                # Clean the phone number
                phone_clean = re.sub(r'[^\d+]', '', phone_raw)
                
                if len(phone_clean) >= 10 and phone_clean not in seen:
                    seen.add(phone_clean)
                    
                    # Try to parse and format using phonenumbers
                    formatted_phone = None
                    is_valid = False
                    country = None
                    
                    try:
                        # Try parsing as US number first
                        parsed = phonenumbers.parse(phone_clean, 'US')
                        if phonenumbers.is_valid_number(parsed):
                            is_valid = True
                            formatted_phone = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.NATIONAL)
                            country = phonenumbers.region_code_for_number(parsed)
                    except NumberParseException:
                        # Try international format
                        try:
                            parsed = phonenumbers.parse(phone_clean, None)
                            if phonenumbers.is_valid_number(parsed):
                                is_valid = True
                                formatted_phone = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
                                country = phonenumbers.region_code_for_number(parsed)
                        except NumberParseException:
                            pass
                    
                    phones.append({
                        'phone': phone_raw,
                        'formatted': formatted_phone or phone_raw,
                        'valid': is_valid,
                        'country': country
                    })
        
        return phones
    
    def extract_names(self, text: str) -> List[Dict]:
        """Extract potential names with confidence scoring"""
        names = []
        seen = set()
        
        for pattern in self.name_patterns:
            matches = pattern.findall(text)
            for match in matches:
                name = match.strip()
                name_lower = name.lower()
                
                # Skip if already found or contains excluded words
                if name_lower in seen or any(word in name_lower for word in self.name_exclusions):
                    continue
                
                # Skip if looks like an email or has numbers
                if '@' in name or re.search(r'\d', name):
                    continue
                
                # Skip if too short or too long
                if len(name) < 3 or len(name) > 50:
                    continue
                
                seen.add(name_lower)
                
                # Calculate confidence score
                confidence = self._calculate_name_confidence(name)
                
                names.append({
                    'name': name,
                    'confidence': confidence,
                    'type': self._classify_name_type(name)
                })
        
        # Sort by confidence score
        names.sort(key=lambda x: x['confidence'], reverse=True)
        return names
    
    def _calculate_name_confidence(self, name: str) -> float:
        """Calculate confidence score for extracted name"""
        score = 0.5  # Base score
        
        # Higher score for proper capitalization
        words = name.split()
        if all(word[0].isupper() and word[1:].islower() for word in words if word):
            score += 0.3
        
        # Higher score for 2-3 word names
        if 2 <= len(words) <= 3:
            score += 0.2
        
        # Lower score for single word
        if len(words) == 1:
            score -= 0.2
        
        # Higher score if contains common name indicators
        if any(title in name.lower() for title in ['dr.', 'mr.', 'ms.', 'mrs.', 'prof.']):
            score += 0.3
        
        # Lower score for all caps or mixed case
        if name.isupper() or not any(c.isupper() for c in name):
            score -= 0.2
        
        return min(1.0, max(0.0, score))
    
    def _classify_name_type(self, name: str) -> str:
        """Classify the type of name found"""
        if ',' in name:
            return 'last_first'
        elif any(title in name.lower() for title in ['dr.', 'mr.', 'ms.', 'mrs.', 'prof.']):
            return 'titled'
        elif len(name.split()) >= 3:
            return 'full_with_middle'
        elif len(name.split()) == 2:
            return 'first_last'
        else:
            return 'single'
    
    def extract_all(self, text: str) -> Dict:
        """Extract all data types from text"""
        return {
            'emails': self.extract_emails(text),
            'phones': self.extract_phones(text),
            'names': self.extract_names(text)
        }
    
    def to_csv(self, results: Dict) -> str:
        """Convert results to CSV format"""
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write headers
        writer.writerow(['Type', 'Value', 'Additional Info', 'Valid/Confidence'])
        
        # Write emails
        for email in results['emails']:
            writer.writerow(['Email', email['email'], email['domain'], email['valid']])
        
        # Write phones
        for phone in results['phones']:
            writer.writerow(['Phone', phone['formatted'], phone['country'], phone['valid']])
        
        # Write names
        for name in results['names']:
            writer.writerow(['Name', name['name'], name['type'], f"{name['confidence']:.2f}"])
        
        return output.getvalue()
    
    def to_report(self, results: Dict) -> str:
        """Generate a formatted text report"""
        report = []
        report.append("=" * 50)
        report.append("PATTERNHIVE EXTRACTION REPORT")
        report.append("=" * 50)
        report.append("")
        
        # Summary
        report.append("SUMMARY:")
        report.append(f"  Emails found: {len(results['emails'])}")
        report.append(f"  Phone numbers found: {len(results['phones'])}")
        report.append(f"  Names found: {len(results['names'])}")
        report.append("")
        
        # Emails section
        if results['emails']:
            report.append("EMAILS:")
            report.append("-" * 20)
            for email in results['emails']:
                status = "✓ Valid" if email['valid'] else "✗ Invalid"
                report.append(f"  {email['email']} ({email['domain']}) - {status}")
            report.append("")
        
        # Phones section
        if results['phones']:
            report.append("PHONE NUMBERS:")
            report.append("-" * 20)
            for phone in results['phones']:
                status = "✓ Valid" if phone['valid'] else "✗ Unverified"
                country_info = f" ({phone['country']})" if phone['country'] else ""
                report.append(f"  {phone['formatted']}{country_info} - {status}")
            report.append("")
        
        # Names section
        if results['names']:
            report.append("NAMES:")
            report.append("-" * 20)
            for name in results['names']:
                confidence_bar = "█" * int(name['confidence'] * 10)
                report.append(f"  {name['name']} - {name['confidence']:.2f} {confidence_bar}")
            report.append("")
        
        report.append("=" * 50)
        return '\n'.join(report)