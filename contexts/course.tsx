import React, { useState, createContext, useEffect } from 'react';
import { IJSONCourse, JSONCourseContextProps } from '../type';

export const JSONCourseContext = createContext<Partial<JSONCourseContextProps>>(
  {},
);

export const JSONCourseProvider = ({ children }) => {
  /**
   * The JSON Course Provider exposes four things
   *  1. courses: An array of JSON Courses with just contain the subject and number of a course
   *  2. addCourse: A method which adds a course to the array
   *  3. removeCoures: A method which removes a course from the array
   *  4. clearCourses: A method which empties the courses array
   * 
   * The JSON Courses are synced with the browser's local storage so that a user can refresh the page and still
   * have their courses show up
   */
  useEffect(() => {
    const localCourses = JSON.parse(localStorage.getItem('courses'));
    if (!localCourses) {
      localStorage.setItem('courses', JSON.stringify([]));
    }
    setCourses(localCourses || []);
  }, []);

  const [courses, setCourses] = useState<IJSONCourse[]>([]);

  const addCourse = (course: IJSONCourse) => {
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

  const clearCourses = () => {
    setCourses([]);
    localStorage.setItem('courses', JSON.stringify([]));
  };

  return (
    <JSONCourseContext.Provider value={{ courses, addCourse, removeCourse, clearCourses }}>
      {children}
    </JSONCourseContext.Provider>
  );
};
