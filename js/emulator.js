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

// Launch using a URL (either uploaded blob URL or remote URL)
async function launchWithUrl(romUrl, core, title) {
    showMessage(`
        <div class="line">LOADING ${title ? title.toUpperCase() : romUrl}</div>
        <div class="line">CORE: ${core}</div>
        <div class="line">ROM: ${romUrl}</div>
        <div class="line" style="opacity:0.8; margin-top:12px;">Attempting to initialize EmulatorJS (if present)...</div>
    `);

    // Try to initialize EmulatorJS if it's included on the page
    try {
        if (window.EmulatorJS && typeof window.EmulatorJS.load === 'function') {
            // Known API surface is unclear across forks; attempt common method names safely
            window.EmulatorJS.load({ romUrl, core, mountPoint: '#emulator-root' });
            return;
        }

        if (window.EmulatorJS && typeof window.EmulatorJS.run === 'function') {
            window.EmulatorJS.run(romUrl, { core, mountPoint: '#emulator-root' });
            return;
        }
    } catch (err) {
        console.warn('EmulatorJS init attempted but failed', err);
    }

    // If EmulatorJS is not present or initialization failed, show instructions and a simple viewer link
    const info = document.getElementById('emulator-message');
    info.innerHTML = '';
    const warn = document.createElement('div');
    warn.className = 'line';
    warn.textContent = 'EmulatorJS not detected on this page.';
    info.appendChild(warn);

    const inst = document.createElement('div');
    inst.className = 'line';
    inst.innerHTML = 'To run in-browser, include the EmulatorJS bundle on this page (see project docs). Meanwhile, you can download/open the ROM manually:';
    info.appendChild(inst);

    const link = document.createElement('a');
    link.href = romUrl;
    link.textContent = 'Open ROM in new tab / download';
    link.style.color = '#33ff33';
    link.target = '_blank';
    const line = document.createElement('div');
    line.className = 'line';
    line.appendChild(link);
    info.appendChild(line);
}

// Wire up UI: file upload, URL box, core select
function initUi() {
    const fileInput = document.getElementById('rom-file');
    const urlInput = document.getElementById('rom-url');
    const coreSelect = document.getElementById('core-select');
    const launchBtn = document.getElementById('launch-btn');
    const backBtn = document.getElementById('back-btn');
    const romInfo = document.getElementById('rom-info');
    const dropzone = document.getElementById('dropzone');

    let uploadedBlobUrl = null;
    let uploadedFileName = null;

    fileInput.addEventListener('change', (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        if (uploadedBlobUrl) URL.revokeObjectURL(uploadedBlobUrl);
        uploadedBlobUrl = URL.createObjectURL(f);
        uploadedFileName = f.name;
        romInfo.textContent = `Selected file: ${f.name}`;
        // clear URL input when file selected
        urlInput.value = '';
    });

    // Dropzone drag & drop
    if (dropzone) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-over');
        });
        dropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
        });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
            const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
            if (!f) return;
            if (uploadedBlobUrl) URL.revokeObjectURL(uploadedBlobUrl);
            uploadedBlobUrl = URL.createObjectURL(f);
            uploadedFileName = f.name;
            romInfo.textContent = `Selected file: ${f.name}`;
            // clear URL input when file selected
            urlInput.value = '';
        });
    }

    urlInput.addEventListener('input', () => {
        // clear uploaded file when URL typed
        if (fileInput.value) {
            fileInput.value = '';
            if (uploadedBlobUrl) {
                URL.revokeObjectURL(uploadedBlobUrl);
                uploadedBlobUrl = null;
            }
            uploadedFileName = null;
            romInfo.textContent = '';
        }
    });

    // Persist & restore last selected core
    try {
        const last = localStorage.getItem('lastCore');
        if (last) coreSelect.value = last;
    } catch (e) {
        /* ignore */
    }
    coreSelect.addEventListener('change', () => {
        try { localStorage.setItem('lastCore', coreSelect.value); } catch (e) {}
    });

    launchBtn.addEventListener('click', async () => {
        const core = coreSelect.value;
        const url = urlInput.value.trim();

        if (uploadedBlobUrl) {
            await launchWithUrl(uploadedBlobUrl, core, uploadedFileName || 'Uploaded ROM');
            return;
        }

        if (url) {
            await launchWithUrl(url, core, url.split('/').pop() || 'ROM');
            return;
        }

        alert('Please select a ROM file or paste a ROM URL.');
    });

    backBtn.addEventListener('click', () => {
        location.href = '/';
    });
}

// On load: if query contains rom param, try to launch it; else initialize UI
window.addEventListener('load', () => {
    const params = parseQuery();
    if (params.rom) {
        const rom = params.rom;
        const core = params.core || document.getElementById('core-select')?.value || '';
        const title = params.title || '';
        launchWithUrl(rom, core, title);
    }
    initUi();
});
