from fastapi import FastAPI

app = FastAPI()

@app.get("/api/ping")
async def ping():
    return {"message": "Backend is running"}
