// Generate a random id
const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  // Generate a random date in the past year
  const generateDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    return date;
  };
  
  // Mock user data
  export const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      department: 'Information Technology',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      phone: '+1 (555) 123-4567',
      createdAt: generateDate(),
    },
    {
      id: generateId(),
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'data_entry',
      department: 'Finance',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      phone: '+1 (555) 987-6543',
      createdAt: generateDate(),
    },
    {
      id: generateId(),
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      role: 'data_entry',
      department: 'Human Resources',
      status: 'inactive',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      phone: '+1 (555) 555-5555',
      createdAt: generateDate(),
    },
    {
      id: generateId(),
      name: 'Emily Williams',
      email: 'emily.williams@example.com',
      role: 'viewer',
      department: 'Marketing',
      status: 'pending',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: generateDate(),
    },
    {
      id: generateId(),
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      role: 'data_entry',
      department: 'Operations',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      phone: '+1 (555) 777-8888',
      createdAt: generateDate(),
    },
  ];
  