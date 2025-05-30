
import requests
import unittest
import sys
import json
import time
from datetime import datetime

class AIPRAgencyAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_email = f"test{int(time.time())}@example.com"
        self.user_password = "testpassword123"
        self.user_fullname = "Test User"
        self.user_company = "TechCorp"

    def run_test(self, name, method, endpoint, expected_status, data=None, auth=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if auth and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_register(self):
        """Test user registration"""
        data = {
            "email": self.user_email,
            "password": self.user_password,
            "full_name": self.user_fullname,
            "company": self.user_company
        }
        success, response = self.run_test("User Registration", "POST", "api/auth/register", 200, data)
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"Token received: {self.token[:10]}...")
        return success

    def test_login(self):
        """Test user login"""
        data = {
            "email": self.user_email,
            "password": self.user_password
        }
        success, response = self.run_test("User Login", "POST", "api/auth/login", 200, data)
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"Token received: {self.token[:10]}...")
        return success

    def test_get_user_profile(self):
        """Test getting user profile"""
        return self.run_test("Get User Profile", "GET", "api/auth/me", 200, auth=True)

    def test_dashboard_overview(self):
        """Test dashboard overview endpoint"""
        return self.run_test("Dashboard Overview", "GET", "api/dashboard/overview", 200, auth=True)

    def test_reputation_scanner(self):
        """Test reputation scanner agent"""
        data = {
            "company_name": "TechCorp",
            "urls": ["https://example.com/news1", "https://example.com/news2"],
            "keywords": ["innovation", "technology", "AI"]
        }
        return self.run_test("Reputation Scanner", "POST", "api/agents/reputation-scan", 200, data, auth=True)

    def test_brief_generator(self):
        """Test brief generator agent"""
        data = {
            "company_name": "TechCorp",
            "product_description": "AI-powered healthcare platform helping doctors diagnose faster",
            "target_audience": "Healthcare professionals and hospital administrators",
            "key_messages": ["Reduces diagnosis time by 50%", "Improves accuracy by 30%", "HIPAA compliant"],
            "campaign_goals": ["Increase adoption in top hospitals", "Generate media coverage", "Position as industry leader"]
        }
        return self.run_test("Brief Generator", "POST", "api/agents/brief-generation", 200, data, auth=True)

    def test_stress_tester(self):
        """Test message stress tester agent"""
        data = {
            "brief_content": "AI-powered healthcare platform helping doctors diagnose faster. Our platform reduces diagnosis time by 50% and improves accuracy by 30%.",
            "company_name": "TechCorp",
            "industry": "Healthcare Technology"
        }
        return self.run_test("Stress Tester", "POST", "api/agents/stress-test", 200, data, auth=True)

    def test_content_repurposer(self):
        """Test content repurposer agent"""
        data = {
            "original_content": "AI-powered healthcare platform helping doctors diagnose faster. Our platform reduces diagnosis time by 50% and improves accuracy by 30%.",
            "target_format": "linkedin_post",
            "brand_voice": "Professional, innovative, and compassionate"
        }
        return self.run_test("Content Repurposer", "POST", "api/agents/content-repurpose", 200, data, auth=True)

def main():
    # Get backend URL from environment or use default
    backend_url = "http://localhost:8001"
    
    print(f"🚀 Starting API tests against {backend_url}")
    tester = AIPRAgencyAPITester(backend_url)
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test authentication flow
    if not tester.test_register():
        print("❌ Registration failed, trying login with test account")
        if not tester.test_login():
            print("❌ Login failed, stopping tests")
            return 1
    
    # Test protected endpoints
    tester.test_get_user_profile()
    tester.test_dashboard_overview()
    
    # Test AI agents
    tester.test_reputation_scanner()
    tester.test_brief_generator()
    tester.test_stress_tester()
    tester.test_content_repurposer()
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
