import time

# TIMING CONFIG (In Seconds)
SMALL_INTERVAL = 7 * 60  # 420 seconds
LARGE_INTERVAL = 30 * 60 # 1800 seconds

# FILE GROUPS
SMALL_FILES = ['farms.xml', 'vehicles.xml', 'missions.xml', 'careerSavegame.xml', 'collectibles.xml']
LARGE_FILES = ['items.xml', 'densityMapHeight.xml', 'precisionFarming.xml', 'growthState.xml']

last_small_sync = 0
last_large_sync = 0

while True:
    current_time = time.time()

    # TRACK 1: SMALL FILES (Every 7 Mins)
    if current_time - last_small_sync >= SMALL_INTERVAL:
        print("--- STARTING SMALL TACTICAL SYNC (7 MIN) ---")
        # [Download logic for SMALL_FILES goes here]
        # [GitHub Push logic goes here]
        last_small_sync = current_time

    # TRACK 2: LARGE FILES (Every 30 Mins)
    if current_time - last_large_sync >= LARGE_INTERVAL:
        print("--- STARTING HEAVY DATA SYNC (30 MIN) ---")
        # [Download logic for LARGE_FILES goes here]
        # [GitHub Push logic goes here]
        last_large_sync = current_time

    # Wait 30 seconds before checking the clock again to save CPU
    time.sleep(30)
