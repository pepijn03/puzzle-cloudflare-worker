export default {
  async fetch(request, env, ctx) {
    try {
      // Parse URL parameters from the incoming request
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '10', 10);

      // Fetch data from the microservice
      const microserviceResponse = await fetch(env.MICROSERVICE_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      // Check if the response is successful
      if (!microserviceResponse.ok) {
        throw new Error(`Microservice returned ${microserviceResponse.status}`);
      }

      // Parse the JSON response
      const rawData = await microserviceResponse.json();

      // Sort the records by time (assuming each record has a 'time' property)
      const sortedRecords = rawData.sort((a, b) => a.timespan - b.timespan);

      // Limit the number of records
      const limitedRecords = sortedRecords.slice(0, limit);

      // Return the processed data
      return new Response(JSON.stringify(limitedRecords), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Error processing microservice data:', error);

      return new Response(JSON.stringify({ 
        error: 'Failed to process microservice data',
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