import { Student, StudentType } from './types';

export const USER_PASSWORD = 'chu123456';
export const ADMIN_PASSWORD = 'hcy123456';
export const ADMIN_EMAIL = 'evaristebernhardwiener@gmail.com';

// Seed data from the user's prompt
// Updated with mock destinations so they appear on the map (since '待定' is now hidden)
export const INITIAL_STUDENTS: Student[] = [
  // Math & Applied Math
  { id: 'seed-1', name: '向魁炜', major: '数学与应用数学', year: 2024, type: StudentType.RECOMMENDATION, destination: '北京大学', isAnonymous: false, createdAt: 1700000000000 },
  { id: 'seed-2', name: '罗艺轩', major: '数学与应用数学', year: 2024, type: StudentType.RECOMMENDATION, destination: '复旦大学', isAnonymous: false, createdAt: 1700000000001 },
  { id: 'seed-3', name: '张嘉逸', major: '数学与应用数学', year: 2024, type: StudentType.RECOMMENDATION, destination: '中国科学技术大学', isAnonymous: false, createdAt: 1700000000002 },
  { id: 'seed-4', name: '杨柳', major: '数学与应用数学', year: 2024, type: StudentType.RECOMMENDATION, destination: '浙江大学', isAnonymous: false, createdAt: 1700000000003 },
  { id: 'seed-5', name: '李梦雨', major: '数学与应用数学', year: 2024, type: StudentType.RECOMMENDATION, destination: '南京大学', isAnonymous: false, createdAt: 1700000000004 },
  { id: 'seed-6', name: '韩佳', major: '数学与应用数学', year: 2024, type: StudentType.RECOMMENDATION, destination: '北京大学', isAnonymous: false, createdAt: 1700000000005 },
  // Info & Comp Sci
  { id: 'seed-7', name: '俞雪蕾', major: '信息与计算科学', year: 2024, type: StudentType.RECOMMENDATION, destination: '清华大学', isAnonymous: false, createdAt: 1700000000006 },
  { id: 'seed-8', name: '杨骏成', major: '信息与计算科学', year: 2024, type: StudentType.RECOMMENDATION, destination: '上海交通大学', isAnonymous: false, createdAt: 1700000000007 },
  { id: 'seed-9', name: '林新迪', major: '信息与计算科学', year: 2024, type: StudentType.RECOMMENDATION, destination: '复旦大学', isAnonymous: false, createdAt: 1700000000008 },
  { id: 'seed-10', name: '陈佳奇', major: '信息与计算科学', year: 2024, type: StudentType.RECOMMENDATION, destination: '中国科学院大学', isAnonymous: false, createdAt: 1700000000009 },
  { id: 'seed-11', name: '王鑫淼', major: '信息与计算科学', year: 2024, type: StudentType.RECOMMENDATION, destination: '同济大学', isAnonymous: false, createdAt: 1700000000010 },
  { id: 'seed-12', name: '王鑫乐', major: '信息与计算科学', year: 2024, type: StudentType.RECOMMENDATION, destination: '浙江大学', isAnonymous: false, createdAt: 1700000000011 },
  { id: 'seed-13', name: '朱雪婷', major: '信息与计算科学', year: 2024, type: StudentType.WORK, destination: '华为', isAnonymous: false, createdAt: 1700000000012 },
];