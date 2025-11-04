# BYTELABS Arcade (Emulator Archive)

This is a small static site for listing and launching games (both built-in web games and ROMs via EmulatorJS).

Features
- Searchable game archive (fuzzy search by title and tags)
- Built-in browser games (Snake, Tetris, Breakout, Dungeon Quest, Memory Match)
- Per-game pages and an emulator launcher for ROMs
- Drag-and-drop and file upload support for ROMs
- Persist last selected console/core in localStorage

How to run locally

1. Start a static server from the project root:

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

How to use
- Search: Use the search box on the homepage to find games by name or tag (e.g., "mario", "pokemon", "snake").
- Built-in games: Matching built-in games (tagged `built-in`) will run in the terminal area directly.
- ROM games: Selecting a ROM-backed entry will open a per-game page; click PLAY to open the emulator launcher.
- Emulator launcher: On `emulator.html` you can
  - Select the console/core (last selected core is saved in localStorage)
  - Paste a ROM URL
  - Or drag-and-drop / upload a ROM file
  - Click Launch to attempt to run the ROM. If EmulatorJS is included on the page, the launcher will try to initialize it; otherwise a download/open link is shown.

Notes
- This is a static demo. Uploaded ROMs are handled in-browser via blob URLs (they are not uploaded to the server).
- To run ROMs directly in-browser, include an EmulatorJS bundle/script on `emulator.html` and ensure its public API matches the simple calls attempted in `js/emulator.js`.

If you want, I can integrate a specific EmulatorJS build (provide a CDN/script URL) and wire the exact loading API so pasted/uploaded ROMs run in-page.
# emulator.bytelabs.online

🎮 Architecture Overview
Frontend Stack:

Pure HTML5, CSS3, and Vanilla JavaScript (no frameworks for authentic lightweight feel)
EmulatorJS library integration
JSON-based game database
Fuse.js for fuzzy search capabilities

🖥️ Core Components
1. Terminal Interface

Authentic CRT monitor aesthetic (green phosphor glow, scanlines, text shadow)
Animated typing effects for system messages
ASCII art branding/logo
Blinking cursor prompt
Terminal-style command history

2. Search System

Real-time fuzzy search with Fuse.js
Search across multiple fields (title, platform, genre, tags)
Formatted results display with metadata preview
Keyboard navigation support (arrow keys, enter to select)

3. Game Database Structure
Game metadata (title, platform, year, genre, description)
Technical data (ROM path, core type, controls)
Media assets (cover art, screenshots)
Search optimization (tags, alternate titles)
Save state configuration


4. Emulator Integration
EmulatorJS wrapper with terminal-themed controls
Smooth transition from search to gameplay
Back navigation to search interface
Game state management

5. User Flow 


```
Boot Screen → Search Terminal → Results Display → Game Launch → Emulator View  
                ↑                                                   ↓  
                └──────────────── Exit Game ────────────────────────┘  
```


🎨 Visual Design Elements
Phosphor green (#33FF33) text on deep black background
CRT scanline overlay effect
Monospace font (VT323 or Courier New)
Screen curvature and glow effects
Retro loading animations
ASCII art dividers and borders

```
📁 File Structure
/retro-arcade/
├── index.html
├── css/
│   └── terminal.css
├── js/
│   ├── search.js
│   ├── emulator.js
│   └── database.js
├── data/
│   └── games.json
├── roms/
│   └── (game files)
└── assets/
    └── covers/
```

🔧 Key Features

Responsive design (maintains aesthetic on mobile)
Local storage for recent searches
Error handling with terminal-style messages
Loading states with retro animations
Comprehensive inline documentation
