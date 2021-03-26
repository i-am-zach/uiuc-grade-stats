import React, { useState, createContext, useEffect } from 'react';
import { IJSONCourse, JSONCourseContextProps } from '../type';

export const JSONCourseContext = createContext<Partial<JSONCourseContextProps>>(
  {},
);

export const JSONCourseProvider = ({ children }) => {
  useEffect(() => {
    const localCourses = JSON.parse(localStorage.getItem('courses'));
    if (!localCourses) {
      localStorage.setItem('courses', JSON.stringify([]));
    }
    setCourses(localCourses || []);
  }, []);

  const [courses, setCourses] = useState<IJSONCourse[]>([]);

  const addCourse = (course: IJSONCourse) => {
    console.log('Adding course', course);
    setCourses((prevCourses) => {
      const newCourses = [...prevCourses, course];
      localStorage.setItem('courses', JSON.stringify(newCourses));
      return newCourses;
    });
  };

  const removeCourse = (course: IJSONCourse) => {
    setCourses((prevCourses) => {
      const newCourses = prevCourses.filter(
        (c) => c.subject !== course.subject || c.number !== course.number,
      );
      localStorage.setItem('courses', JSON.stringify(newCourses));
      return newCourses;
    });
  };

  const includes = (course: IJSONCourse) => {
    for (const c of courses) {
      if (c.subject === course.subject && c.number === course.number) {
        return true;
      }
      return false;
    }
  };

  return (
    <JSONCourseContext.Provider
      value={{ courses, addCourse, removeCourse, includes }}
    >
      {children}
    </JSONCourseContext.Provider>
  );
};
