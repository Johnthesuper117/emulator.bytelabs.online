import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="panel empty-state">
        <h1>Game not found</h1>
        <p>The selected game is not in your current catalog configuration.</p>
        <Link href="/" className="back-link">
          Return home
        </Link>
      </section>
    </main>
  );
}
