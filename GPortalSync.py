import os
from ftplib import FTP
import sys

# Get credentials from GitHub Secrets
host = os.getenv('GPORTAL_IP')
user = os.getenv('GPORTAL_USER')
password = os.getenv('GPORTAL_PASS')
port = 50021

# CONFIGURATION
# I am using careerSavegame.xml as the source. 
# You can change this to "farms.xml" or "players.xml" if you prefer.
remote_filename = "careerSavegame.xml" 
local_filename = "live_vault.xml"

try:
    print(f"Connecting to {host} on port {port}...")
    ftp = FTP()
    ftp.connect(host, port, timeout=30)
    
    print(f"Logging in as {user}...")
    ftp.login(user=user, passwd=password)
    
    ftp.set_pasv(True)
    
    # Farming Simulator files are often inside a savegame folder
    # If the script fails, we might need to add: ftp.cwd('savegame1')
    
    print(f"Downloading {remote_filename} and saving as {local_filename}...")
    with open(local_filename, 'wb') as fp:
        ftp.retrbinary(f'RETR {remote_filename}', fp.write)
    
    ftp.quit()
    print("Sync Successful! live_vault.xml is ready.")

except Exception as e:
    print(f"SYNC FAILED: {e}")
    sys.exit(1)
