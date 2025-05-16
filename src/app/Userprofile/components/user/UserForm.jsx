import React, { useState } from 'react';
import Input from '../ui/input';
import Select from '../ui/select';
import Button from '../ui/Button';

const UserForm = ({ initialData = {}, onSubmit, isLoading = false, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    role: initialData.role || 'data_entry',
    department: initialData.department || '',
    status: initialData.status || 'active',
    phone: initialData.phone || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const roleOptions = [
    { value: '', label: 'Select role', disabled: true },
    { value: 'admin', label: 'Administrator' },
    { value: 'data_entry', label: 'Data Entry' },
    { value: 'viewer', label: 'Viewer' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
  ];

  const departmentOptions = [
    { value: '', label: 'Select department', disabled: true },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Customer Support', label: 'Customer Support' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            error={errors.name}
            required
          />

          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            error={errors.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Department"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={departmentOptions}
            error={errors.department}
            required
          />

          <Input
            label="Phone Number"
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number (optional)"
            error={errors.phone}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Access & Status</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Role"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
            error={errors.role}
            required
          />

          <Select
            label="Status"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            error={errors.status}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => window.history.back())}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData.name ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
