import React, { useContext, useEffect, useState } from 'react';
import { CourseContext, GradeDataContext } from '../context';
import Course from '../models/course';
import '../css/courses.css';
import CourseBarChart from '../components/CourseBarChart';
import CourseSunburst from '../components/CourseSunburst';

type CourseComponentProps = {
  course: Course;
  years: number[];
};

const CourseComponent: React.FC<CourseComponentProps> = ({ course, years }) => {
  const [currentTeacher, setCurrentTeacher] = useState('All');

  const teachers = ['All', ...course.getTeachers(years)];
  return (
    <div>
      <h1>
        {course.subject} {course.number}: {course.title}
      </h1>
      <label>Filter by Instructor</label>
      <select
        value={currentTeacher}
        onChange={(e) => setCurrentTeacher(e.target.value)}
      >
        {teachers.map((teacher) => (
          <option value={teacher}>{teacher}</option>
        ))}
      </select>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ height: '500px', width: '100%' }}>
          <CourseBarChart
            course={course}
            years={years}
            teacher={currentTeacher}
          />
        </div>
        <div style={{ height: '500px', width: '100%' }}>
          <CourseSunburst
            course={course}
            years={years}
            teacher={currentTeacher}
          />
        </div>
      </div>
    </div>
  );
};

export const Courses = () => {
  const { courses } = useContext(CourseContext);
  const gradeData = useContext(GradeDataContext);

  const maxYear = 2020;
  const minYear = 2010;

  const yearOptions = [];
  for (let year = minYear; year <= maxYear; year++) {
    yearOptions.push(year);
  }

  const [startYear, setStartYear] = useState(2010);
  const [endYear, setEndYear] = useState(2020);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    let newYears = [];
    for (let year = startYear; year <= endYear; year++) {
      newYears.push(year);
    }
    setYears(newYears);
  }, [startYear, endYear]);

  if (!gradeData) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1 className="courses--heading">My Courses</h1>

      <form>
        <label htmlFor="start-year">Start Year</label>
        <select
          id="start-year"
          value={startYear}
          onChange={(e) => setStartYear(+e.target.value)}
        >
          {yearOptions.map((year) => (
            <option value={year}>{year}</option>
          ))}
        </select>
        <label htmlFor="end-year">End Year</label>
        <select
          id="start-year"
          value={endYear}
          onChange={(e) => setEndYear(+e.target.value)}
        >
          {yearOptions.map((year) => (
            <option value={year}>{year}</option>
          ))}
        </select>
      </form>
      {courses?.map((course) => {
        const c = new Course(course.subject, course.number, gradeData);
        return <CourseComponent course={c} years={years} />;
      })}
    </div>
  );
};
