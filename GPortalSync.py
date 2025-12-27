import os
import time

# Define the two groups
CRITICAL_FILES = ['farms.xml', 'vehicles.xml', 'missions.xml', 'careerSavegame.xml']
HEAVY_FILES = ['items.xml', 'precisionFarming.xml', 'densityMapHeight.xml', 'sales.xml']

def sync_tier_1():
    # Code to download and push CRITICAL_FILES
    print("Syncing Tactical Data...")

def sync_tier_2():
    # Code to download and push HEAVY_FILES
    print("Syncing Environmental/Map Data...")

# Main Loop
count = 0
while True:
    sync_tier_1() # Always sync the small stuff
    
    # Only sync the heavy stuff every 6th cycle (approx 30 mins)
    if count % 6 == 0:
        sync_tier_2()
        
    count += 1
    time.sleep(300) # Wait 5 minutes
