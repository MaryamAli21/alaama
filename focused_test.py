#!/usr/bin/env python3
"""
Focused testing for specific issues found in the comprehensive test
"""

import requests
import time
import json

BASE_URL = "https://tweetverse-445.preview.emergentagent.com/api"

def test_rate_limiting_detailed():
    """Test rate limiting with detailed analysis"""
    print("🔍 Testing Rate Limiting in Detail")
    print("-" * 40)
    
    contact_data = {
        "name": "Rate Test User",
        "email": "ratetest@example.com", 
        "company": "Test Corp",
        "message": "Testing rate limiting functionality with multiple rapid submissions."
    }
    
    session = requests.Session()
    results = []
    
    for i in range(8):
        try:
            start_time = time.time()
            response = session.post(f"{BASE_URL}/contact/", json=contact_data)
            end_time = time.time()
            
            result = {
                "request": i + 1,
                "status_code": response.status_code,
                "response_time": round(end_time - start_time, 3),
                "success": response.status_code == 200
            }
            
            if response.status_code == 429:
                result["rate_limited"] = True
                print(f"Request {i+1}: ⚠️  RATE LIMITED (429)")
                break
            elif response.status_code == 200:
                data = response.json()
                result["submission_id"] = data.get("id")
                print(f"Request {i+1}: ✅ SUCCESS ({response.status_code}) - ID: {data.get('id')}")
            else:
                print(f"Request {i+1}: ❌ ERROR ({response.status_code})")
            
            results.append(result)
            time.sleep(0.1)  # Small delay between requests
            
        except Exception as e:
            print(f"Request {i+1}: ❌ EXCEPTION: {str(e)}")
    
    print(f"\n📊 Rate Limiting Results:")
    print(f"Total requests sent: {len(results)}")
    successful_requests = sum(1 for r in results if r.get("success"))
    print(f"Successful requests: {successful_requests}")
    rate_limited = any(r.get("rate_limited") for r in results)
    print(f"Rate limiting triggered: {'Yes' if rate_limited else 'No'}")
    
    return rate_limited

def test_auth_responses():
    """Test authentication response codes"""
    print("\n🔐 Testing Authentication Response Codes")
    print("-" * 40)
    
    session = requests.Session()
    
    # First login to get token
    login_data = {"username": "admin", "password": "admin123"}
    login_response = session.post(f"{BASE_URL}/auth/login", data=login_data)
    
    if login_response.status_code == 200:
        token = login_response.json().get("access_token")
        print(f"✅ Login successful, token obtained")
        
        # Test with valid token
        session.headers.update({"Authorization": f"Bearer {token}"})
        auth_response = session.get(f"{BASE_URL}/auth/me")
        print(f"With valid token: {auth_response.status_code} - {auth_response.reason}")
        
        # Test without token
        session.headers.pop("Authorization", None)
        no_auth_response = session.get(f"{BASE_URL}/auth/me")
        print(f"Without token: {no_auth_response.status_code} - {no_auth_response.reason}")
        
        # Test with invalid token
        session.headers.update({"Authorization": "Bearer invalid_token"})
        invalid_auth_response = session.get(f"{BASE_URL}/auth/me")
        print(f"With invalid token: {invalid_auth_response.status_code} - {invalid_auth_response.reason}")
        
        return {
            "valid_token": auth_response.status_code,
            "no_token": no_auth_response.status_code,
            "invalid_token": invalid_auth_response.status_code
        }
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        return None

def test_email_functionality():
    """Test email functionality (should fail due to missing SMTP config)"""
    print("\n📧 Testing Email Functionality")
    print("-" * 40)
    
    contact_data = {
        "name": "Email Test User",
        "email": "emailtest@example.com",
        "company": "Email Test Corp", 
        "message": "Testing email functionality to verify SMTP configuration and email sending capabilities."
    }
    
    session = requests.Session()
    response = session.post(f"{BASE_URL}/contact/", json=contact_data)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Contact form submitted successfully")
        print(f"Submission ID: {data.get('id')}")
        print(f"Message: {data.get('message')}")
        
        # Check if emails were sent (they should fail due to missing SMTP config)
        print("📧 Email sending expected to fail due to missing SMTP configuration")
        return True
    else:
        print(f"❌ Contact form submission failed: {response.status_code}")
        return False

if __name__ == "__main__":
    print("🔍 FOCUSED BACKEND TESTING")
    print("=" * 50)
    
    # Test rate limiting
    rate_limited = test_rate_limiting_detailed()
    
    # Test auth responses
    auth_results = test_auth_responses()
    
    # Test email functionality
    email_test = test_email_functionality()
    
    print("\n" + "=" * 50)
    print("📋 FOCUSED TEST SUMMARY")
    print("=" * 50)
    
    print(f"Rate Limiting: {'✅ Working' if rate_limited else '❌ Not Working'}")
    
    if auth_results:
        expected_no_token = auth_results["no_token"] in [401, 403]  # Either is acceptable
        expected_invalid_token = auth_results["invalid_token"] in [401, 403]
        print(f"Auth Protection: {'✅ Working' if expected_no_token and expected_invalid_token else '❌ Issues Found'}")
        print(f"  - No token: {auth_results['no_token']} ({'✅' if expected_no_token else '❌'})")
        print(f"  - Invalid token: {auth_results['invalid_token']} ({'✅' if expected_invalid_token else '❌'})")
    
    print(f"Email Integration: {'⚠️  SMTP Not Configured (Expected)' if email_test else '❌ Contact Form Failed'}")