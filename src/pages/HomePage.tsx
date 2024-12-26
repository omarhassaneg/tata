import React from 'react';
import { Calendar } from '../components/home/Calendar';
import { Sidebar } from '../components/home/Sidebar';
import { Header } from '../components/home/Header';

export default function HomePage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden pl-16">
        <Header />
        <main className="flex-1 overflow-x-auto">
          <Calendar />
        </main>
      </div>
    </div>
  );
}