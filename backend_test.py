#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Alaama Creative Studio
Tests all backend endpoints including contact form, CMS, authentication, and public APIs
"""

import requests
import json
import time
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://tweetverse-445.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class AlamaAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url.replace('/api', '')}/health")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Health Check", True, f"Status: {data.get('status')}, DB: {data.get('database')}")
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Root Endpoint", True, f"Message: {data.get('message')}, Version: {data.get('version')}")
            else:
                self.log_test("Root Endpoint", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Root Endpoint", False, f"Exception: {str(e)}")
    
    def test_contact_form_valid_submission(self):
        """Test contact form with valid data"""
        try:
            contact_data = {
                "name": "Sarah Johnson",
                "email": "sarah.johnson@example.com",
                "company": "Tech Innovations Ltd",
                "message": "I'm interested in your brand strategy services for our upcoming product launch. Could we schedule a consultation to discuss our requirements?"
            }
            
            response = self.session.post(f"{self.base_url}/contact/", json=contact_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Contact Form Valid Submission", True, f"Submission ID: {data.get('id')}")
                else:
                    self.log_test("Contact Form Valid Submission", False, f"Success=False: {data.get('message')}")
            else:
                self.log_test("Contact Form Valid Submission", False, f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Contact Form Valid Submission", False, f"Exception: {str(e)}")
    
    def test_contact_form_spam_protection(self):
        """Test contact form honeypot spam protection"""
        try:
            spam_data = {
                "name": "Spam Bot",
                "email": "spam@bot.com",
                "company": "Spam Corp",
                "message": "This is a spam message",
                "honeypot": "spam_value"  # This should trigger spam protection
            }
            
            response = self.session.post(f"{self.base_url}/contact/", json=spam_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("id") is None:
                    self.log_test("Contact Form Spam Protection", True, "Spam detected and handled correctly")
                else:
                    self.log_test("Contact Form Spam Protection", False, f"Spam not detected: {data}")
            else:
                self.log_test("Contact Form Spam Protection", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Contact Form Spam Protection", False, f"Exception: {str(e)}")
    
    def test_contact_form_validation(self):
        """Test contact form validation with invalid data"""
        try:
            invalid_data = {
                "name": "",  # Empty name
                "email": "invalid-email",  # Invalid email
                "message": "Short"  # Too short message
            }
            
            response = self.session.post(f"{self.base_url}/contact/", json=invalid_data)
            if response.status_code == 422:  # Validation error
                self.log_test("Contact Form Validation", True, "Validation errors caught correctly")
            else:
                self.log_test("Contact Form Validation", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_test("Contact Form Validation", False, f"Exception: {str(e)}")
    
    def test_contact_form_rate_limiting(self):
        """Test contact form rate limiting"""
        try:
            contact_data = {
                "name": "Rate Test User",
                "email": "ratetest@example.com",
                "company": "Test Corp",
                "message": "Testing rate limiting functionality with multiple rapid submissions."
            }
            
            # Send multiple requests rapidly
            success_count = 0
            rate_limited = False
            
            for i in range(7):  # Try 7 requests (limit is 5)
                response = self.session.post(f"{self.base_url}/contact/", json=contact_data)
                if response.status_code == 429:
                    rate_limited = True
                    break
                elif response.status_code == 200:
                    success_count += 1
                time.sleep(0.1)  # Small delay
            
            if rate_limited:
                self.log_test("Contact Form Rate Limiting", True, f"Rate limiting triggered after {success_count} requests")
            else:
                self.log_test("Contact Form Rate Limiting", False, f"Rate limiting not triggered after {success_count} requests")
        except Exception as e:
            self.log_test("Contact Form Rate Limiting", False, f"Exception: {str(e)}")
    
    def test_admin_login_valid(self):
        """Test admin login with correct credentials"""
        try:
            login_data = {
                "username": ADMIN_USERNAME,
                "password": ADMIN_PASSWORD
            }
            
            response = self.session.post(f"{self.base_url}/auth/login", data=login_data)
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.auth_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.log_test("Admin Login Valid", True, f"Token type: {data.get('token_type')}")
                else:
                    self.log_test("Admin Login Valid", False, "No access token in response")
            else:
                self.log_test("Admin Login Valid", False, f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Admin Login Valid", False, f"Exception: {str(e)}")
    
    def test_admin_login_invalid(self):
        """Test admin login with incorrect credentials"""
        try:
            login_data = {
                "username": "admin",
                "password": "wrongpassword"
            }
            
            response = self.session.post(f"{self.base_url}/auth/login", data=login_data)
            if response.status_code == 401:
                self.log_test("Admin Login Invalid", True, "Invalid credentials rejected correctly")
            else:
                self.log_test("Admin Login Invalid", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Admin Login Invalid", False, f"Exception: {str(e)}")
    
    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.auth_token:
            self.log_test("Get Current User", False, "No auth token available")
            return
            
        try:
            response = self.session.get(f"{self.base_url}/auth/me")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Get Current User", True, f"Username: {data.get('username')}, Role: {data.get('role')}")
            else:
                self.log_test("Get Current User", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Get Current User", False, f"Exception: {str(e)}")
    
    def test_public_services(self):
        """Test public services endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/public/services")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Public Services", True, f"Retrieved {len(data)} services")
                else:
                    self.log_test("Public Services", False, "Response is not a list")
            else:
                self.log_test("Public Services", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Public Services", False, f"Exception: {str(e)}")
    
    def test_public_case_studies(self):
        """Test public case studies endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/public/case-studies")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Public Case Studies", True, f"Retrieved {len(data)} case studies")
                else:
                    self.log_test("Public Case Studies", False, "Response is not a list")
            else:
                self.log_test("Public Case Studies", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Public Case Studies", False, f"Exception: {str(e)}")
    
    def test_public_config(self):
        """Test public config endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/public/config")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Public Config", True, f"Config keys: {list(data.keys())}")
            else:
                self.log_test("Public Config", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Public Config", False, f"Exception: {str(e)}")
    
    def test_cms_services_get(self):
        """Test CMS services GET endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/cms/services")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("CMS Services GET", True, f"Retrieved {len(data)} services")
                else:
                    self.log_test("CMS Services GET", False, "Response is not a list")
            else:
                self.log_test("CMS Services GET", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("CMS Services GET", False, f"Exception: {str(e)}")
    
    def test_cms_case_studies_get(self):
        """Test CMS case studies GET endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/cms/case-studies")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("CMS Case Studies GET", True, f"Retrieved {len(data)} case studies")
                else:
                    self.log_test("CMS Case Studies GET", False, "Response is not a list")
            else:
                self.log_test("CMS Case Studies GET", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("CMS Case Studies GET", False, f"Exception: {str(e)}")
    
    def test_cms_service_create(self):
        """Test CMS service creation (requires auth)"""
        if not self.auth_token:
            self.log_test("CMS Service Create", False, "No auth token available")
            return
            
        try:
            service_data = {
                "title": "Test Service",
                "subtitle": "Testing service creation",
                "description": "This is a test service created during API testing to verify the CMS functionality works correctly.",
                "icon": "TestTube",
                "outcomes": [
                    "Test outcome 1",
                    "Test outcome 2",
                    "Test outcome 3"
                ],
                "order": 99,
                "active": True
            }
            
            response = self.session.post(f"{self.base_url}/cms/services", json=service_data)
            if response.status_code == 200:
                data = response.json()
                self.test_service_id = data.get("id")
                self.log_test("CMS Service Create", True, f"Created service with ID: {self.test_service_id}")
            else:
                self.log_test("CMS Service Create", False, f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("CMS Service Create", False, f"Exception: {str(e)}")
    
    def test_cms_service_update(self):
        """Test CMS service update (requires auth)"""
        if not self.auth_token or not hasattr(self, 'test_service_id'):
            self.log_test("CMS Service Update", False, "No auth token or test service ID available")
            return
            
        try:
            update_data = {
                "title": "Updated Test Service",
                "description": "This service has been updated during testing to verify the update functionality."
            }
            
            response = self.session.put(f"{self.base_url}/cms/services/{self.test_service_id}", json=update_data)
            if response.status_code == 200:
                data = response.json()
                self.log_test("CMS Service Update", True, f"Updated service: {data.get('title')}")
            else:
                self.log_test("CMS Service Update", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("CMS Service Update", False, f"Exception: {str(e)}")
    
    def test_cms_service_delete(self):
        """Test CMS service deletion (requires auth)"""
        if not self.auth_token or not hasattr(self, 'test_service_id'):
            self.log_test("CMS Service Delete", False, "No auth token or test service ID available")
            return
            
        try:
            response = self.session.delete(f"{self.base_url}/cms/services/{self.test_service_id}")
            if response.status_code == 200:
                data = response.json()
                self.log_test("CMS Service Delete", True, f"Message: {data.get('message')}")
            else:
                self.log_test("CMS Service Delete", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("CMS Service Delete", False, f"Exception: {str(e)}")
    
    def test_protected_endpoint_without_auth(self):
        """Test protected endpoint without authentication"""
        try:
            # Temporarily remove auth header
            auth_header = self.session.headers.pop("Authorization", None)
            
            response = self.session.get(f"{self.base_url}/auth/me")
            
            # Restore auth header if it existed
            if auth_header:
                self.session.headers["Authorization"] = auth_header
            
            if response.status_code == 401:
                self.log_test("Protected Endpoint Without Auth", True, "Unauthorized access correctly blocked")
            else:
                self.log_test("Protected Endpoint Without Auth", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Protected Endpoint Without Auth", False, f"Exception: {str(e)}")
    
    def test_contact_submissions_get(self):
        """Test getting contact submissions (admin only)"""
        if not self.auth_token:
            self.log_test("Contact Submissions GET", False, "No auth token available")
            return
            
        try:
            response = self.session.get(f"{self.base_url}/contact/submissions")
            if response.status_code == 200:
                data = response.json()
                submissions = data.get("submissions", [])
                total = data.get("total", 0)
                self.log_test("Contact Submissions GET", True, f"Retrieved {len(submissions)} of {total} submissions")
            else:
                self.log_test("Contact Submissions GET", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Contact Submissions GET", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Alaama Creative Studio Backend API Tests")
        print(f"🌐 Base URL: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity tests
        self.test_health_check()
        self.test_root_endpoint()
        
        # Contact form tests
        print("\n📧 Contact Form Tests")
        print("-" * 30)
        self.test_contact_form_valid_submission()
        self.test_contact_form_spam_protection()
        self.test_contact_form_validation()
        self.test_contact_form_rate_limiting()
        
        # Authentication tests
        print("\n🔐 Authentication Tests")
        print("-" * 30)
        self.test_admin_login_invalid()
        self.test_admin_login_valid()
        self.test_get_current_user()
        self.test_protected_endpoint_without_auth()
        
        # Public API tests
        print("\n🌍 Public API Tests")
        print("-" * 30)
        self.test_public_services()
        self.test_public_case_studies()
        self.test_public_config()
        
        # CMS tests
        print("\n📝 CMS API Tests")
        print("-" * 30)
        self.test_cms_services_get()
        self.test_cms_case_studies_get()
        self.test_cms_service_create()
        self.test_cms_service_update()
        self.test_cms_service_delete()
        self.test_contact_submissions_get()
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            print("-" * 30)
            for result in self.test_results:
                if not result["success"]:
                    print(f"• {result['test']}: {result['details']}")
        
        print("\n🎯 CRITICAL ISSUES:")
        print("-" * 30)
        critical_failures = []
        for result in self.test_results:
            if not result["success"]:
                if any(keyword in result["test"].lower() for keyword in ["login", "auth", "contact", "database"]):
                    critical_failures.append(result)
        
        if critical_failures:
            for failure in critical_failures:
                print(f"🚨 {failure['test']}: {failure['details']}")
        else:
            print("✅ No critical issues found")

if __name__ == "__main__":
    tester = AlamaAPITester()
    tester.run_all_tests()