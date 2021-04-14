import React, { useContext } from 'react';
import { CourseContext, GradeDataContext } from '../context';
import Course from '../models/course';
import Plot from 'react-plotly.js';
import { Heading, Grid } from '@chakra-ui/react';

type CourseComponentProps = {
  course: Course;
};

const CourseBarChart: React.FC<{ course: Course }> = ({ course }) => {
  const data = course.getAggregateGpa();

  let x: number[] = [];
  let y: number[] = [];
  for (let [gpa, numStudents] of Object.entries(data)) {
    x.push(+gpa);
    y.push(numStudents);
  }

  return (
    <Plot
      data={[
        {
          type: 'histogram',
          histfunc: 'sum',
          x: x,
          y: y,
          xbins: { start: 0, end: 4, size: 0.33 },
          domain: { x: [0, 4] },
        },
      ]}
      layout={{
        margin: { l: 10, r: 10, b: 40, t: 10 },
        xaxis: {
          title: 'Grade Point Average',
        },
        yaxis: {
          title: '# of Students',
        },
      }}
      config={{ responsive: true }}
    />
  );
};

const CourseSunburst: React.FC<CourseComponentProps> = ({ course }) => {
  const data = course.getAggregateData();

  const parentsData: { [key: string]: number } = {
    As: 0,
    Bs: 0,
    Cs: 0,
    Ds: 0,
    Fs: 0,
  };

  let labels = [];
  let parents = [];
  let values = [];

  for (let [grade, numStudents] of Object.entries(data)) {
    const parent = `${grade[0]}s`;
    labels.push(grade);
    parents.push(parent);
    values.push(numStudents);
    parentsData[parent] += numStudents;
  }

  for (let [parent, numStudents] of Object.entries(parentsData)) {
    labels.push(parent);
    parents.push('');
    values.push(numStudents);
  }

  return (
    <Plot
      data={[
        {
          type: 'sunburst',
          labels: labels,
          values: values,
          parents: parents,
          branchvalues: 'total',
          // @ts-ignore
          textinfo: 'label+percent root',
        },
      ]}
      layout={{
        /*title: `${course.shortName}: ${course.title}`,*/
        margin: { l: 10, r: 10, b: 10, t: 10 },
      }}
      config={{ responsive: true }}
    />
  );
};

const CourseComponent: React.FC<CourseComponentProps> = ({ course }) => {
  return (
    <div>
      <Heading size="xl" textAlign="center">
        {course.subject} {course.number}: {course.title}
      </Heading>
      <Grid templateColumns={{ base: '100%', lg: '50% 50%' }}>
        <div style={{ height: '500px', width: '100%' }}>
          <CourseBarChart course={course} />
        </div>
        <div style={{ height: '500px', width: '100%' }}>
          <CourseSunburst course={course} />
        </div>
      </Grid>
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
      <h1>My Courses</h1>
      {courses?.map((course) => {
        const c = new Course(course.subject, course.number, gradeData);
        return <CourseComponent course={c} />;
      })}
    </div>
  );
};
