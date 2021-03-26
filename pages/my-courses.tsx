import React, { useContext } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import * as d3 from 'd3';
import Course from '../models/course';
import CourseView from '../components/course-view';
import { Box, VStack } from '@chakra-ui/layout';
import { getGradesData } from '../utils';
import { JSONCourseContext } from '../contexts';
import { Heading, Button, Text } from '@chakra-ui/react';
import NextLink from "next/link";

type HomePageProps = {
  gradesData: d3.DSVParsedArray<any>;
};

export default function Home({ gradesData }: HomePageProps) {
  const { courses } = useContext(JSONCourseContext);

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
        <VStack align="stretch" spacing={8}>
          {myCourses.map((course) => {
            return <CourseView course={course} key={course.shortName} />;
          })}
        </VStack>
      </div>
    );
  }
  return (
    <Box p={5} textAlign="center">
      <Heading size="2xl" pb={3}>Wow. So Empty...</Heading>
      <Text fontSize="2xl" pb={3}>It seems you haven't added any courses yet.</Text>
      <NextLink href="/search"><Button size="lg" colorScheme="blue">Add courses</Button></NextLink>
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
