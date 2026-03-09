'use client';

import { useEffect, useRef, useState } from 'react';

const LOADER_SRC = 'https://cdn.emulatorjs.org/stable/data/loader.js';

export default function EmulatorPlayer({ game = 'mario', core = 'nes' }) {
  const emulatorRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');

    // Just pass the query parameter. No secret links exposed to the browser.
    const romUrl = `/api/rom?game=${encodeURIComponent(game)}`;

    window.EJS_player = '#emulator-container';
    window.EJS_core = core;
    window.EJS_gameUrl = romUrl;
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';

    const script = document.createElement('script');
    script.src = LOADER_SRC;
    script.async = true;
    script.onerror = () => {
      setError('Failed to load Emulator.js assets.');
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
      const target = emulatorRef.current;
      if (target) {
        target.innerHTML = '';
      }

      delete window.EJS_player;
      delete window.EJS_gameUrl;
      delete window.EJS_core;
      delete window.EJS_pathtodata;
    };
  }, [core, game]);

  return (
    <section className="emulator-wrap">
      {error ? <p className="error-msg">{error}</p> : null}
      <div>
        <div
          id="emulator-container"
          ref={emulatorRef}
          className="emulator-target"
          style={{ width: '800px', height: '600px' }}
        />
      </div>
    </section>
  );
}
