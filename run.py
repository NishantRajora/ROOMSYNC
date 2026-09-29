"""Start the RoomSync backend and frontend for local/network development."""

from __future__ import annotations

import os
import socket
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"
BACKEND_HOST = "0.0.0.0"
BACKEND_PORT = "8000"
FRONTEND_HOST = "0.0.0.0"
FRONTEND_PORT = "5173"


def npm_command() -> str:
    return "npm.cmd" if os.name == "nt" else "npm"


def network_ip() -> str:
    """Return the address other devices on the local network can use."""
    probe = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        probe.connect(("8.8.8.8", 80))
        return probe.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        probe.close()


def start_services() -> list[subprocess.Popen[bytes]]:
    environment = os.environ.copy()
    environment.setdefault("PYTHONUNBUFFERED", "1")

    backend = subprocess.Popen(
        [
            sys.executable,
            "manage.py",
            "runserver",
            f"{BACKEND_HOST}:{BACKEND_PORT}",
            "--noreload",
        ],
        cwd=BACKEND,
        env=environment,
    )
    frontend = subprocess.Popen(
        [npm_command(), "run", "dev", "--", "--host", FRONTEND_HOST, "--port", FRONTEND_PORT],
        cwd=FRONTEND,
        env=environment,
    )
    return [backend, frontend]


def stop_services(processes: list[subprocess.Popen[bytes]]) -> None:
    for process in processes:
        if process.poll() is None:
            process.terminate()
    for process in processes:
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()


def main() -> int:
    processes = start_services()
    host_ip = network_ip()
    print("RoomSync services are running:")
    print(f"  Frontend: http://localhost:{FRONTEND_PORT}")
    print(f"  Network:  http://{host_ip}:{FRONTEND_PORT}")
    print(f"  API:      http://localhost:{BACKEND_PORT}/api/health/")
    print("Press Ctrl+C to stop both services.")

    try:
        while True:
            exited = next((process for process in processes if process.poll() is not None), None)
            if exited is not None:
                return_code = exited.returncode or 0
                print(f"A service stopped with exit code {return_code}.")
                return return_code
            time.sleep(0.5)
    except KeyboardInterrupt:
        print("\nStopping RoomSync services...")
        return 0
    finally:
        stop_services(processes)


if __name__ == "__main__":
    raise SystemExit(main())
