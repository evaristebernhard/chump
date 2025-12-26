export enum StudentType {
  RECOMMENDATION = '保研',
  EXAM = '考研',
  WORK = '工作',
  ABROAD = '出国'
}

export interface Student {
  id: string;
  name: string;
  major: string;
  year: number;
  type: StudentType;
  destination: string; // School or Company name
  contact?: string;
  isAnonymous: boolean;
  createdAt: number;
}

export interface GroupedDestination {
  destination: string;
  count: number;
  students: Student[];
}

export enum AuthLevel {
  NONE = 'NONE',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
