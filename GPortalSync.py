import os
import time
import ftplib
from github import Github

# === CONFIGURATION (PULLED FROM GITHUB SECRETS) ===
# These match the names you put in your YAML and GitHub Secrets
FTP_HOST = os.environ.get('FTP_HOST')
FTP_USER = os.environ.get('FTP_USER')
FTP_PASS = os.environ.get('FTP_PASS')
GH_TOKEN = os.environ.get('GH_TOKEN')

# Change this to your actual repo name: "Username/Repo"
GH_REPO  = "KFruti88/Head-Quarters" 

# Path on GPortal - usually "/savegame1"
SAVE_PATH = "/savegame1" 

# Timing Logic (Determined by which files we grab)
# We sync "Tactical" files every time. 
# We sync "Heavy" files based on the clock.
SMALL_FILES = [
    'farms.xml', 'vehicles.xml', 'missions.xml', 
    'careerSavegame.xml', 'collectibles.xml', 
    'placeables.xml', 'environment.xml', 'farmland.xml'
]

# Connect to GitHub
gh = Github(GH_TOKEN)
repo = gh.get_repo(GH_REPO)

def sync_engine(file_list, message):
    try:
        # 1. Connect to GPortal
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(SAVE_PATH)
        
        for filename in file_list:
            try:
                # 2. Download from GPortal
                local_file = filename
                with open(local_file, 'wb') as f:
                    ftp.retrbinary(f"RETR {filename}", f.write)

                # 3. Read content
                with open(local_file, 'rb') as f:
                    content = f.read()

                # 4. Push to GitHub
                try:
                    contents = repo.get_contents(filename)
                    repo.update_file(contents.path, message, content, contents.sha)
                    print(f"Success: Updated {filename}")
                except:
                    repo.create_file(filename, message, content)
                    print(f"Success: Created {filename}")
            except Exception as e:
                print(f"Skipping {filename}: Not found or error: {e}")
        
        ftp.quit()
    except Exception as e:
        print(f"Connection Error: {e}")

# === EXECUTION LOGIC ===
# When running in GitHub Actions, we often just run once per trigger
if __name__ == "__main__":
    print(f"--- 618 TACTICAL SYNC STARTING [{time.ctime()}] ---")
    
    # We check if this is a 'Heavy' sync day (Every 30 mins approx)
    # Or just grab everything to be safe since GitHub handles the load
    
    # To ensure you get the "Missing" files you wanted:
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(SAVE_PATH)
        
        # This scans GPortal and finds EVERY XML file automatically
        all_xml_files = [f for f in ftp.nlst() if f.endswith('.xml')]
        ftp.quit()
        
        print(f"Found {len(all_xml_files)} files to sync.")
        sync_engine(all_xml_files, "Global Tactical Intelligence Update")
        
    except Exception as e:
        print(f"Discovery Error: {e}")
