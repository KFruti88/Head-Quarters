import os
import requests # or whichever library you use for the sync

# Access the secrets you defined in the YAML
ip = os.getenv('GPORTAL_IP')
username = os.getenv('GPORTAL_USER')
password = os.getenv('GPORTAL_PASS')

def sync_data():
    print(f"Connecting to {ip}...")
    # Your logic to fetch data and save to live_vault.xml goes here
    # Example:
    # with open("live_vault.xml", "w") as f:
    #     f.write("<data>...</data>")

if __name__ == "__main__":
    sync_data()
