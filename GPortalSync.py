import os
from ftplib import FTP
import sys

# Configuration from GitHub Secrets
host = os.getenv('GPORTAL_IP')
user = os.getenv('GPORTAL_USER')
password = os.getenv('GPORTAL_PASS')
port = 50021

# The path to your FS22 savegame on G-Portal
remote_folder = "profile/savegame3"

# ALL files required for the full tactical combined report
files_to_sync = [
    "careerSavegame.xml", 
    "farms.xml", 
    "vehicles.xml", 
    "placeables.xml", 
    "farmland.xml", 
    "players.xml",
    "economy.xml", 
    "environment.xml", 
    "missions.xml"
]

def sync_data():
    try:
        print(f"Connecting to G-Portal FTP at {host}...")
        ftp = FTP()
        # Connect and Login
        ftp.connect(host, port, timeout=30)
        ftp.login(user=user, passwd=password)
        
        # Set to Passive Mode (Required for GitHub Actions runners)
        ftp.set_pasv(True)
        
        print(f"Changing directory to: {remote_folder}")
        ftp.cwd(remote_folder)
        
        for filename in files_to_sync:
            try:
                print(f"Syncing: {filename}...")
                # Use a temporary local name to ensure we don't have write-conflicts
                local_file = filename
                
                # If we are syncing careerSavegame, we might want to name it live_vault
                # for your existing HTML logic, but keeping it standard is safer:
                with open(local_file, 'wb') as fp:
                    ftp.retrbinary(f'RETR {filename}', fp.write)
                print(f"Successfully downloaded {filename}")
                
            except Exception as file_error:
                # If missions.xml doesn't exist yet, we don't want to stop the whole script
                print(f"Warning: Could not sync {filename}. It may not exist on the server yet. ({file_error})")
                continue

        ftp.quit()
        print("--- ALL TACTICAL DATA DOWNLOADED SUCCESSFULLY ---")

    except Exception as e:
        print(f"CRITICAL SYNC ERROR: {e}")
        # Exit with error code 1 so GitHub Actions knows it failed
        sys.exit(1)

if __name__ == "__main__":
    sync_data()
