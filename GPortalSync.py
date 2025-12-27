import os
from ftplib import FTP
import sys

host = os.getenv('GPORTAL_IP')
user = os.getenv('GPORTAL_USER')
password = os.getenv('GPORTAL_PASS')
port = 50021

remote_folder = "profile/savegame3"

# List of all files needed for your detailed dashboard
files_to_sync = {
    "farms.xml": "farms.xml",           # Balances and Farm IDs
    "vehicles.xml": "vehicles.xml",     # Fleet damage, fuel, attachments
    "placeables.xml": "placeables.xml", # Factories, production, storage
    "farmland.xml": "farmland.xml",     # Field ownership
    "players.xml": "players.xml"        # Individual player stats
}

try:
    ftp = FTP()
    ftp.connect(host, port, timeout=30)
    ftp.login(user=user, passwd=password)
    ftp.set_pasv(True)
    ftp.cwd(remote_folder)
    
    for remote, local in files_to_sync.items():
        print(f"Syncing {remote}...")
        with open(local, 'wb') as fp:
            ftp.retrbinary(f'RETR {remote}', fp.write)
    
    ftp.quit()
    print("Full Sync Successful!")

except Exception as e:
    print(f"SYNC FAILED: {e}")
    sys.exit(1)
