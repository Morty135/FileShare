// Cloudflare Worker for FileShare proxy
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle health checks
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'OK', service: 'FileShare' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Forward all other requests to the backend
    const backendUrl = env.BACKEND_URL || 'http://localhost:3000';
    
    // Clone the request to modify headers if needed
    const clonedRequest = new Request(request, {
      headers: request.headers,
    });
    
    try {
      const response = await fetch(backendUrl + url.pathname + url.search, clonedRequest);
      
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return response;
    } catch (error) {
      console.error('Error forwarding request:', error);
      return new Response('Service Unavailable', { status: 503 });
    }
  }
};