import os
import sys
import subprocess
import webbrowser
import time

def main():
    print("==================================================")
    print("   🏠 ROOMSYNC — Launching Web Application       ")
    print("==================================================")
    print("Starting Vite development server on port 3000...")

    # Start npm run dev
    cmd = ["npm", "run", "dev"]
    if os.name == 'nt':
        # On Windows, npm is npm.cmd
        cmd = ["cmd", "/c", "npm run dev"]

    proc = subprocess.Popen(cmd, shell=False)

    print("\n✓ RoomSync is running at: http://localhost:3000")
    print("Press Ctrl+C to stop the server.\n")

    time.sleep(2)
    try:
        webbrowser.open("http://localhost:3000")
    except Exception:
        pass

    try:
        proc.wait()
    except KeyboardInterrupt:
        print("\nStopping RoomSync server...")
        proc.terminate()

if __name__ == "__main__":
    main()
