import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Calendar, Building, Filter, FileText } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const statuses = [
  'applied',
  'pending_mentor_approval',
  'approved',
  'rejected',
  'interview_scheduled',
  'offered',
];

const AdminApplications = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ status: '', department: '', from: '', to: '' });

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/applications');
      setApplications(res.data.applications || []);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return (applications || []).filter(app => {
      if (filters.status && app.status !== filters.status) return false;
      if (filters.department && app.student?.department !== filters.department) return false;
      if (filters.from && new Date(app.appliedAt) < new Date(filters.from)) return false;
      if (filters.to && new Date(app.appliedAt) > new Date(filters.to)) return false;
      return true;
    });
  }, [applications, filters]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const departments = Array.from(new Set(applications.map(a => a.student?.department).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">All Applications</h1>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <select className="input-field" value={filters.status} onChange={(e)=>setFilters({...filters,status:e.target.value})}>
              <option value="">All</option>
              {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Department</label>
            <select className="input-field" value={filters.department} onChange={(e)=>setFilters({...filters,department:e.target.value})}>
              <option value="">All</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">From</label>
            <input type="date" className="input-field" value={filters.from} onChange={(e)=>setFilters({...filters,from:e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium">To</label>
            <input type="date" className="input-field" value={filters.to} onChange={(e)=>setFilters({...filters,to:e.target.value})} />
          </div>
        </div>
      </div>

      {/* Responsive list */}
      <div className="hidden md:block card p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-secondary-600">
              <th className="py-2">Student</th>
              <th className="py-2">Department</th>
              <th className="py-2">Internship</th>
              <th className="py-2">Company</th>
              <th className="py-2">Status</th>
              <th className="py-2">Applied</th>
              <th className="py-2">Resume</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr key={app.id} className="border-t border-secondary-200">
                <td className="py-2">{app.student?.name || '-'}</td>
                <td className="py-2">{app.student?.department || '-'}</td>
                <td className="py-2">{app.internship?.title || '-'}</td>
                <td className="py-2">{app.internship?.company || '-'}</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">
                    {app.status.replace(/_/g,' ')}
                  </span>
                </td>
                <td className="py-2">{new Date(app.appliedAt).toLocaleDateString()}</td>
                <td className="py-2">
                  {app.student?.resumeLink ? (
                    <a href={app.student.resumeLink} target="_blank" rel="noreferrer" className="btn-outline text-xs">View</a>
                  ) : '-' }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map(app => (
          <div key={app.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{app.student?.name || '-'}</div>
              <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">
                {app.status.replace(/_/g,' ')}
              </span>
            </div>
            <p className="text-sm text-secondary-600 mt-1">{app.student?.department || '-'}</p>
            <p className="text-sm text-secondary-600 flex items-center mt-1"><Building className="h-4 w-4 mr-1"/>{app.internship?.title} • {app.internship?.company}</p>
            <p className="text-xs text-secondary-500 flex items-center mt-1"><Calendar className="h-3 w-3 mr-1"/>Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
            {app.student?.resumeLink && (
              <a href={app.student.resumeLink} target="_blank" rel="noreferrer" className="btn-outline mt-3 text-xs">View Resume</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminApplications;
