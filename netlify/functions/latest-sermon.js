const CHANNEL_ID = 'UCfJgOi8yjg6K2oa-BB416hg';

exports.handler = async function () {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
    );
    if (!res.ok) throw new Error(`YouTube RSS returned ${res.status}`);

    const xml = await res.text();

    // Extract the first video ID from the feed
    const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    if (!match) throw new Error('No video ID found in RSS feed');

    const videoId = match[1].trim();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
