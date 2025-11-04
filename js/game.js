// Parse query parameters
function getQueryParams() {
    const q = {};
    location.search.replace(/^\?/, '').split('&').forEach(pair => {
        if (!pair) return;
        const [k, v] = pair.split('=');
        q[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return q;
}

async function loadGame() {
    const params = getQueryParams();
    const id = params.game || params.id;
    const root = document.getElementById('game-info');
    const controls = document.getElementById('game-controls');

    if (!id) {
        root.innerHTML = '<div class="line">No game specified. Go back to <a href="/">search</a>.</div>';
        return;
    }

    try {
        const res = await fetch('/data/games.json');
        const json = await res.json();
        // data/games.json has top-level { games: [...] }
        const list = Array.isArray(json) ? json : (json.games || []);
        const game = list.find(g => String(g.id) === String(id) || String(g.title).toLowerCase() === String(id).toLowerCase());

        if (!game) {
            root.innerHTML = '<div class="line">Game not found.</div>';
            return;
        }

        root.innerHTML = `
            <div class="title">${game.title} <span style="font-size:0.6em; opacity:0.7">(${game.platform} • ${game.year})</span></div>
            <div class="line">${game.description || ''}</div>
            <div class="line">Genre: ${game.genre || '—'}</div>
            <div class="line">Tags: ${(game.tags || []).join(', ')}</div>
        `;

        // Play button
        controls.innerHTML = '';
        const play = document.createElement('button');
        play.textContent = 'PLAY';
        play.onclick = () => {
            if (game.rom) {
                // Navigate to emulator page with rom and core
                const url = `emulator.html?rom=${encodeURIComponent(game.rom)}&core=${encodeURIComponent(game.core || '')}&title=${encodeURIComponent(game.title)}`;
                location.href = url;
            } else if (game.path) {
                // Local hosted page
                location.href = game.path;
            } else {
                alert('No playable file found for this game.');
            }
        };

        const back = document.createElement('button');
        back.textContent = 'BACK';
        back.onclick = () => location.href = '/';

        controls.appendChild(play);
        controls.appendChild(back);

    } catch (err) {
        root.innerHTML = '<div class="line">Error loading game data.</div>';
        console.error(err);
    }
}

window.addEventListener('load', loadGame);
