// Simple emulator page handler - parses rom/core from query and displays status.
function parseQuery() {
    const q = {};
    location.search.replace(/^\?/, '').split('&').forEach(pair => {
        if (!pair) return;
        const [k, v] = pair.split('=');
        q[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return q;
}

function showMessage(html) {
    const root = document.getElementById('emulator-root');
    root.innerHTML = html;
}

async function init() {
    const params = parseQuery();
    const rom = params.rom;
    const core = params.core || '';
    const title = params.title || '';

    if (!rom) {
        showMessage('<div class="line">No ROM specified. Go back to <a href="/">search</a>.</div>');
        return;
    }

    // Show placeholder loading information
    showMessage(`
        <div class="line">LOADING ${title ? title.toUpperCase() : rom}</div>
        <div class="line">CORE: ${core}</div>
        <div class="line">ROM: ${rom}</div>
        <div class="line" style="opacity:0.8; margin-top:12px;">If EmulatorJS is available, initialize it here with the ROM URL.</div>
    `);

    // OPTIONAL: If you include EmulatorJS on the page (script tag), initialize it here.
    // Example (pseudocode):
    // if (window.EmulatorJS) { EmulatorJS.load({ romUrl: rom, core: core, mountPoint: '#emulator-root' }) }

    try {
        // Try to fetch the ROM to check availability (not required, optional check)
        const res = await fetch('/' + rom, { method: 'HEAD' });
        if (!res.ok) {
            const msg = document.createElement('div');
            msg.className = 'line';
            msg.textContent = 'Warning: ROM file not found on server (HTTP ' + res.status + ').';
            document.getElementById('emulator-message').appendChild(msg);
        }
    } catch (err) {
        console.warn('ROM check failed', err);
    }
}

window.addEventListener('load', init);
