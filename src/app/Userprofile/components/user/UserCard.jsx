'use client';

import React from 'react';
import Link from 'next/link';
import { Edit, Trash2, Clock, Mail, Phone } from 'lucide-react';
import Button from '../ui/Button';

const UserCard = ({ user, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-800',
      data_entry: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      admin: 'Administrator',
      data_entry: 'Data Entry',
      viewer: 'Viewer',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.name} avatar`}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
              <div className="flex space-x-1">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </div>
            </div>
            <p className="text-sm text-gray-500">{user.department}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail size={16} className="mr-2 text-gray-400" />
            <span>{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone size={16} className="mr-2 text-gray-400" />
              <span>{user.phone}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-gray-400" />
            <span>Created on {formatDate(user.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link href={`/user/${user.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>

          <div className="flex space-x-2">
            <Link href={`Userprofile/edituser/${user.id}`}>
              <Button variant="secondary" size="sm">
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
            </Link>

            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(user.id)}
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
