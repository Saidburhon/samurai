// Sends www.<domain> to https://<bare domain> in one hop, keeping path and query.
// Attach more www hostnames in wrangler.json to reuse it for other sites.
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.hostname = url.hostname.replace(/^www\./, '');
    // one hop to the canonical form: http://www.qilich.com/x goes straight to https://qilich.com/x
    url.protocol = 'https:';
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
};
