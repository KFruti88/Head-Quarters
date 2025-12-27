import os
from ftplib import FTP
import sys

host = os.getenv('GPORTAL_IP')
user = os.getenv('GPORTAL_USER')
password = os.getenv('GPORTAL_PASS')
port = 50021
remote_folder = "profile/savegame3"

# ALL files requested for the full tactical report
files_to_sync = [
    "careerSavegame.xml", "farms.xml", "vehicles.xml", 
    "placeables.xml", "farmland.xml", "players.xml",
    "economy.xml", "environment.xml", "missions.xml"
]

try:
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
    print("SYNC COMPLETE: ALL TACTICAL DATA DOWNLOADED.")
except Exception as e:
    print(f"CRITICAL SYNC ERROR: {e}")
    sys.exit(1)
