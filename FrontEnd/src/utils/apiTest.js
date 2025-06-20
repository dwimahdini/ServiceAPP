// API testing utilities for system administration

/**
 * Test API connection to the backend server
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const testApiConnection = async () => {
  try {
    // Test multiple possible endpoints
    const endpoints = [
      'http://localhost:3001/health',
      'http://localhost:3001/',
      'http://localhost:3001'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          return {
            success: true,
            message: `API connection successful at ${endpoint}`
          };
        }
      } catch (err) {
        console.log(`Failed to connect to ${endpoint}:`, err.message);
      }
    }

    return {
      success: false,
      message: 'No backend server found on port 3001. Please start your backend server.'
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`
    };
  }
};

/**
 * Test admin login functionality
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const testAdminLogin = async () => {
  try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@futurex.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.token) {
      return {
        success: true,
        message: 'Admin login successful'
      };
    } else {
      return {
        success: false,
        message: data.msg || 'Admin login failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Login test failed: ${error.message}`
    };
  }
};

/**
 * Test database endpoints
 * @returns {Promise<Array<{name: string, success: boolean, message: string, count?: number, error?: string}>>}
 */
export const testDatabaseEndpoints = async () => {
  const endpoints = [
    { name: 'Psikologi', url: 'http://localhost:3001/dokter' },
    { name: 'Bengkel', url: 'http://localhost:3001/bengkel' },
    { name: 'Opo Wae', url: 'http://localhost:3001/getpilihlayanan' }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url);
      
      if (response.ok) {
        const data = await response.json();
        results.push({
          name: endpoint.name,
          success: true,
          message: `${endpoint.name} data retrieved successfully`,
          count: Array.isArray(data) ? data.length : 1
        });
      } else {
        results.push({
          name: endpoint.name,
          success: false,
          message: `Failed to retrieve ${endpoint.name} data`,
          error: `Status: ${response.status}`
        });
      }
    } catch (error) {
      results.push({
        name: endpoint.name,
        success: false,
        message: `Error accessing ${endpoint.name} endpoint`,
        error: error.message
      });
    }
  }

  return results;
};