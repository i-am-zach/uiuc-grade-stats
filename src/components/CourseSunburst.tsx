import React from 'react';
import Plot from 'react-plotly.js';
import Course from '../models/course';

type CourseSunburstProps = {
  course: Course;
  years: number[];
  teacher: 'All' | string;
};

const CourseSunburst: React.FC<CourseSunburstProps> = ({ course, years, teacher }) => {
  const data = course.getAggregateData(years, teacher);

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
      style={{ width: '100%', height: '100%' }}
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

export default CourseSunburst;
