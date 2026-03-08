from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from services.detectService import FocusSessionService
import os

app = FastAPI()

# Allow frontend Vite dev server to talk to backend
origins = [
    "http://localhost:5173",  # Vite default port
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize your focus service
focus_service = FocusSessionService()


@app.post("/log_session")
async def log_session(request: Request):
    """
    Receives JSON:
    {
        "minutes": float,
        "distractions": int
    }
    """
    data = await request.json()
    minutes = data.get("minutes", 0)
    distractions = data.get("distractions", 0)

    focus_service._save_session_to_json(minutes, distractions, True)
    return {"status": "saved", "minutes": minutes, "distractions": distractions}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)