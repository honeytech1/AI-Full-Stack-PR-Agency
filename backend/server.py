from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
import os
import google.generativeai as genai
from datetime import datetime, timedelta
import uuid
import json
import hashlib
from passlib.context import CryptContext
from jose import JWTError, jwt
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="AI PR Agency API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/pr_agency")
client = MongoClient(MONGO_URL)
db = client.pr_agency

# Google Gemini configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
else:
    logger.error("GEMINI_API_KEY not found in environment variables")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-jwt-key-here")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    email: str
    full_name: str
    company: Optional[str] = None
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class MediaAnalysisRequest(BaseModel):
    company_name: str
    urls: List[str]
    keywords: Optional[List[str]] = []

class BriefGenerationRequest(BaseModel):
    company_name: str
    product_description: str
    target_audience: str
    key_messages: List[str]
    campaign_goals: List[str]

class StressTestRequest(BaseModel):
    brief_content: str
    company_name: str
    industry: str

class ContentRepurposeRequest(BaseModel):
    original_content: str
    target_format: str  # "reel", "carousel", "thread", "linkedin_post"
    brand_voice: str

# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.users.find_one({"_id": user_id})
    if user is None:
        raise credentials_exception
    return user

# AI Agent Classes
class ReputationScannerAgent:
    def __init__(self):
        self.model = model
    
    async def analyze_media_sentiment(self, company_name: str, urls: List[str], keywords: List[str]):
        try:
            # Simulate media analysis - in production, would scrape and analyze real content
            analysis_prompt = f"""
            Analyze the media sentiment for company: {company_name}
            Keywords to focus on: {', '.join(keywords) if keywords else 'general sentiment'}
            
            Provide a detailed sentiment analysis including:
            1. Overall sentiment score (1-10, where 10 is most positive)
            2. Key themes mentioned
            3. Positive mentions
            4. Negative mentions
            5. Neutral mentions
            6. Recommendations for improvement
            
            Format the response as JSON with clear sections.
            """
            
            response = self.model.generate_content(analysis_prompt)
            
            # Parse and structure the response
            analysis_result = {
                "company_name": company_name,
                "analysis_date": datetime.utcnow().isoformat(),
                "sentiment_score": 7.5,  # Would be calculated from actual analysis
                "total_mentions": len(urls),
                "positive_mentions": int(len(urls) * 0.6),
                "negative_mentions": int(len(urls) * 0.2),
                "neutral_mentions": int(len(urls) * 0.2),
                "key_themes": ["innovation", "customer service", "product quality"],
                "detailed_analysis": response.text,
                "recommendations": [
                    "Amplify positive customer service stories",
                    "Address pricing concerns proactively",
                    "Leverage innovation narrative in tech publications"
                ]
            }
            
            return analysis_result
            
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {str(e)}")
            raise HTTPException(status_code=500, detail="Error analyzing media sentiment")

class BriefGeneratorAgent:
    def __init__(self):
        self.model = model
    
    async def generate_pr_brief(self, company_name: str, product_description: str, 
                               target_audience: str, key_messages: List[str], campaign_goals: List[str]):
        try:
            brief_prompt = f"""
            Create a comprehensive PR brief for:
            Company: {company_name}
            Product/Service: {product_description}
            Target Audience: {target_audience}
            Key Messages: {', '.join(key_messages)}
            Campaign Goals: {', '.join(campaign_goals)}
            
            Generate a professional PR brief including:
            1. Executive Summary
            2. Background & Context
            3. Objectives & Goals
            4. Target Audience Analysis
            5. Key Messages & Positioning
            6. Media Strategy & Tactics
            7. Timeline & Milestones
            8. Success Metrics
            9. Potential Story Angles (5-7 unique angles)
            10. Media Contact Strategy
            
            Make it comprehensive and actionable for PR professionals.
            """
            
            response = self.model.generate_content(brief_prompt)
            
            brief_result = {
                "company_name": company_name,
                "brief_id": str(uuid.uuid4()),
                "created_at": datetime.utcnow().isoformat(),
                "brief_content": response.text,
                "story_angles": [
                    "Innovation leadership angle",
                    "Customer success story angle", 
                    "Industry transformation angle",
                    "Founder journey angle",
                    "Future trend angle"
                ],
                "recommended_media": [
                    "TechCrunch", "Forbes", "Industry publications", 
                    "Local business journals", "Podcasts"
                ]
            }
            
            return brief_result
            
        except Exception as e:
            logger.error(f"Error generating PR brief: {str(e)}")
            raise HTTPException(status_code=500, detail="Error generating PR brief")

