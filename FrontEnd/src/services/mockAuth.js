// Mock authentication service untuk testing
// Simulasi backend API responses

let mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password',
    role: 'user',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

// Counter for generating new user IDs
let nextUserId = 3;

const mockLayanan = [
  {
    id: 1,
    nama_layanan: 'Konsultasi Psikologi',
    userId: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    nama_layanan: 'Terapi Keluarga',
    userId: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

const mockBookings = [
  {
    id: 1,
    jam_booking: '10:00:00',
    userId: 2,
    layananId: 1,
    dokterpsikologId: 1,
    durasiId: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockAuthAPI = {
  login: async (credentials) => {
    await delay(1000); // Simulate network delay
    
    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return {
        data: {
          token: `mock-jwt-token-${user.id}`,
          user: userWithoutPassword
        }
      };
    } else {
      throw {
        response: {
          data: {
            message: 'Invalid email or password'
          }
        }
      };
    }
  },

  register: async (userData) => {
    console.log('Mock API register called with:', userData);

    try {
      await delay(1000); // Simulate network delay

      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        console.log('Email already exists:', userData.email);
        throw {
          response: {
            data: {
              message: 'Email already exists'
            }
          }
        };
      }

      // Create new user
      const newUser = {
        id: nextUserId++,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'user', // New users are always 'user' role
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to mock database
      mockUsers.push(newUser);
      console.log('New user created:', newUser);
      console.log('Total users now:', mockUsers.length);

      // Return success response (without password)
      const { password, ...userWithoutPassword } = newUser;
      const response = {
        data: {
          message: 'User registered successfully',
          user: userWithoutPassword
        }
      };

      console.log('Mock API returning:', response);
      return response;
    } catch (error) {
      console.error('Mock API register error:', error);
      throw error;
    }
  },

  getUsers: async () => {
    await delay(500);
    const usersWithoutPasswords = mockUsers.map(({ password, ...user }) => user);
    return { data: usersWithoutPasswords };
  }
};

export const mockLayananAPI = {
  getAll: async () => {
    await delay(500);
    return { data: mockLayanan };
  }
};

export const mockBookingAPI = {
  getAll: async () => {
    await delay(500);
    return { data: mockBookings };
  }
};

export const mockProdukAPI = {
  getAll: async () => {
    await delay(500);
    return { data: [] }; // Empty for demo
  }
};
