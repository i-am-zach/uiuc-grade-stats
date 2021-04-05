import React, { useContext } from 'react';
import BarChartComponent from './bar-chart';
import PieChartComponent from './pie-chart';
import Course from '../models/course';
import { Box, Heading } from '@chakra-ui/react';
import { JSONCourseContext } from '../contexts';

type CourseViewProps = {
  course: Course;
  years: number[];
};

const CourseView = ({ course, years }: CourseViewProps) => {
  const { removeCourse } = useContext(JSONCourseContext);

  return (
    <Box p={8}>
      <Heading>{course.title}</Heading>
      <BarChartComponent course={course} years={years} />
      {/* <PieChartComponent course={course} years={years} /> */}
    </Box>
  );
};

export default CourseView;
