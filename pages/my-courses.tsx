import React, { useContext, useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import * as d3 from 'd3';
import Course from '../models/course';
import CourseView from '../components/course-view';
import { Box, HStack, VStack } from '@chakra-ui/layout';
import { getGradesData } from '../utils';
import { JSONCourseContext } from '../contexts';
import {
  Heading,
  Button,
  Text,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import NextLink from 'next/link';

type HomePageProps = {
  gradesData: d3.DSVParsedArray<any>;
};

export default function Home({ gradesData }: HomePageProps) {
  const { courses } = useContext(JSONCourseContext);

  const [years, setYears] = useState([2017, 2018, 2019]);

  const updateYears = (startYear: number, endYear: number) => {
    if (startYear > endYear) return;
    let newYears = [];
    for (let i: number = startYear; i <= endYear; i++) {
      newYears.push(i);
    }
    setYears(newYears);
  };

  const onStartYearChange = (value) => {
    const newStartYear = parseInt(value);
    if (newStartYear.toString().length === 4) {
      const endYear = years[years.length - 1];
      updateYears(newStartYear, endYear);
    }
  };

  const onEndYearChange = (value) => {
    const newEndYear = parseInt(value);
    if (newEndYear.toString().length === 4) {
      const startYear = years[0];
      updateYears(startYear, newEndYear);
    }
  };

  const myCourses = courses.map(
    (jsonCourse) =>
      new Course(jsonCourse.subject, jsonCourse.number, gradesData),
  );

  if (myCourses.length > 0) {
    return (
      <div>
        <Head>
          <title>UIUC Class Grade Statistics</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Heading>Settings</Heading>
        <HStack >
          <FormControl>
            <FormLabel>Start Year</FormLabel>
            <NumberInput defaultValue={years[0]} onChange={onStartYearChange}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>End Year</FormLabel>
            <NumberInput
              defaultValue={years[years.length - 1]}
              onChange={onEndYearChange}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </HStack>
        <VStack align="stretch" spacing={8}>
          {myCourses.map((course) => {
            return (
              <CourseView
                course={course}
                years={years}
                key={course.shortName}
              />
            );
          })}
        </VStack>
      </div>
    );
  }

  return (
    <Box p={5} textAlign="center">
      <Heading size="2xl" pb={3}>
        Wow. So Empty...
      </Heading>
      <Text fontSize="2xl" pb={3}>
        It seems you haven't added any courses yet.
      </Text>
      <NextLink href="/search">
        <Button size="lg" colorScheme="blue">
          Add courses
        </Button>
      </NextLink>
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async (_) => {
  const gradesData = await getGradesData();

  return {
    props: {
      gradesData,
    },
  };
};
