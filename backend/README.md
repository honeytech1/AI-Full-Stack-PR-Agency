# Backend Application

This directory contains the FastAPI backend application.

## Getting Started

**Note:** Currently, there is an issue with creating an isolated Python virtual environment in the automated tooling. Dependencies will be installed globally within the execution environment for now.

1. Navigate to this directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install fastapi "uvicorn[standard]"
   ```
3. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```
The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000). You can access the health check endpoint at [http://127.0.0.1:8000/api/ping](http://127.0.0.1:8000/api/ping).
