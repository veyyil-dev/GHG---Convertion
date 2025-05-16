"use client"
import React, { createContext, useState, useContext } from 'react';
import {mockUsers} from "../data/mockUser"

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(mockUsers);

  const addUser = (userData) => {
    const newUser = {
      id: Math.random().toString(36).substring(2, 15),
      ...userData,
      createdAt: new Date(),
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const updateUser = (id, userData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              ...userData,
            }
          : user
      )
    );
  };

  const deleteUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const getUserById = (id) => {
    return users.find((user) => user.id === id);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
        getUserById,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
