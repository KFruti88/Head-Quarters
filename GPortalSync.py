import os
from ftplib import FTP
import sys

# Get credentials from GitHub Secrets
host = os.getenv('GPORTAL_IP')        # 176.57.165.81
user = os.getenv('GPORTAL_USER')      # your username
password = os.getenv('GPORTAL_PASS')  # your password

# Configuration
port = 50021  # <--- WE ADDED THIS
remote_filename = "live_vault.xml" 
local_filename = "live_vault.xml"

try:
    print(f"Connecting to {host} on port {port}...")
    ftp = FTP()
    # We explicitly tell it to use port 50021 here
    ftp.connect(host, port, timeout=30) 
    
    print("Logging in...")
    ftp.login(user=user, passwd=password)
    
    # Still use Passive Mode to get through the GitHub firewall
    ftp.set_pasv(True) 
    
    print(f"Downloading {remote_filename}...")
    with open(local_filename, 'wb') as fp:
        ftp.retrbinary(f'RETR {remote_filename}', fp.write)
    
    ftp.quit()
    print("Sync Successful!")

except Exception as e:
    print(f"CONNECTION FAILED: {e}")
    sys.exit(1)
