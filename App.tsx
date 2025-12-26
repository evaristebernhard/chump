import React, { useState, useEffect, useMemo } from 'react';
import { Student, AuthLevel, GroupedDestination } from './types';
import { ADMIN_EMAIL } from './constants';
import * as storageService from './services/storageService';
import AuthGuard from './components/AuthGuard';
import DestinationCard from './components/DestinationCard';
import DataForm from './components/DataForm';
import AdminPanel from './components/AdminPanel';
import AiAdvisor from './components/AiAdvisor';

// Safe ID generator that works in all contexts (including non-secure http)
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const App: React.FC = () => {
  // --- State ---
  const [authLevel, setAuthLevel] = useState<AuthLevel>(AuthLevel.NONE);
  const [students, setStudents] = useState<Student[]>([]);
  const [view, setView] = useState<'map' | 'add' | 'advisor'>('map');
  const [selectedGroup, setSelectedGroup] = useState<GroupedDestination | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Helpers ---
  const refreshData = async () => {
    setIsLoading(true);
    const data = await storageService.getStudents();
    setStudents(data);
    setIsLoading(false);
  };

  // --- Effects ---
  useEffect(() => {
    // Load data only after authentication
    if (authLevel !== AuthLevel.NONE) {
      refreshData();
    }
  }, [authLevel]);

  // --- Logic ---
  const groupedData = useMemo(() => {
    const map = new Map<string, Student[]>();
    students.forEach(s => {
      // Filter out empty or "待定" destinations
      if (!s.destination || s.destination.includes('待定')) return;

      const key = s.destination;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });

    const groups: GroupedDestination[] = [];
    map.forEach((list, dest) => {
      groups.push({ destination: dest, count: list.length, students: list });
    });
    // Sort by count descending
    return groups.sort((a, b) => b.count - a.count);
  }, [students]);

  const handleAddStudent = async (data: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...data,
      id: generateId(), // We still generate ID client side, or we could let DB do it
      createdAt: Date.now()
    };
    await storageService.saveStudent(newStudent);
    await refreshData();
    setView('map');
  };

  const handleDeleteStudent = async (id: string) => {
    await storageService.deleteStudent(id);
    await refreshData();
  };

  const handleResetData = async () => {
    if (window.confirm("WARNING: This will delete ALL data in the SHARED database and reset to the seed data. This affects ALL users. Are you sure?")) {
      await storageService.resetStudents();
      await refreshData();
    }
  };

  // --- Render ---
  if (authLevel === AuthLevel.NONE) {
    return <AuthGuard onAuth={setAuthLevel} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="text-xl font-bold leading-none">保研地图 (GradMap)</h1>
              <p className="text-xs text-slate-400">数学与信息科学学院</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <button 
              onClick={() => { setView('map'); refreshData(); }}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${view === 'map' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              地图 (Map)
            </button>
            <button 
              onClick={() => setView('add')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${view === 'add' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              添加 (Add)
            </button>
             <button 
              onClick={() => setView('advisor')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${view === 'advisor' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:text-white'}`}
            >
              AI 助手
            </button>
            {authLevel === AuthLevel.ADMIN && (
              <button 
                onClick={() => setShowAdminPanel(true)}
                className="px-3 py-1 rounded-md text-sm bg-red-900 text-red-100 hover:bg-red-800"
              >
                Admin
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {view === 'map' && (
              <>
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">去向分布 (Destinations)</h2>
                    <p className="text-slate-500 text-sm">点击卡片查看详细名单 (Click cards to see details)</p>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                     数据更新至 2030届<br/>
                     Need help? <a href={`mailto:${ADMIN_EMAIL}`} className="text-indigo-500 hover:underline">Contact Admin</a>
                  </div>
                </div>

                {groupedData.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-min">
                    {groupedData.map((group) => (
                      <DestinationCard 
                        key={group.destination} 
                        group={group} 
                        onClick={setSelectedGroup} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <span className="text-4xl block mb-2">📭</span>
                    <p className="text-slate-500 font-medium">暂无数据 (No Data Yet)</p>
                    <p className="text-slate-400 text-sm mt-1">
                      数据库中没有有效数据。<br/>
                      请点击"添加"按钮录入新的去向信息。
                    </p>
                    <button 
                       onClick={() => setView('add')}
                       className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                    >
                      去添加 (Add Now)
                    </button>
                  </div>
                )}
              </>
            )}

            {view === 'add' && (
              <DataForm onSubmit={handleAddStudent} onCancel={() => setView('map')} />
            )}

            {view === 'advisor' && (
                <div className="max-w-2xl mx-auto">
                    <AiAdvisor />
                </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 py-6 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Math & Info Sci GradMap. 
          <span className="ml-2 block sm:inline">Protected Community Data.</span>
        </div>
      </footer>

      {/* Modals */}
      
      {/* Group Detail Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedGroup(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50 rounded-t-xl">
              <h3 className="text-xl font-bold text-indigo-900">{selectedGroup.destination}</h3>
              <button onClick={() => setSelectedGroup(null)} className="text-indigo-400 hover:text-indigo-700 font-bold text-xl">&times;</button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              {selectedGroup.students.map(student => (
                <div key={student.id} className="flex justify-between items-start border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-slate-800">
                      {student.isAnonymous ? '某同学 (Anonymous)' : student.name}
                      <span className="ml-2 text-xs font-normal text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">{student.major}</span>
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {student.year}届 · {student.type}
                    </p>
                  </div>
                  {!student.isAnonymous && student.contact && (
                    <div className="text-right">
                       <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                         {student.contact}
                       </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel 
          students={students} 
          onDelete={handleDeleteStudent} 
          onReset={handleResetData}
          onClose={() => setShowAdminPanel(false)} 
        />
      )}
    </div>
  );
};

export default App;
