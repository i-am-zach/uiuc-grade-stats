import React, { useContext } from 'react';
import { CourseContext, GradeDataContext } from '../context';
import Course from '../models/course';
import '../css/courses.css';
import CourseBarChart from '../components/CourseBarChart';
import CourseSunburst from '../components/CourseSunburst';

type CourseComponentProps = {
  course: Course;
};





const CourseComponent: React.FC<CourseComponentProps> = ({ course }) => {
  return (
    <div>
      <h1>
        {course.subject} {course.number}: {course.title}
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ height: '500px', width: '100%' }}>
          <CourseBarChart course={course} />
        </div>
        <div style={{ height: '500px', width: '100%' }}>
          <CourseSunburst course={course} />
        </div>
      </div>
    </div>
  );
};

export const Courses = () => {
  const { courses } = useContext(CourseContext);
  const gradeData = useContext(GradeDataContext);

  if (!gradeData) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1 className="courses--heading">My Courses</h1>
      {courses?.map((course) => {
        const c = new Course(course.subject, course.number, gradeData);
        return <CourseComponent course={c} />;
      })}
    </div>
  );
};
