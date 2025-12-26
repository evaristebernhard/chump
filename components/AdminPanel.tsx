import React, { useState } from 'react';
import { Student } from '../types';

interface AdminPanelProps {
  students: Student[];
  onDelete: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ students, onDelete, onReset, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || 
    (s.destination && s.destination.includes(searchTerm)) ||
    s.major.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-slate-800">管理员控制台 (Admin Console)</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
        </div>
        
        <div className="p-4 border-b border-slate-200 flex gap-4">
           <input
            type="text"
            placeholder="搜索学生或学校..."
            className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           />
           <button 
             onClick={onReset}
             className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm font-medium whitespace-nowrap"
           >
             重置数据 (Reset Data)
           </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">姓名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">去向</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">届数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {student.name} {student.isAnonymous && <span className="text-xs text-gray-400">(Anon)</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {student.destination} <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{student.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {student.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => onDelete(student.id)}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-xs"
                    >
                      删除 (Delete)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-slate-500">未找到记录</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
