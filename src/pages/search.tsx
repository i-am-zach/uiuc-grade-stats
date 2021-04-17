import SearchBar from '../components/SearchBar';

import { getCoursesObject } from '../utils';
import { GradeDataContext } from '../context';
import React, { useContext } from 'react';
import { Heading, Box } from '@chakra-ui/react';

export const SearchPage: React.FC = () => {
  const gradeData = useContext(GradeDataContext);

  if (!gradeData) {
    return <Heading>Loading...</Heading>;
  }

  const courses = getCoursesObject(gradeData);

  return (
    <Box p={4}>
      <SearchBar gradesData={gradeData} courses={courses} />
    </Box>
  );
};
