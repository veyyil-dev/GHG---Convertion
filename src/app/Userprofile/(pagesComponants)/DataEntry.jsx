"use client"
import React, { useState } from 'react';
import { Layers, Plus, Check, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/input';

const DataEntry = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    value: '',
    date: '',
  });
  
  const [dataItems, setDataItems] = useState([
    {
      id: '1',
      name: 'Sales Report Q1',
      category: 'Finance',
      value: '$125,430',
      date: '2025-03-15',
      status: 'approved',
    },
    {
      id: '2',
      name: 'Marketing Campaign Results',
      category: 'Marketing',
      value: 'Conversion 12.5%',
      date: '2025-03-20',
      status: 'pending',
    },
    {
      id: '3',
      name: 'Customer Satisfaction Survey',
      category: 'Customer Support',
      value: '89/100',
      date: '2025-03-18',
      status: 'approved',
    },
    {
      id: '4',
      name: 'Employee Performance Review',
      category: 'Human Resources',
      value: 'Rating 4.2/5',
      date: '2025-03-22',
      status: 'rejected',
    },
  ]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newItem = {
        id: Math.random().toString(36).substring(2, 15),
        name: formData.name,
        category: formData.category,
        value: formData.value,
        date: formData.date,
        status: 'pending',
      };
      
      setDataItems((prev) => [newItem, ...prev]);
      setFormData({
        name: '',
        category: '',
        value: '',
        date: '',
      });
      setIsSubmitting(false);
      setIsFormVisible(false);
    }, 500);
  };
  
  const handleApprove = (id) => {
    setDataItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
  };
  
  const handleReject = (id) => {
    setDataItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
  };
  
  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="mr-4 p-2 bg-blue-100 rounded-lg">
          <Layers size={24} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Entry</h1>
          <p className="text-sm text-gray-500">Submit and manage data entries</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Data Entries</h2>
          
          <Button onClick={() => setIsFormVisible(!isFormVisible)}>
            {isFormVisible ? 'Cancel' : (
              <>
                <Plus size={18} className="mr-1" />
                New Entry
              </>
            )}
          </Button>
        </div>
        
        {isFormVisible && (
          <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-3">Add New Data Entry</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                
                <Input
                  label="Category"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
                
                <Input
                  label="Value"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                />
                
                <Input
                  label="Date"
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Submit Entry
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {item.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
