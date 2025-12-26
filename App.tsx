import React, { useState, useEffect, useMemo } from 'react';
import { Student, AuthLevel, GroupedDestination } from './types';
import { ADMIN_EMAIL } from './constants';
import * as storageService from './services/storageService';
import AuthGuard from './components/AuthGuard';
import DestinationCard from './components/DestinationCard';
import DataForm from './components/DataForm';
import AdminPanel from './components/AdminPanel';
import AiAdvisor from './components/AiAdvisor';

// Safe ID generator that works in all contexts
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
  
  // New state for major filtering
  const [selectedMajor, setSelectedMajor] = useState<string>('全部');

  // --- Helpers ---
  const refreshData = async () => {
    setIsLoading(true);
    const data = await storageService.getStudents();
    setStudents(data);
    setIsLoading(false);
  };

  // --- Effects ---
  useEffect(() => {
    if (authLevel !== AuthLevel.NONE) {
      refreshData();
    }
  }, [authLevel]);

  // --- Logic ---
  
  // Get unique majors for the filter bar
  const availableMajors = useMemo(() => {
    const majors = new Set<string>();
    majors.add('全部');
    students.forEach(s => majors.add(s.major));
    return Array.from(majors);
  }, [students]);

  const groupedData = useMemo(() => {
    const map = new Map<string, Student[]>();
    
    // Apply major filter
    const filteredStudents = selectedMajor === '全部' 
      ? students 
      : students.filter(s => s.major === selectedMajor);

    filteredStudents.forEach(s => {
      if (!s.destination || s.destination.includes('待定')) return;
      const key = s.destination;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });

    const groups: GroupedDestination[] = [];
    map.forEach((list, dest) => {
      groups.push({ destination: dest, count: list.length, students: list });
    });
    
    return groups.sort((a, b) => b.count - a.count);
  }, [students, selectedMajor]);

  const handleAddStudent = async (data: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...data,
      id: generateId(),
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
    if (window.confirm("确定要重置所有数据吗？此操作不可逆。")) {
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
              <h1 className="text-xl font-bold leading-none">毕业去向地图 (GradMap)</h1>
              <p className="text-xs text-slate-400">保研 / 考研 / 就业 / 出国</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <button 
              onClick={() => { setView('map'); refreshData(); }}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${view === 'map' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              地图
            </button>
            <button 
              onClick={() => setView('add')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${view === 'add' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              添加
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {view === 'map' && (
              <>
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">毕业去向分布</h2>
                      <p className="text-slate-500 text-sm">点击卡片查看详细名单</p>
                    </div>
                    
                    {/* Major Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                      {availableMajors.map(major => (
                        <button
                          key={major}
                          onClick={() => setSelectedMajor(major)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            selectedMajor === major 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          {major}
                        </button>
                      ))}
                    </div>
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
                    <p className="text-slate-500 font-medium">该专业暂无去向记录</p>
                    <button 
                       onClick={() => setSelectedMajor('全部')}
                       className="mt-4 text-indigo-600 text-sm hover:underline"
                    >
                      查看全部专业
                    </button>
                  </div>
                )}
              </>
            )}

            {view === 'add' && (
              <DataForm onSubmit={handleAddStudent} onCancel={() => setView('map')} />
            )}

            {view === 'advisor' && (
              <div className="max-w-3xl mx-auto">
                 <AiAdvisor />
              </div>
            )}
          </>
        )}
      </main>

       {/* Selected Group Modal */}
       {selectedGroup && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
             <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedGroup.destination}</h3>
                  <p className="text-xs text-slate-500">{selectedMajor === '全部' ? '所有专业' : selectedMajor} · 共 {selectedGroup.count} 人</p>
                </div>
                <button onClick={() => setSelectedGroup(null)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
             </div>
             <div className="p-4 overflow-y-auto">
                <ul className="space-y-3">
                  {selectedGroup.students.map(s => (
                    <li key={s.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col">
                       <div className="flex justify-between items-start">
                         <div>
                           <span className="font-bold text-slate-800">{s.isAnonymous ? '某同学' : s.name}</span>
                           <div className="flex gap-2 mt-1">
                             <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">{s.major}</span>
                             <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{s.year}届</span>
                           </div>
                         </div>
                         <span className="px-2 py-1 text-[10px] bg-white border border-slate-200 rounded text-slate-600 font-medium">{s.type}</span>
                       </div>
                       
                       {s.contact && (
                         <div className="mt-3 flex justify-end">
                           <span className="inline-flex items-center gap-1 text-[11px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 shadow-sm">
                             <span>📞</span> {s.contact}
                           </span>
                         </div>
                       )}
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        </div>
      )}

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