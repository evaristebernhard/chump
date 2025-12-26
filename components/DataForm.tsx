import React, { useState } from 'react';
import { Student, StudentType } from '../types';

interface DataFormProps {
  onSubmit: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const DataForm: React.FC<DataFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    major: '数学与应用数学',
    year: 2024,
    type: StudentType.RECOMMENDATION,
    destination: '',
    contact: '',
    isAnonymous: false
  });

  const [isCustomMajor, setIsCustomMajor] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '其他') {
      setIsCustomMajor(true);
      setFormData({ ...formData, major: '' });
    } else {
      setIsCustomMajor(false);
      setFormData({ ...formData, major: e.target.value });
    }
  };

  const years = Array.from({ length: 16 }, (_, i) => 2015 + i);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-slate-800 mb-6">添加新去向 (Add New Path)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">姓名 (Name)</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              placeholder="Your Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">专业 (Major)</label>
            {!isCustomMajor ? (
              <select
                value={formData.major}
                onChange={handleMajorChange}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              >
                <option value="数学与应用数学">数学与应用数学</option>
                <option value="信息与计算科学">信息与计算科学</option>
                <option value="统计学">统计学</option>
                <option value="其他">其他 (Other/Custom)</option>
              </select>
            ) : (
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  required
                  value={formData.major}
                  onChange={e => setFormData({...formData, major: e.target.value})}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                  placeholder="请输入专业名称"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => { setIsCustomMajor(false); setFormData({...formData, major: '数学与应用数学'}); }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 whitespace-nowrap px-2"
                >
                  重选 (Reset)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">毕业届数 (Year)</label>
            <select
              value={formData.year}
              onChange={e => setFormData({...formData, year: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            >
              {years.map(y => <option key={y} value={y}>{y}届</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">去向类型 (Type)</label>
            <select
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as StudentType})}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            >
              {Object.values(StudentType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">去向学校/单位 (Destination)</label>
          <input
            type="text"
            required
            value={formData.destination}
            onChange={e => setFormData({...formData, destination: e.target.value})}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            placeholder="e.g., 北京大学, Google"
          />
          <p className="text-xs text-slate-500 mt-1">请填写全称，方便归类 (Please use full name)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">联系方式 (Contact - Optional)</label>
          <input
            type="text"
            value={formData.contact}
            onChange={e => setFormData({...formData, contact: e.target.value})}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            placeholder="Email, WeChat (匿名发布时也会显示此项)"
          />
          <p className="text-xs text-slate-500 mt-1">如果愿意被咨询，请留下联系方式。</p>
        </div>

        <div className="flex items-center">
          <input
            id="anonymous"
            type="checkbox"
            checked={formData.isAnonymous}
            onChange={e => setFormData({...formData, isAnonymous: e.target.checked})}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="anonymous" className="ml-2 block text-sm text-slate-900">
            匿名发布 (Post Anonymously)
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            取消 (Cancel)
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            提交 (Submit)
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataForm;