import os
import time
import ftplib
from github import Github

# === CONFIGURATION ===
FTP_HOST = "your_gportal_ip"
FTP_USER = "your_username"
FTP_PASS = "your_password"
SAVE_PATH = "/savegame1" 

GH_TOKEN = "your_github_token"
GH_REPO  = "KFruti88/your_repo_name"

# Timing Tracks
SMALL_INTERVAL = 7 * 60  
LARGE_INTERVAL = 30 * 60 

# File Groups
SMALL_FILES = ['farms.xml', 'vehicles.xml', 'missions.xml', 'careerSavegame.xml', 'collectibles.xml', 'placeables.xml', 'environment.xml', 'farmland.xml']
# This grabs EVERYTHING else (Density maps, items, etc.)
HEAVY_EXTENSIONS = ['.xml', '.grle', '.png'] 

gh = Github(GH_TOKEN)
repo = gh.get_repo(GH_REPO)

def sync_engine(file_list, message):
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(SAVE_PATH)
        for filename in file_list:
            local_file = filename
            with open(local_file, 'wb') as f:
                ftp.retrbinary(f"RETR {filename}", f.write)
            with open(local_file, 'rb') as f:
                content = f.read()
            try:
                contents = repo.get_contents(filename)
                repo.update_file(contents.path, message, content, contents.sha)
                print(f"Synced: {filename}")
            except:
                repo.create_file(filename, message, content)
        ftp.quit()
    except Exception as e:
        print(f"Sync Error: {e}")

last_small = 0
last_large = 0

while True:
    now = time.time()
    if now - last_small >= SMALL_INTERVAL:
        sync_engine(SMALL_FILES, "Tactical Update [7M Track]")
        last_small = now
    if now - last_large >= LARGE_INTERVAL:
        # Full scan for missing files
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(SAVE_PATH)
        all_xmls = [f for f in ftp.nlst() if f.endswith('.xml')]
        sync_engine(all_xmls, "Environmental Sync [30M Track]")
        last_large = now
    time.sleep(30)
