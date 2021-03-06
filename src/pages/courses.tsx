import React, { useContext, useEffect, useState } from 'react';
import { CourseContext, GradeDataContext } from '../context';
import Course from '../models/course';
import CourseBarChart from '../components/CourseBarChart';
import CourseSunburst from '../components/CourseSunburst';
import {
  FormControl,
  FormLabel,
  SimpleGrid,
  Heading,
  Select,
  Grid,
  Box,
  Button,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

type CourseComponentProps = {
  course: Course;
  years: number[];
};

const CourseComponent: React.FC<CourseComponentProps> = ({ course, years }) => {
  const [currentTeacher, setCurrentTeacher] = useState('All');
  const { removeCourse } = useContext(CourseContext);

  const teachers = ['All', ...course.getTeachers(years)];
  return (
    <Box pb="10">
      <Heading size="xl" pt="3">
        {course.subject} {course.number}: {course.title}
      </Heading>
      <FormControl maxW="48" pt="3">
        <FormLabel>Filter By Instructor</FormLabel>
        <Select
          value={currentTeacher}
          onChange={(e) => setCurrentTeacher(e.target.value)}
        >
          {teachers.map((teacher) => (
            <option value={teacher}>{teacher}</option>
          ))}
        </Select>
      </FormControl>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="8">
        <Box w="full" h="500px">
          <CourseBarChart
            course={course}
            years={years}
            teacher={currentTeacher}
          />
        </Box>
        <Box w="full" h="500px">
          <CourseSunburst
            course={course}
            years={years}
            teacher={currentTeacher}
          />
        </Box>
      </SimpleGrid>
      <Box display="flex" alignItems="center" justifyContent="center" pt="4">
        <Button
          colorScheme="red"
          onClick={() => removeCourse(course.to_dict())}
        >
          Remove {course.shortName}
        </Button>
      </Box>
    </Box>
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

  console.log('Courses.length', courses.length);

  if (!gradeData) {
    return <h1>Loading...</h1>;
  }

  if (courses.length === 0) {
    return (
      <Box p={4}>
        <Heading size="3xl" textAlign="center" className="courses--heading">
          My Courses
        </Heading>

        <Box textAlign="center" pt="8">
          <Heading size="md" fontWeight="semibold" pb="3">
            Oh no! You have no courses.
          </Heading>
          <RouterLink to="/search">
            <Button colorScheme="blue">Add Courses</Button>
          </RouterLink>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={4} position="relative">
      <Box pb="3">
        <RouterLink to="/search">
          <Button
            leftIcon={<AddIcon />}
            size="sm"
            variant="outline"
            colorScheme="blue"
          >
            Add Courses
          </Button>
        </RouterLink>
      </Box>
      <Heading size="3xl" pb="5">
        My Courses
      </Heading>
      <Grid templateColumns="100px 100px">
        <FormControl>
          <FormLabel>Start Year</FormLabel>
          <Select
            id="start-year"
            value={startYear}
            onChange={(e) => setStartYear(+e.target.value)}
          >
            {yearOptions.map((year) => (
              <option value={year}>{year}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>End Year</FormLabel>
          <Select
            id="start-year"
            value={endYear}
            onChange={(e) => setEndYear(+e.target.value)}
          >
            {yearOptions.map((year) => (
              <option value={year}>{year}</option>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {courses?.map((course) => {
        const c = new Course(course.subject, course.number, gradeData);
        return <CourseComponent course={c} years={years} key={c.shortName} />;
      })}
    </Box>
  );
};
