import os
import time
import ftplib
from github import Github

# === CONFIGURATION ===
FTP_HOST = "your_gportal_ip"
FTP_USER = "your_username"
FTP_PASS = "your_password"
SAVE_PATH = "/savegame1" # Path on GPortal

GH_TOKEN = "your_github_token"
GH_REPO  = "KFruti88/your_repo_name"

# Timing as we discussed
SMALL_INTERVAL = 7 * 60  
LARGE_INTERVAL = 30 * 60 

# Connect to GitHub
gh = Github(GH_TOKEN)
repo = gh.get_repo(GH_REPO)

def universal_sync(message):
    try:
        # 1. Connect to GPortal
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(SAVE_PATH)

        # 2. List ALL files in the directory
        all_files = ftp.nlst()
        
        # 3. Filter for only .xml files
        xml_files = [f for f in all_files if f.endswith('.xml')]

        for filename in xml_files:
            # Download
            with open(filename, 'wb') as f:
                ftp.retrbinary(f"RETR {filename}", f.write)

            # Read content
            with open(filename, 'rb') as f:
                content = f.read()

            # Upload to GitHub
            try:
                contents = repo.get_contents(filename)
                repo.update_file(contents.path, message, content, contents.sha)
                print(f"Synced: {filename}")
            except:
                repo.create_file(filename, message, content)
                print(f"Created: {filename}")
        
        ftp.quit()
    except Exception as e:
        print(f"Sync Error: {e}")

# === MAIN LOOP ===
last_small = 0
last_large = 0

while True:
    now = time.time()

    # Small Sync (Tactical) every 7 mins
    if now - last_small >= SMALL_INTERVAL:
        print("Running Tactical Sync...")
        # For the fast sync, we still use a specific list to save time
        FAST_LIST = ['farms.xml', 'vehicles.xml', 'careerSavegame.xml', 'missions.xml']
        # (Internal logic for fast list)
        last_small = now

    # Large Sync (The "Missing" Files) every 30 mins
    if now - last_large >= LARGE_INTERVAL:
        print("Running Full Environmental Sync (grabbing all XMLs)...")
        universal_sync("Full Tactical Intelligence Update [All XMLs]")
        last_large = now

    time.sleep(30)
