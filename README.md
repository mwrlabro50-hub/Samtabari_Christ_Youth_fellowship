Song Sheet Book
A mobile-friendly church song book. One file (index.html), no build step.
Browse, filter by category, and search songs (title or lyrics)
Admin tab (login required): add, edit, delete and reorder songs, change church info
Edit church name, edition, home verse, About text and lyrics text size in Settings
Export / import all songs as songs.json (backup or move to another phone)
Changes are saved in the browser (localStorage)
Lyrics format
Start each part with a line ending in a colon:
Chorus:
first line
second line

Verse 1:
...
Publish on GitHub Pages
Create a new repository and upload index.html and README.md.
Go to Settings → Pages, choose branch main, folder / (root), and save.
Open https://YOUR-USERNAME.github.io/REPO-NAME/ on your phone.
To change the default songs for everyone, edit the DEF object near the top of the script in index.html.
Admin login
Open the Admin tab and log in. The user name and password are checked inside index.html (AU / AP, stored as hashes). This keeps casual users out, but it is not real security because the page runs entirely in the browser. Do not reuse this password elsewhere.
