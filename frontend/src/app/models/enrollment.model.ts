// src/app/models/enrollment.model.ts
export interface Enrollment {
    id: number;
    shift: string;
    start_date: string;
    end_date: string;
    status: string;
    institution_name: string;
    course_name: string;
    course_type: string;
  }