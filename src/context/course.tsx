import * as React from 'react';

export interface IJSONCourse {
  subject: string;
  number: number;
}

export type CourseContextType = {
  courses: IJSONCourse[],
  addCourse: (course: IJSONCourse) => void,
  removeCourse: (course: IJSONCourse) => void,
}

export const CourseContext = React.createContext<Partial<CourseContextType>>(
  { courses: [], },
);

export const CourseProvider: React.FC = ({ children }) => {
  let localCourses: IJSONCourse[] = JSON.parse(
    localStorage.getItem('courses') || '[]',
  );
  const [courses, setCourses] = React.useState<IJSONCourse[]>(localCourses);

  const addCourse = (course: IJSONCourse) => {
    setCourses((prevCourses) => {
      let newCourses = [...prevCourses, course];
      localStorage.setItem('courses', JSON.stringify(newCourses));
      return newCourses;
    });
  };

  const removeCourse = (course: IJSONCourse) => {
    setCourses((prevCourses) => {
      let newCourses = prevCourses.filter(
        (c) => c.number !== course.number || c.subject !== course.subject,
      );
      localStorage.setItem('courses', JSON.stringify(newCourses));
      return newCourses;
    });
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse, removeCourse }}>
      {children}
    </CourseContext.Provider>
  );
};
