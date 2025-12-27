import os
from ftplib import FTP
import sys

# 1. Get credentials from GitHub Secrets
host = os.getenv('GPORTAL_IP')        # e.g., '123.456.78.90'
user = os.getenv('GPORTAL_USER')      # e.g., 'gportal_123456'
password = os.getenv('GPORTAL_PASS')  # Your FTP password

# 2. Configuration - CHANGE THESE TO MATCH YOUR SERVER
# If G-Portal gave you a port (usually 21), keep this. 
# If your file is in a subfolder, change remote_path.
remote_filename = "the_actual_file_on_server.xml" 
local_filename = "live_vault.xml"

try:
    print(f"Connecting to {host}...")
    # Connect to the server
    ftp = FTP(host)
    ftp.login(user=user, passwd=password)
    print("Login successful!")

    # 3. Download the file
    print(f"Downloading {remote_filename}...")
    with open(local_filename, 'wb') as fp:
        ftp.retrbinary(f'RETR {remote_filename}', fp.write)
    
    ftp.quit()
    print(f"Done! {local_filename} has been updated.")

except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1) # This tells GitHub Actions that the script failed
