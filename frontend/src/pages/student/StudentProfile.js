import React from 'react';
import { useAuth } from '../../context/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-8">My Profile</h1>
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-secondary-700">Name</label>
            <p className="text-secondary-900">{user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-secondary-700">Email</label>
            <p className="text-secondary-900">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-secondary-700">Department</label>
            <p className="text-secondary-900">{user.department}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-secondary-700">CGPA</label>
            <p className="text-secondary-900">{user.cgpa}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;