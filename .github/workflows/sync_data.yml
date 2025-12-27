- name: Commit and Push Data
        run: |
          git config --global user.name "618-Tactical-Bot"
          git config --global user.email "bot@618crew.com"
          
          # Check if the file exists before trying to add it
          if [ -f "live_vault.xml" ]; then
            git add live_vault.xml
            git commit -m "Cloud Sync: Update Tactical Data" || echo "No changes to commit"
            git push
          else
            echo "Error: live_vault.xml not found! Skipping commit."
            exit 1
          fi
