import React, { useState } from 'react';
import { AuthLevel } from '../types';
import { USER_PASSWORD, ADMIN_PASSWORD } from '../constants';

interface AuthGuardProps {
  onAuth: (level: AuthLevel) => void;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ onAuth }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === USER_PASSWORD) {
      onAuth(AuthLevel.USER);
    } else if (input === ADMIN_PASSWORD) {
      onAuth(AuthLevel.ADMIN);
    } else {
      setError('暗号错误 (Incorrect Code)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            🎓 去向地图 (PathMap)
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            请输入约定好的暗号以访问数据
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="passcode" className="sr-only">Code</label>
              <input
                id="passcode"
                name="passcode"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-500 text-white bg-slate-700 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="输入暗号 (Enter Code)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              进入 (Enter)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthGuard;