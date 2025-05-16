"use client"
import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import UserView from '../UserView';

export default function UserViewPage() {
  const { id } = useRouter().query;

  return (
    <Layout>
      <UserView id={1} />
    </Layout>
  );
}
