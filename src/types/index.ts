export interface OSData {
  id: string;
  name: string;
  year: number;
  description: string;
  company: string;
  keyPersons: string[];
  techFeatures: string[];
  significance: string;
  influences: string[]; // OS IDs that influenced this OS
  influenced: string[]; // OS IDs that this OS influenced
  category: 'mainframe' | 'personal' | 'mobile' | 'embedded' | 'server';
  color: string;
  position?: { x: number; y: number; z: number };
}

export interface ConnectionData {
  from: string;
  to: string;
  type: 'influence' | 'evolution' | 'inspiration';
  strength: number; // 0-1
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  osIds: string[];
}