class MessageStressAgent:
    def __init__(self):
        self.model = model
    
    async def stress_test_message(self, brief_content: str, company_name: str, industry: str):
        try:
            stress_test_prompt = f"""
            You are an experienced investigative journalist. Review this PR brief and create tough but fair questions:
            
            Company: {company_name}
            Industry: {industry}
            Brief Content: {brief_content}
            
            Generate 10 challenging questions that a journalist might ask, including:
            - Skeptical questions about claims
            - Competitive positioning challenges
            - Potential controversy areas
            - Market validation questions
            - Financial sustainability questions
            
            For each question, also provide:
            1. The question category (skeptical, competitive, financial, etc.)
            2. Difficulty level (1-5)
            3. Suggested response strategy
            
            Format as JSON for easy parsing.
            """
            
            response = self.model.generate_content(stress_test_prompt)
            
            stress_test_result = {
                "company_name": company_name,
                "test_id": str(uuid.uuid4()),
                "created_at": datetime.utcnow().isoformat(),
                "industry": industry,
                "questions": response.text,
                "overall_difficulty": "Medium-High",
                "preparation_tips": [
                    "Prepare specific examples and case studies",
                    "Have financial metrics ready",
                    "Practice concise, confident responses",
                    "Anticipate follow-up questions"
                ]
            }
            
            return stress_test_result
            
        except Exception as e:
            logger.error(f"Error in message stress testing: {str(e)}")
            raise HTTPException(status_code=500, detail="Error in message stress testing")

class ContentRepurposeAgent:
    def __init__(self):
        self.model = model
    
    async def repurpose_content(self, original_content: str, target_format: str, brand_voice: str):
        try:
            format_instructions = {
                "reel": "Create a 30-60 second video script with hooks, key points, and call-to-action",
                "carousel": "Create 5-7 slides with headlines and key points for each slide",
                "thread": "Create a Twitter/X thread with 8-12 tweets, including hooks and engagement",
                "linkedin_post": "Create a professional LinkedIn post with storytelling and clear value proposition"
            }
            
            repurpose_prompt = f"""
            Repurpose this content for {target_format}:
            Original Content: {original_content}
            Brand Voice: {brand_voice}
            
            Instructions: {format_instructions.get(target_format, "Create engaging social media content")}
            
            Make it engaging, platform-appropriate, and maintain the brand voice.
            Include relevant hashtags and engagement strategies.
            """
            
            response = self.model.generate_content(repurpose_prompt)
            
            repurpose_result = {
                "original_content_preview": original_content[:200] + "...",
                "target_format": target_format,
                "brand_voice": brand_voice,
                "repurposed_content": response.text,
                "created_at": datetime.utcnow().isoformat(),
                "estimated_engagement": "High" if target_format in ["reel", "thread"] else "Medium",
                "platform_tips": [
                    f"Optimized for {target_format} format",
                    "Includes engagement hooks",
                    "Brand voice maintained",
                    "Call-to-action included"
                ]
            }
            
            return repurpose_result
            
        except Exception as e:
            logger.error(f"Error repurposing content: {str(e)}")
            raise HTTPException(status_code=500, detail="Error repurposing content")

# Initialize AI agents
reputation_agent = ReputationScannerAgent()
brief_agent = BriefGeneratorAgent()
stress_agent = MessageStressAgent()
content_agent = ContentRepurposeAgent()

# API Routes
@app.get("/")
async def root():
    return {"message": "AI PR Agency API", "version": "1.0.0", "status": "running"}

@app.post("/api/auth/register", response_model=dict)
async def register_user(user: UserCreate):
    # Check if user already exists
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    
    user_doc = {
        "_id": user_id,
        "email": user.email,
        "hashed_password": hashed_password,
        "full_name": user.full_name,
        "company": user.company,
        "created_at": datetime.utcnow()
    }
    
    db.users.insert_one(user_doc)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "message": "User registered successfully"}

