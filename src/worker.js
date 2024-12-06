export default {
  async fetch(request, env, ctx) {
    try {
      // Option 1: Using static import (recommended for small, static files)
      const jsonData = await import('./data.json', { assert: { type: 'json' } });

      return new Response(JSON.stringify(jsonData.default), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Error reading JSON file:', error);

      return new Response(JSON.stringify({ 
        error: 'Failed to read JSON file',
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
};