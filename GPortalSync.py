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
SAVE_PATH = "/savegame3" # This is the target folder on GPortal

# Connect to GitHub
gh = Github(GH_TOKEN)
repo = gh.get_repo(GH_REPO)

def sync_engine():
    try:
        # 1. Connect to GPortal FTP
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(SAVE_PATH)
        
        # 2. GET THE FULL LIST - NO SELECTING
        all_files_on_server = ftp.nlst()
        
        # 3. FILTER BY EXTENSION ONLY
        # This says: "If it ends in .xml or .png, I want it."
        sync_list = [f for f in all_files_on_server if f.lower().endswith(('.xml', '.png'))]
        
        print(f"--- 618 TOTAL SYNC START [{time.ctime()}] ---")
        print(f"Found {len(sync_list)} total XML/PNG files. Syncing all...")

        for filename in sync_list:
            try:
                # Download file content into memory
                local_file = filename
                with open(local_file, 'wb') as f:
                    ftp.retrbinary(f"RETR {filename}", f.write)

                with open(local_file, 'rb') as f:
                    content = f.read()

                # Push to GitHub (Create if new, Update if exists)
                try:
                    contents = repo.get_contents(filename)
                    repo.update_file(contents.path, f"Auto-Sync: {filename}", content, contents.sha)
                    print(f"SUCCESS: {filename} updated.")
                except:
                    repo.create_file(filename, f"Auto-Sync: {filename}", content)
                    print(f"SUCCESS: {filename} created.")
                
                # Clean up local temp file
                if os.path.exists(local_file):
                    os.remove(local_file)

            except Exception as e:
                print(f"ERROR syncing {filename}: {e}")
        
        ftp.quit()
        print("--- SYNC COMPLETE ---")

    except Exception as e:
        print(f"CRITICAL FTP ERROR: {e}")

if __name__ == "__main__":
    sync_engine()
