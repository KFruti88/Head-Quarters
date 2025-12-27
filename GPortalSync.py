import os
import time
import ftplib
from github import Github

# === CONFIGURATION (FILL THESE IN) ===
# GPortal FTP Credentials
FTP_HOST = "your_gportal_ip"
FTP_USER = "your_username"
FTP_PASS = "your_password"
SAVE_PATH = "/savegame1" # Usually where XMLs live

# GitHub Credentials
GH_TOKEN = "your_github_token"
GH_REPO  = "KFruti88/your_repo_name"

# Timing
SMALL_INTERVAL = 7 * 60  # 7 Minutes
LARGE_INTERVAL = 30 * 60 # 30 Minutes

# File Groups
SMALL_FILES = ['farms.xml', 'vehicles.xml', 'missions.xml', 'careerSavegame.xml', 'collectibles.xml', 'placeables.xml', 'farmland.xml']
LARGE_FILES = ['items.xml', 'densityMapHeight.xml', 'densityMap_fruits_growthState.xml', 'precisionFarming.xml', 'sales.xml', 'snow_state.xml', 'environment.xml']

# Connect to GitHub
gh = Github(GH_TOKEN)
repo = gh.get_repo(GH_REPO)

def sync_files(file_list, message):
    try:
        # 1. Connect to GPortal FTP
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(SAVE_PATH)

        for filename in file_list:
            # 2. Download from GPortal
            local_file = filename
            with open(local_file, 'wb') as f:
                ftp.retrbinary(f"RETR {filename}", f.write)

            # 3. Upload to GitHub
            with open(local_file, 'rb') as f:
                content = f.read()
                
            try:
                # Update existing file
                contents = repo.get_contents(filename)
                repo.update_file(contents.path, message, content, contents.sha)
                print(f"Updated: {filename}")
            except:
                # Create if it doesn't exist
                repo.create_file(filename, message, content)
                print(f"Created: {filename}")
        
        ftp.quit()
    except Exception as e:
        print(f"Error during sync: {e}")

# === MAIN LOOP ===
last_small = 0
last_large = 0

print("618 Tactical Sync Started...")

while True:
    now = time.time()

    # Run Small Sync (7 Min)
    if now - last_small >= SMALL_INTERVAL:
        print(f"Syncing Small Files at {time.ctime()}...")
        sync_files(SMALL_FILES, "Tactical Update [Quick Sync]")
        last_small = now

    # Run Heavy Sync (30 Min)
    if now - last_large >= LARGE_INTERVAL:
        print(f"Syncing Heavy Files at {time.ctime()}...")
        sync_files(LARGE_FILES, "Environmental Update [Heavy Data]")
        last_large = now

    time.sleep(30) # Sleep to save CPU
