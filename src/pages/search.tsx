import SearchBar from '../components/SearchBar';

import { getCoursesObject } from '../utils';
import { GradeDataContext } from '../context';
import React, { useContext } from 'react';
import { Heading, Box, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const gradeData = useContext(GradeDataContext);

  if (!gradeData) {
    return <Heading>Loading...</Heading>;
  }

  const courses = getCoursesObject(gradeData);

  return (
    <Box p={4}>
      <Box pb="4">
        <RouterLink to="/my-courses">
          <Button
            leftIcon={<ArrowBackIcon />}
            aria-label="Back to My Courses"
            colorScheme="blue"
            variant="outline"
            size="sm"
          >
            Back to My Courses
          </Button>
        </RouterLink>
      </Box>
      <SearchBar gradesData={gradeData} courses={courses} />
    </Box>
  );
};
