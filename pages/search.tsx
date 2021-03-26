import { useContext } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import * as d3 from 'd3';
import { Box } from '@chakra-ui/layout';
import { getCoursesObject, getGradesData } from '../utils';
import SearchBar from '../components/search-bar';
import { JSONCourseContext } from '../contexts';

type HomePageProps = {
  gradesData: d3.DSVParsedArray<any>;
  coursesObject: { [key: string]: number[] };
};

export default function Home({ gradesData, coursesObject }: HomePageProps) {
  const { courses } = useContext(JSONCourseContext);

  return (
    <div>
      <Head>
        <title>UIUC Class Grade Statistics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box m={4}>
        <SearchBar gradesData={gradesData} courses={coursesObject}></SearchBar>
      </Box>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (_) => {
  const gradesData = await getGradesData();
  const coursesObject = getCoursesObject(gradesData);

  return {
    props: {
      gradesData,
      coursesObject,
    },
  };
};
