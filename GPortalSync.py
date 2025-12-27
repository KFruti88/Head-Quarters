# .github/workflows/sync_data.yml
name: 618 Tactical Cloud Sync

on:
  schedule:
    - cron: '*/10 * * * *'
  workflow_dispatch: 

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Run G-Portal Sync
        env:
          GPORTAL_IP: ${{ secrets.GPORTAL_IP }}
          GPORTAL_USER: ${{ secrets.GPORTAL_USER }}
          GPORTAL_PASS: ${{ secrets.GPORTAL_PASS }}
        run: python GPortalSync.py

      - name: Commit and Push Data
        run: |
          git config --global user.name "618-Tactical-Bot"
          git config --global user.email "bot@618crew.com"
          git add live_vault.xml
          git commit -m "Cloud Sync: Update Tactical Data" || exit 0
          git push
