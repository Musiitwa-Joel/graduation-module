import { createContext, useContext, useState, ReactNode } from 'react';
import { mockStudents } from '@/data/mockData';

export interface Student {
  id: string;
  name: string;
  studentId: string;
  faculty: string;
  department: string;
  program: string;
  graduationYear: string;
  email: string;
  phone: string;
  clearanceStatus: 'Cleared' | 'In Progress' | 'Rejected';
  paymentStatus: 'Paid' | 'Pending' | 'Waived';
  departmentalClearance: {
    academic: boolean;
    registrar: boolean;
    examinations: boolean;
    finance: boolean;
    alumni: boolean;
  };
  documents: {
    transcript: boolean;
    idCard: boolean;
    clearanceForm: boolean;
    feeReceipt: boolean;
  };
}

interface StudentContextType {
  students: Student[];
  setStudents: (students: Student[]) => void;
  getStudentById: (id: string) => Student | undefined;
  updateStudent: (id: string, data: Partial<Student>) => void;
  updateClearanceStatus: (id: string, department: keyof Student['departmentalClearance'], status: boolean) => void;
  filterStudents: (filters: Partial<Student>) => Student[];
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents);

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, ...data } : student
    ));
  };

  const updateClearanceStatus = (
    id: string, 
    department: keyof Student['departmentalClearance'], 
    status: boolean
  ) => {
    setStudents(students.map(student => 
      student.id === id 
        ? { 
            ...student, 
            departmentalClearance: { 
              ...student.departmentalClearance, 
              [department]: status 
            } 
          } 
        : student
    ));
  };

  const filterStudents = (filters: Partial<Student>) => {
    return students.filter(student => {
      for (const [key, value] of Object.entries(filters)) {
        if (student[key as keyof Student] !== value) {
          return false;
        }
      }
      return true;
    });
  };

  return (
    <StudentContext.Provider value={{ 
      students, 
      setStudents, 
      getStudentById, 
      updateStudent, 
      updateClearanceStatus,
      filterStudents
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}