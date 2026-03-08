import json
import os
from datetime import datetime

FILE = "sessions.json"


def save_session(minutes, distractions, completed=True):
    session = {
        "minutes": minutes,
        "distractions": distractions,
        "completed": completed,
        "timestamp": datetime.now().isoformat()
    }

    if not os.path.exists(FILE):
        data = []
    else:
        with open(FILE, "r") as f:
            data = json.load(f)

    data.append(session)

    with open(FILE, "w") as f:
        json.dump(data, f, indent=2)


def get_today_totals():
    if not os.path.exists(FILE):
        return 0, 0

    with open(FILE, "r") as f:
        sessions = json.load(f)

    today = datetime.now().date()

    total_minutes = 0
    total_distractions = 0

    for s in sessions:
        ts = datetime.fromisoformat(s["timestamp"]).date()

        if ts == today and s["completed"]:
            total_minutes += s["minutes"]
            total_distractions += s["distractions"]

    return total_minutes, total_distractions