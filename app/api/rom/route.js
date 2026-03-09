export const runtime = 'edge';

export async function GET(request) {
  // 1. Get the 'game' parameter from the URL (e.g., ?game=mario)
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game');

  if (!game) {
    return new Response('No game specified', { status: 400 });
  }

  // 2. Look up the secure link in your environment variables
  // If game is 'mario', this looks for process.env.ROM_MARIO
  const envKey = `ROM_${game.toUpperCase()}`;
  const shareUrl = process.env[envKey];

  if (!shareUrl) {
    return new Response('Game not found or secret missing', { status: 404 });
  }

  // 3. Encode the URL for the Microsoft Graph API bypass
  const encodedUrl = btoa(shareUrl)
    .replace(/\//g, '_')
    .replace(/\+/g, '-')
    .replace(/=+$/, '');

  const apiUrl = `https://api.onedrive.com/v1.0/shares/u!${encodedUrl}/root/content`;

  try {
    // 4. Fetch and stream the raw file
    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`OneDrive API returned status: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/octet-stream',
        'Content-Length': response.headers.get('content-length') || '',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error loading ROM stream', { status: 500 });
  }
}
