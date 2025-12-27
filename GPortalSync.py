import os
from ftplib import FTP
import sys

host = os.getenv('GPORTAL_IP')
user = os.getenv('GPORTAL_USER')
password = os.getenv('GPORTAL_PASS')
port = 50021

# CONFIGURATION - Updated to savegame3 based on your input
remote_folder = "profile/savegame3" 
remote_filename = "careerSavegame.xml" 
local_filename = "live_vault.xml"

try:
    print(f"Connecting to {host} on port {port}...")
    ftp = FTP()
    ftp.connect(host, port, timeout=30)
    
    print(f"Logging in as {user}...")
    ftp.login(user=user, passwd=password)
    ftp.set_pasv(True)
    
    # Moving into the specific path: profile -> savegame3
    print(f"Moving to {remote_folder}...")
    ftp.cwd(remote_folder)
    
    print(f"Downloading {remote_filename}...")
    with open(local_filename, 'wb') as fp:
        ftp.retrbinary(f'RETR {remote_filename}', fp.write)
    
    ftp.quit()
    print("Sync Successful! live_vault.xml is updated.")

except Exception as e:
    print(f"SYNC FAILED: {e}")
    sys.exit(1)
