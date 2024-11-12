async function handler(event) {
  const request = event.request;
  const headers = request.headers;

  // Get the Host header from the incoming request
  const hostHeader = headers.host.value;

  // Apex domain and www subdomain
  const apexDomain = 'ocoda.be';
  const wwwDomain = 'www.ocoda.be';

  // If the request is to the apex domain, redirect to the www domain
  if (hostHeader === apexDomain) {
    const redirectUrl = `https://${wwwDomain}${request.uri}`;

    // Return a 301 redirect response
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: redirectUrl },
        'cache-control': { value: 'max-age=86400' },
      },
    };
  }

  return request;
}
