import ftplib
import time
import os
import xml.etree.ElementTree as ET
from datetime import datetime

# ==========================================================
# 618 CREW TACTICAL SYNC - VERSION 5.0 (AUTO-SLOT DETECT)
# ==========================================================

FTP_HOST = os.getenv("GPORTAL_IP")
FTP_USER = os.getenv("GPORTAL_USER")
FTP_PASS = os.getenv("GPORTAL_PASS")

def create_dashboard_xml(active_slot):
    """Processes the raw XML files into the LiveVault format"""
    root = ET.Element("LiveVault")
    
    # Metadata
    meta = ET.SubElement(root, "Metadata")
    meta.set("timestamp", time.strftime('%Y-%m-%d %H:%M:%S'))
    meta.set("activeSlot", active_slot.upper())
    
    # 1. Money Data
    try:
        if os.path.exists("farms.xml"):
            tree = ET.parse("farms.xml")
            for farm in tree.getroot().findall('farm'):
                f_node = ET.SubElement(root, "Farm")
                f_node.set("id", farm.get("farmId"))
                f_node.set("money", farm.get("money"))
    except: pass

    # 2. Time Data
    try:
        if os.path.exists("careerSavegame.xml"):
            tree = ET.parse("careerSavegame.xml")
            env = tree.getroot().find("environment")
            if env is not None:
                e_node = ET.SubElement(root, "Environment")
                dt = float(env.get("dayTime") or 0)
                e_node.set("gameTime", f"{int(dt/3600000):02d}:{int((dt%3600000)/60000):02d}")
            
            # Server Info
            server_node = ET.SubElement(root, "Server")
            server_node.set("isOnline", "true")
            settings = tree.getroot().find("settings")
            if settings is not None:
                server_node.set("name", settings.find("savegameName").text if settings.find("savegameName") is not None else "618 Crew HQ")
    except: pass

    # 3. Fleet Data
    try:
        if os.path.exists("vehicles.xml"):
            tree = ET.parse("vehicles.xml")
            for v in tree.getroot().findall('vehicle'):
                v_node = ET.SubElement(root, "Unit")
                v_node.set("id", v.get("id"))
                v_node.set("farmId", v.get("farmId"))
                v_node.set("damage", v.get("damage") or "0")
                name = (v.get("filename") or "Gear").split("/")[-1].replace(".xml", "").upper()
                v_node.set("name", name)
    except: pass

    # 4. Fields Data
    try:
        if os.path.exists("careerSavegame.xml"):
            tree = ET.parse("careerSavegame.xml")
            for f in tree.getroot().findall(".//field"):
                f_node = ET.SubElement(root, "Field")
                f_node.set("id", f.get("id"))
                f_node.set("fruit", f.get("fruitTypeName") or "Empty")
                f_node.set("growth", f.get("growthState") or "0")
    except: pass

    tree = ET.ElementTree(root)
    tree.write("live_vault.xml")

def get_latest_savegame(ftp):
    """Scans slots 1-20 to find the most recently modified careerSavegame.xml"""
    latest_slot = "savegame1"
    latest_time = 0
    
    print("Scanning for active save game slot...")
    for i in range(1, 21):
        slot = f"savegame{i}"
        path = f"/{slot}/careerSavegame.xml"
        try:
            # MDTM gets the last modified time of the file
            mdtm_response = ftp.voidcmd(f"MDTM {path}")
            # Format is usually: 213 YYYYMMDDHHMMSS
            timestamp = mdtm_response.split()[1]
            dt = datetime.strptime(timestamp, "%Y%m%d%H%M%S")
            epoch = dt.timestamp()
            
            if epoch > latest_time:
                latest_time = epoch
                latest_slot = slot
            print(f"Found: {slot} (Modified: {dt})")
        except:
            continue
            
    print(f"AUTO-DETECTED ACTIVE SLOT: {latest_slot.upper()}")
    return latest_slot

def run_sync():
    if not FTP_HOST:
        print("CRITICAL ERROR: No GPORTAL_IP found!")
        return

    try:
        ftp = ftplib.FTP()
        ftp.connect(FTP_HOST, 21, timeout=30)
        ftp.login(FTP_USER, FTP_PASS)
        
        # Determine which slot to use
        active_slot = get_latest_savegame(ftp)
        
        # Download files from the detected slot
        for filename in ["farms.xml", "vehicles.xml", "careerSavegame.xml"]:
            path = f"/{active_slot}/{filename}"
            try:
                with open(filename, "wb") as f:
                    ftp.retrbinary(f"RETR {path}", f.write)
            except:
                print(f"Warning: {filename} not found in {active_slot}")
        
        ftp.quit()
        create_dashboard_xml(active_slot)
        print("Success: live_vault.xml generated for dashboard.")
        
    except Exception as e:
        print(f"SYNC FAILED: {e}")
        exit(1)

if __name__ == "__main__":
    run_sync()
