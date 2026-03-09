import Link from 'next/link';
import { notFound } from 'next/navigation';
import EmulatorPlayer from '../../../components/EmulatorPlayer';
import { getGameBySlug } from '../../../lib/games';

export default function PlayPage({ params }) {
  const game = getGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="panel">
        <div className="panel-head">
          <h1>{game.title}</h1>
          <span>{game.platform}</span>
        </div>
        <p className="lead">{game.description}</p>
        <p className="meta">Core: {game.core}</p>
        <EmulatorPlayer game={game.game} core={game.core} />
        <Link href="/" className="back-link">
          Back to catalog
        </Link>
      </section>
    </main>
  );
}
