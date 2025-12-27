import os
from ftplib import FTP
import sys

host = os.getenv('GPORTAL_IP')
user = os.getenv('GPORTAL_USER')
password = os.getenv('GPORTAL_PASS')
port = 50021
remote_folder = "profile/savegame3"

# List of all files needed for the full non-compact report
files_to_sync = [
    "careerSavegame.xml", "farms.xml", "vehicles.xml", 
    "placeables.xml", "farmland.xml", "players.xml",
    "economy.xml", "environment.xml"
]

try:
    print(f"Connecting to {host}...")
    ftp = FTP()
    ftp.connect(host, port, timeout=30)
    ftp.login(user=user, passwd=password)
    ftp.set_pasv(True)
    ftp.cwd(remote_folder)
    
    for filename in files_to_sync:
        print(f"Syncing: {filename}")
        with open(filename, 'wb') as fp:
            ftp.retrbinary(f'RETR {filename}', fp.write)
    
    ftp.quit()
    print("ALL DATA DOWNLOADED TO WORKER.")
except Exception as e:
    print(f"SYNC FAILED: {e}")
    sys.exit(1)
