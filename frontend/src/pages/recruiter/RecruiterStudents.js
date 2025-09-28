import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, GraduationCap } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const RecruiterStudents = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ department: '', cgpa: '', skills: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/students');
      setStudents(res.data.students || []);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    const params = new URLSearchParams();
    if (filters.department) params.append('department', filters.department);
    if (filters.cgpa) params.append('cgpa', filters.cgpa);
    if (filters.skills) params.append('skills', filters.skills);
    const url = params.toString() ? `/students?${params.toString()}` : '/students';
    try {
      setLoading(true);
      const res = await axios.get(url);
      setStudents(res.data.students || []);
    } finally {
      setLoading(false);
    }
  };

  const departments = Array.from(new Set(students.map(s => s.department).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">Students</h1>
      </div>

      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Department</label>
            <select className="input-field" value={filters.department} onChange={(e)=>setFilters({...filters,department:e.target.value})}>
              <option value="">All</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Min CGPA</label>
            <input type="number" step="0.1" className="input-field" value={filters.cgpa} onChange={(e)=>setFilters({...filters,cgpa:e.target.value})} />
          </div>
          <div className="lg:col-span-2">
            <label className="text-sm font-medium">Skills (comma separated)</label>
            <input className="input-field" placeholder="e.g. React, Node.js" value={filters.skills} onChange={(e)=>setFilters({...filters,skills:e.target.value})} />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={applyFilters} className="btn-primary">Apply Filters</button>
          <button onClick={()=>{setFilters({department:'',cgpa:'',skills:''}); fetchStudents();}} className="btn-secondary">Reset</button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center"><LoadingSpinner size="large" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(s => (
            <div key={s.id} className="card p-4">
              <div className="flex items-center gap-3">
                {s.profilePicture ? (
                  <img src={s.profilePicture} alt={s.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                    {s.name?.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-secondary-900 truncate">{s.name}</h3>
                  <p className="text-sm text-secondary-600">{s.department} • CGPA {s.cgpa}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {(s.skills || []).slice(0,5).map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-secondary-100 text-secondary-700 rounded-full text-xs">{skill}</span>
                ))}
              </div>
              {s.resumeLink && (
                <a href={s.resumeLink} target="_blank" rel="noreferrer" className="btn-outline mt-3 text-sm">View Resume</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterStudents;