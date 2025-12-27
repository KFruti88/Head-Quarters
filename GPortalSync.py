import os
import time
import ftplib
from github import Github

# === CONFIGURATION (PULLED FROM GITHUB SECRETS) ===
FTP_HOST = os.environ.get('FTP_HOST')
FTP_USER = os.environ.get('FTP_USER')
FTP_PASS = os.environ.get('FTP_PASS')
GH_TOKEN = os.environ.get('GH_TOKEN')

GH_REPO  = "KFruti88/Head-Quarters" 
SAVE_PATH = "/savegame3" # Targeting Savegame 3

# Connect to GitHub
gh = Github(GH_TOKEN)
repo = gh.get_repo(GH_REPO)

def sync_engine(file_list, message):
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(SAVE_PATH)
        
        for filename in file_list:
            try:
                local_file = filename
                with open(local_file, 'wb') as f:
                    ftp.retrbinary(f"RETR {filename}", f.write)

                with open(local_file, 'rb') as f:
                    content = f.read()

                try:
                    contents = repo.get_contents(filename)
                    repo.update_file(contents.path, message, content, contents.sha)
                    print(f"Updated: {filename}")
                except:
                    repo.create_file(filename, message, content)
                    print(f"Created: {filename}")
            except Exception as e:
                print(f"Error syncing {filename}: {e}")
        
        ftp.quit()
    except Exception as e:
        print(f"FTP Connection Error: {e}")

if __name__ == "__main__":
    print(f"--- 618 TACTICAL SYNC: SAVEGAME 3 [{time.ctime()}] ---")
    
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(SAVE_PATH)
        
        # DISCOVERY LOGIC: Grab all Data (XML) and Visuals (PNG)
        # We ignore the heavy .GRLE, .GDM, and .CACHE files
        all_files = ftp.nlst()
        sync_list = [f for f in all_files if f.lower().endswith(('.xml', '.png'))]
        ftp.quit()
        
        print(f"Found {len(sync_list)} data/icon files. Starting Sync...")
        sync_engine(sync_list, "Tactical Data Update [Savegame 3]")
        
    except Exception as e:
        print(f"Discovery Error: {e}")
