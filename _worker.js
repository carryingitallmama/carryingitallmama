const RSS_URL = 'https://anchor.fm/s/110a832c8/podcast/rss';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only proxy the /rss path — everything else serves normally
    if (url.pathname === '/rss') {
      try {
        const response = await fetch(RSS_URL, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; CarryingItAllMama/1.0)',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
          }
        });

        if (!response.ok) {
          return new Response('Failed to fetch RSS feed', { status: 502 });
        }

        const xml = await response.text();

        return new Response(xml, {
          status: 200,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Cache-Control': 'public, max-age=3600'
          }
        });

      } catch (error) {
        return new Response('Error: ' + error.message, { status: 500 });
      }
    }

    // For everything else, serve the normal website
    return env.ASSETS.fetch(request);
  }
};
