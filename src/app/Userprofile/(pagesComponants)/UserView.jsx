"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useUsers } from "../context/UserContext";
import { AlertTriangle, Edit, Trash2, ArrowLeft, Mail, Phone, Calendar, Briefcase, Shield, CheckCircle as CircleCheck } from "lucide-react";
import Button from "../components/ui/Button";

const UserView = () => {
  const params = useParams();
  const { id } = params;
  const { getUserById, deleteUser } = useUsers();
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      const foundUser = getUserById(id);
      if (foundUser) {
        setUser(foundUser);
      } else {
        setNotFound(true);
      }
    }
  }, [id, getUserById]);

  const handleDelete = () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
      router.push("/");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (notFound) {
    return (
      <div className="py-12 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm">
        <div className="bg-yellow-100 p-3 rounded-full mb-4">
          <AlertTriangle size={32} className="text-yellow-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">User Not Found</h2>
        <p className="text-gray-500 mb-6">The user you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => router.push("/")}>Return to User List</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-2">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-1" />
            Back to Users
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 flex items-end p-6">
          <div className="flex items-end">
            <div className="relative">
              {user.avatar ? (
                <img src={user.avatar} alt={`${user.name} avatar`} className="w-24 h-24 rounded-full border-4 border-white object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-3xl border-4 border-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
                user.status === "active" ? "bg-green-500" :
                user.status === "inactive" ? "bg-red-500" : "bg-yellow-500"
              }`}></div>
            </div>
            <div className="ml-4 pb-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-blue-100">{user.department}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap justify-between">
            <div className="mb-6 w-full md:w-1/2 lg:w-1/3 pr-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-700">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-700">{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6 w-full md:w-1/2 lg:w-1/3 pr-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Account Details</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Shield size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin" ? "bg-purple-100 text-purple-800" :
                      user.role === "data_entry" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role === "admin" ? "Administrator" :
                       user.role === "data_entry" ? "Data Entry" : "Viewer"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <CircleCheck size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "active" ? "bg-green-100 text-green-800" :
                      user.status === "inactive" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Briefcase size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-700">{user.department}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Account Created</p>
                    <p className="text-gray-700">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="danger" onClick={handleDelete}>
          <Trash2 size={18} className="mr-1" />
          Delete User
        </Button>
        <Link href={`/Userprofile/edituser/${user.id}`}>
          <Button>
            <Edit size={18} className="mr-1" />
            Edit User
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserView;