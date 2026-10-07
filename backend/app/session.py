"""
Keeps every visitor's files and progress separate.

The website creates a new random session id every time the page is loaded and
sends it with each request (?sid=...). Files are stored in sessions/<id>/ and
the progress is stored per id, so:
  - refreshing the page starts clean
  - two visitors (or two devices) never see each other's images
Old sessions are deleted automatically after one hour of inactivity.
"""

import re
import shutil
import time
from pathlib import Path

from fastapi import HTTPException

SESSIONS_ROOT = Path("sessions")
SESSIONS_ROOT.mkdir(parents=True, exist_ok=True)

# Delete a session's files after this many seconds without any activity
SESSION_MAX_AGE_SECONDS = 60 * 60

_ID_PATTERN = re.compile(r"[A-Za-z0-9-]{16,64}")

_states: dict[str, dict] = {}
_last_seen: dict[str, float] = {}


def check_session_id(session_id: str | None) -> str:
    """Return the id if it looks valid, otherwise stop with a clear error."""
    if not session_id or not _ID_PATTERN.fullmatch(session_id):
        raise HTTPException(
            status_code=400,
            detail="Missing or invalid session id. Please reload the page.",
        )
    return session_id


def _touch(session_id: str) -> None:
    _last_seen[session_id] = time.time()


def _session_folder(session_id: str | None, name: str) -> Path:
    session_id = check_session_id(session_id)
    folder = SESSIONS_ROOT / session_id / name
    folder.mkdir(parents=True, exist_ok=True)
    _touch(session_id)
    return folder


def upload_dir(session_id: str | None) -> Path:
    return _session_folder(session_id, "uploads")


def processed_dir(session_id: str | None) -> Path:
    return _session_folder(session_id, "processed")


def new_state() -> dict:
    return {
        "status": "idle",
        "stage": "Waiting for input",
        "progress": 0,
        "input_filename": None,
        "output_filename": None,
        "input_resolution": "10m",
        "target_resolution": "≤4m",
    }


def get_state(session_id: str | None) -> dict:
    """The progress/result state that belongs to this visitor only."""
    session_id = check_session_id(session_id)
    _touch(session_id)
    return _states.setdefault(session_id, new_state())


def cleanup_old_sessions() -> None:
    """Delete files and state of sessions that have been idle for too long."""
    now = time.time()

    for folder in SESSIONS_ROOT.iterdir():
        if not folder.is_dir():
            continue

        last_active = _last_seen.get(folder.name)
        if last_active is None:
            # Unknown after a server restart: fall back to the folder's age
            last_active = folder.stat().st_mtime

        if now - last_active > SESSION_MAX_AGE_SECONDS:
            shutil.rmtree(folder, ignore_errors=True)
            _states.pop(folder.name, None)
            _last_seen.pop(folder.name, None)

    # State without any files (for example a visitor who never uploaded)
    for session_id in list(_states):
        if now - _last_seen.get(session_id, 0) > SESSION_MAX_AGE_SECONDS:
            _states.pop(session_id, None)
            _last_seen.pop(session_id, None)
