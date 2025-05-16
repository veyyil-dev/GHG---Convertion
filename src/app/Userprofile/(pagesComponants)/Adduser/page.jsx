"use client"

import React, { useState } from 'react';

import UserForm from '../../components/user/UserForm';
import { useUsers } from '../../context/UserContext';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AddUser = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addUser } = useUsers();
  const router = useRouter();

  const handleSubmit = (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addUser(data);
      setIsSubmitting(false);
      router.push('/');
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="mr-4 p-2 bg-blue-100 rounded-lg">
          <UserPlus size={24} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add New User</h1>
          <p className="text-sm text-gray-500">Create a new user account in the system</p>
        </div>
      </div>
      
      <UserForm 
        onSubmit={handleSubmit} 
        isLoading={isSubmitting} 
      />
    </div>
  );
};

export default AddUser;
