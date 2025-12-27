import os
from ftplib import FTP
import sys

host = os.getenv('GPORTAL_IP')
user = os.getenv('GPORTAL_USER')
password = os.getenv('GPORTAL_PASS')
port = 50021

remote_folder = "profile/savegame3"

# All files required for the full tactical dashboard
files_to_sync = {
    "farms.xml": "farms.xml",           # Balances & Farm IDs
    "vehicles.xml": "vehicles.xml",     # Damage, Fuel, Attachments
    "placeables.xml": "placeables.xml", # Animals, Factories, Production
    "farmland.xml": "farmland.xml",     # Crop growth & Fertilizer levels
    "careerSavegame.xml": "live_vault.xml" # Global stats & Trophies
}

try:
    print(f"Connecting to {host}...")
    ftp = FTP()
    ftp.connect(host, port, timeout=30)
    ftp.login(user=user, passwd=password)
    ftp.set_pasv(True)
    
    print(f"Entering {remote_folder}...")
    ftp.cwd(remote_folder)
    
    for remote, local in files_to_sync.items():
        print(f"Downloading {remote}...")
        with open(local, 'wb') as fp:
            ftp.retrbinary(f'RETR {remote}', fp.write)
    
    ftp.quit()
    print("Full Tactical Sync Complete!")

except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    sys.exit(1)
