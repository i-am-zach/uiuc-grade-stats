import React, { useContext } from 'react';
import Course from '../models/course';
import { Box, Heading, Button, HStack, Grid } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { JSONCourseContext } from '../contexts';

type CourseViewProps = {
  course: Course;
};

const CourseView = ({ course }: CourseViewProps) => {
  const { removeCourse } = useContext(JSONCourseContext);

  let Plot;
  if (typeof document !== 'undefined') {
    Plot = require('react-plotly.js').default;
  }

  const years = [2017, 2018, 2019];

  if (Plot) {
    const sunburstData = course.get_sunburst_data(years);
    const barchartData = course.get_barchart_data(years);

    return (
      <Box pb={8}>
        <Heading size="xl" textAlign="center">
          {course.subject} {course.number}: {course.title}
        </Heading>
        <Box>
          <Grid templateColumns={{base: "100%", lg: "40% 60%"}}>
            <Plot
              data={[
                {
                  type: 'sunburst',
                  labels: sunburstData.labels,
                  parents: sunburstData.parents,
                  values: sunburstData.values,
                  branchvalues: 'total',
                  textinfo: 'label+percent root',
                },
              ]}
              layout={{
                // autosize: true,
                title: 'Distribution of Letter Grades',
              }}
              config={{ responsive: true }}
            />
            <Plot
              data={[
                {
                  type: 'bar',
                  x: barchartData.x,
                  y: barchartData.y,
                  marker: {
                    color: barchartData.color,
                  },
                },
              ]}
              layout={{
                // autosize: true,
                title: `# of Students vs. GPA for years ${years.toString()}`,
                xaxis: {
                  title: 'Grade Point Average (GPA)',
                },
                yaxis: {
                  title: '# of Students',
                },
              }}
              config={{ responsive: true }}
            />
          </Grid>
        </Box>
        <HStack justify="center" align="center">
          <Button
            leftIcon={<CloseIcon />}
            size="sm"
            colorScheme="red"
            onClick={() => removeCourse(course.to_dict())}
          >
            Remove {course.shortName}
          </Button>
        </HStack>
      </Box>
    );
  }
  return <h1>Loading...</h1>;
};

export default CourseView;
