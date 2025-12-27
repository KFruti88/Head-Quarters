import os
from ftplib import FTP
import sys

# These match the 'env:' section in your sync_data.yml
host = os.getenv('GPORTAL_IP')
user = os.getenv('GPORTAL_USER')
password = os.getenv('GPORTAL_PASS')

# !!! CHANGE THIS to the actual filename on your G-Portal server !!!
remote_filename = "data_vault.xml" 
local_filename = "live_vault.xml"

try:
    print(f"Connecting to {host}...")
    ftp = FTP(host)
    ftp.login(user=user, passwd=password)
    
    print(f"Downloading {remote_filename}...")
    with open(local_filename, 'wb') as fp:
        ftp.retrbinary(f'RETR {remote_filename}', fp.write)
    
    ftp.quit()
    print("Sync Successful!")

except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