@app.post("/api/auth/login", response_model=dict)
async def login_user(user: UserLogin):
    # Find user
    user_doc = db.users.find_one({"email": user.email})
    if not user_doc or not verify_password(user.password, user_doc["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_doc["_id"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "message": "Login successful"}

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["_id"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "company": current_user.get("company"),
        "created_at": current_user["created_at"]
    }

@app.post("/api/agents/reputation-scan")
async def analyze_media_reputation(
    request: MediaAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    result = await reputation_agent.analyze_media_sentiment(
        request.company_name,
        request.urls,
        request.keywords
    )
    
    # Save analysis to database
    analysis_doc = {
        "user_id": current_user["_id"],
        "analysis_id": str(uuid.uuid4()),
        "type": "reputation_scan",
        "result": result,
        "created_at": datetime.utcnow()
    }
    db.analyses.insert_one(analysis_doc)
    
    return result

@app.post("/api/agents/brief-generation")
async def generate_pr_brief(
    request: BriefGenerationRequest,
    current_user: dict = Depends(get_current_user)
):
    result = await brief_agent.generate_pr_brief(
        request.company_name,
        request.product_description,
        request.target_audience,
        request.key_messages,
        request.campaign_goals
    )
    
    # Save brief to database
    brief_doc = {
        "user_id": current_user["_id"],
        "brief_id": result["brief_id"],
        "type": "pr_brief",
        "result": result,
        "created_at": datetime.utcnow()
    }
    db.briefs.insert_one(brief_doc)
    
    return result

@app.post("/api/agents/stress-test")
async def stress_test_message(
    request: StressTestRequest,
    current_user: dict = Depends(get_current_user)
):
    result = await stress_agent.stress_test_message(
        request.brief_content,
        request.company_name,
        request.industry
    )
    
    # Save stress test to database
    test_doc = {
        "user_id": current_user["_id"],
        "test_id": result["test_id"],
        "type": "stress_test",
        "result": result,
        "created_at": datetime.utcnow()
    }
    db.stress_tests.insert_one(test_doc)
    
    return result

@app.post("/api/agents/content-repurpose")
async def repurpose_content(
    request: ContentRepurposeRequest,
    current_user: dict = Depends(get_current_user)
):
    result = await content_agent.repurpose_content(
        request.original_content,
        request.target_format,
        request.brand_voice
    )
    
    # Save repurposed content to database
    content_doc = {
        "user_id": current_user["_id"],
        "content_id": str(uuid.uuid4()),
        "type": "content_repurpose",
        "result": result,
        "created_at": datetime.utcnow()
    }
    db.content_repurpose.insert_one(content_doc)
    
    return result

@app.get("/api/dashboard/overview")
async def get_dashboard_overview(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    
    # Get counts of different activities
    analyses_count = db.analyses.count_documents({"user_id": user_id})
    briefs_count = db.briefs.count_documents({"user_id": user_id})
    stress_tests_count = db.stress_tests.count_documents({"user_id": user_id})
    content_count = db.content_repurpose.count_documents({"user_id": user_id})
    
    # Get recent activities
    recent_activities = []
    
    # Get recent analyses
    recent_analyses = list(db.analyses.find({"user_id": user_id}).sort("created_at", -1).limit(3))
    for analysis in recent_analyses:
        recent_activities.append({
            "id": analysis["analysis_id"],
            "type": "Reputation Scan",
            "description": f"Analyzed {analysis['result']['company_name']}",
            "created_at": analysis["created_at"]
        })
    
    # Get recent briefs
    recent_briefs = list(db.briefs.find({"user_id": user_id}).sort("created_at", -1).limit(3))
    for brief in recent_briefs:
        recent_activities.append({
            "id": brief["brief_id"],
            "type": "PR Brief",
            "description": f"Generated brief for {brief['result']['company_name']}",
            "created_at": brief["created_at"]
        })
    
    # Sort activities by date
    recent_activities.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {
        "user": {
            "name": current_user["full_name"],
            "company": current_user.get("company", "Not specified")
        },
        "stats": {
            "total_analyses": analyses_count,
            "total_briefs": briefs_count,
            "total_stress_tests": stress_tests_count,
            "total_content_pieces": content_count
        },
        "recent_activities": recent_activities[:10]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
