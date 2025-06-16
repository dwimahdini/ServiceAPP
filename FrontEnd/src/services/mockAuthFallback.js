// Mock Authentication Fallback
// Digunakan jika backend belum ready

export const mockAuthFallback = {
  // Mock users database
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin12@gmail.com',
      password: 'admin123', // In real app, this would be hashed
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password',
      role: 'user',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ],

  // Mock login function
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockAuthFallback.users.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          // Remove password from response
          const { password, ...userWithoutPassword } = user;
          resolve({
            data: {
              msg: 'Login berhasil!',
              user: userWithoutPassword
            }
          });
        } else {
          reject({
            response: {
              data: {
                msg: 'Email atau password salah'
              }
            }
          });
        }
      }, 500); // Simulate network delay
    });
  },

  // Mock register function
  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists
        const existingUser = mockAuthFallback.users.find(u => u.email === userData.email);
        
        if (existingUser) {
          reject({
            response: {
              data: {
                msg: 'Email sudah terdaftar'
              }
            }
          });
        } else {
          // Add new user
          const newUser = {
            id: mockAuthFallback.users.length + 1,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          mockAuthFallback.users.push(newUser);
          
          resolve({
            data: {
              msg: 'Registrasi berhasil!'
            }
          });
        }
      }, 500);
    });
  },

  // Mock get users function
  getUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const usersWithoutPasswords = mockAuthFallback.users.map(({ password, ...user }) => user);
        resolve({
          data: usersWithoutPasswords
        });
      }, 300);
    });
  }
};

export default mockAuthFallback;
