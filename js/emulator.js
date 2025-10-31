// Load game data directly from embedded JSON
const gamesDatabase = JSON.parse(document.getElementById('games').textContent);

// Initialize Fuse.js with search configuration
// This allows fuzzy searching across multiple game properties
const fuse = new Fuse(gamesDatabase, {
    keys: ['title', 'platform', 'genre', 'tags', 'description'],
    threshold: 0.3, // How fuzzy the search should be (0 = exact, 1 = very fuzzy)
    includeScore: true
});

// Get references to important DOM elements
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const emulatorContainer = document.getElementById('emulator-container');

// Track which result is currently selected (for keyboard navigation)
let selectedIndex = -1;
let currentResults = [];

// Event listener for typing in the search box
searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    
    // Clear results if search is empty
    if (query === '') {
        resultsContainer.innerHTML = '';
        currentResults = [];
        selectedIndex = -1;
        return;
    }

    // Perform fuzzy search using Fuse.js
    const results = fuse.search(query);
    currentResults = results;
    selectedIndex = -1;
    
    // Display the search results
    displayResults(results);
});

// Function to display search results in the terminal
function displayResults(results) {
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Show message if no results found
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="terminal-line error">NO GAMES FOUND</div>';
        return;
    }

    // Show header with result count
    resultsContainer.innerHTML = `<div class="terminal-line">FOUND ${results.length} GAME(S):</div>`;
    resultsContainer.innerHTML += '<div class="terminal-line">═══════════════════════════════════════════════════</div>';
    
    // Create a div for each game result
    results.forEach((result, index) => {
        const game = result.item;
        const gameDiv = document.createElement('div');
        gameDiv.className = 'game-item';
        gameDiv.dataset.index = index;
        
        // Build the HTML for this game result
        gameDiv.innerHTML = `
            <div class="game-title">[${index + 1}] ${game.title}</div>
            <div class="game-meta">${game.platform} | ${game.year} | ${game.genre}</div>
            <div class="game-description">${game.description}</div>
        `;
        
        // Add click handler to launch game
        gameDiv.addEventListener('click', () => launchGame(game));
        
        resultsContainer.appendChild(gameDiv);
    });
}

// Keyboard navigation for search results
searchInput.addEventListener('keydown', function(e) {
    const items = document.querySelectorAll('.game-item');
    
    // Arrow Down - move selection down
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectedIndex < currentResults.length - 1) {
            selectedIndex++;
            updateSelection(items);
        }
    } 
    // Arrow Up - move selection up
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedIndex > 0) {
            selectedIndex--;
            updateSelection(items);
        }
    } 
    // Enter - launch the selected game
    else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const game = currentResults[selectedIndex].item;
        launchGame(game);
    }
});

// Update visual selection when navigating with keyboard
function updateSelection(items) {
    // Remove selection from all items
    items.forEach(item => item.classList.remove('selected'));
    
    // Add selection to current item and scroll it into view
    if (selectedIndex >= 0 && selectedIndex < items.length) {
        items[selectedIndex].classList.add('selected');
        items[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Function to launch a game in the emulator
function launchGame(game) {
    // Show loading message
    const emulatorFrame = document.getElementById('emulator-frame');
    emulatorFrame.innerHTML = `
        <div class="loading">
            <div class="terminal-line">LOADING ${game.title.toUpperCase()}<span class="loading-dots"></span></div>
            <div class="terminal-line">INITIALIZING ${game.core.toUpperCase()} CORE<span class="loading-dots"></span></div>
        </div>
    `;
    
    // Show the emulator container
    emulatorContainer.style.display = 'block';
    
    // Simulate loading delay (in production, this would initialize EmulatorJS)
    setTimeout(() => {
        emulatorFrame.innerHTML = `
            <div class="loading">
                <div class="terminal-line">${game.title.toUpperCase()} READY</div>
                <div class="terminal-line">═══════════════════════════════════════════════════</div>
                <div class="terminal-line" style="margin-top: 20px;">EMULATOR WOULD LOAD HERE</div>
                <div class="terminal-line">ROM: ${game.rom}</div>
                <div class="terminal-line">CORE: ${game.core}</div>
                <div class="terminal-line" style="margin-top: 20px; opacity: 0.7;">
                    In production, EmulatorJS would be initialized here with the game ROM.
                </div>
            </div>
        `;
        
        // Save to recent searches in localStorage
        saveRecentSearch(game);
    }, 1500);
}

// Function to exit emulator and return to search
function exitEmulator() {
    emulatorContainer.style.display = 'none';
    searchInput.focus();
}

// Save game to recent searches (persists across sessions)
function saveRecentSearch(game) {
    try {
        // Get existing recent searches from localStorage
        let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        
        // Remove if already exists (to avoid duplicates)
        recent = recent.filter(g => g.id !== game.id);
        
        // Add to beginning of array
        recent.unshift(game);
        
        // Keep only last 5 searches
        recent = recent.slice(0, 5);
        
        // Save back to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(recent));
    } catch (error) {
        console.error('Error saving recent search:', error);
    }
}

// Auto-focus search input when page loads
window.addEventListener('load', () => {
    searchInput.focus();
});

// Prevent losing focus from search input
document.addEventListener('click', (e) => {
    if (!emulatorContainer.style.display || emulatorContainer.style.display === 'none') {
        if (e.target !== searchInput) {
            searchInput.focus();
        }
    }
});