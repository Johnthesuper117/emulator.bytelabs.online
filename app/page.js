import Link from 'next/link';
import { games } from '../lib/games';

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">BYTELABS EMULATOR VAULT</p>
        <h1>One place to launch your ROM library</h1>
        <p className="lead">
          This site now runs on Next.js App Router with Emulator.js support. Add your game
          metadata in <code>lib/games.js</code> and set secure ROM links in environment
          variables.
        </p>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Game Catalog</h2>
          <span>{games.length} configured</span>
        </div>

        {games.length === 0 ? (
          <div className="empty-state">
            <h3>No games configured yet</h3>
            <p>
              Existing games were removed. Add new entries in <code> lib/games.js</code> and
              configure matching environment variables such as <code>ROM_MARIO</code>.
            </p>
          </div>
        ) : (
          <div className="card-grid">
            {games.map((game) => (
              <article key={game.slug} className="card">
                <p className="platform">{game.platform}</p>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <Link href={`/play/${game.slug}`} className="play-link">
                  Launch
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
