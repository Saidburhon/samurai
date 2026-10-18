// Sends www.<domain> to the bare domain, keeping path and query.
// Attach more www hostnames in wrangler.json to reuse it for other sites.
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.hostname = url.hostname.replace(/^www\./, '');
    return Response.redirect(url.toString(), 301);
  }
};
