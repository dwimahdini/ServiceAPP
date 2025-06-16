// Simple mock API for testing
let users = [
  { id: 1, name: 'Admin', email: 'admin@example.com', password: 'password', role: 'admin' },
  { id: 2, name: 'User', email: 'user@example.com', password: 'password', role: 'user' }
];

let nextId = 3;

export const simpleMockAPI = {
  register: async (userData) => {
    console.log('Simple mock register called:', userData);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email exists
    const exists = users.find(u => u.email === userData.email);
    if (exists) {
      throw { response: { data: { message: 'Email already exists' } } };
    }
    
    // Create user
    const newUser = {
      id: nextId++,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user'
    };
    
    users.push(newUser);
    console.log('User created:', newUser);
    
    return {
      data: {
        message: 'Success',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      }
    };
  },
  
  login: async (credentials) => {
    console.log('Simple mock login called:', credentials);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (!user) {
      throw { response: { data: { message: 'Invalid credentials' } } };
    }
    
    return {
      data: {
        token: `token-${user.id}`,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    };
  }
};
