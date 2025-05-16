'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import UserForm from "../../components/user/UserForm"
import { useUsers } from '../../context/UserContext';
import { Edit, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';

const EditUserPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { getUserById, updateUser } = useUsers();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const user = id ? getUserById(id) : undefined;

  useEffect(() => {
    if (id && !user) {
      setNotFound(true);
    }
  }, [id, user]);

  const handleSubmit = (data) => {
    if (!id) return;

    setIsSubmitting(true);

    setTimeout(() => {
      updateUser(id, data);
      setIsSubmitting(false);
      router.push('/users');
    }, 500);
  };

  if (notFound) {
    return (
      <div className="py-12 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm">
        <div className="bg-yellow-100 p-3 rounded-full mb-4">
          <AlertTriangle size={32} className="text-yellow-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">User Not Found</h2>
        <p className="text-gray-500 mb-6">The user you're trying to edit doesn't exist or has been deleted.</p>
        <Button onClick={() => router.push('/users')}>Return to User List</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="mr-4 p-2 bg-blue-100 rounded-lg">
          <Edit size={24} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit User</h1>
          <p className="text-sm text-gray-500">Update user information and access rights</p>
        </div>
      </div>

      {user && (
        <UserForm
          initialData={{
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            status: user.status,
            phone: user.phone,
          }}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default EditUserPage;
