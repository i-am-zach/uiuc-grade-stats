import React from 'react';
import Plot from 'react-plotly.js';
import Course from '../models/course';
import { getColorFromGPA } from '../utils';

const CourseBarChart: React.FC<{ course: Course }> = ({ course }) => {
  const data = course.getAggregateGpa();

  let x: number[] = [];
  let y: number[] = [];
  let color: string[] = [];
  for (let [gpa, numStudents] of Object.entries(data)) {
    gpa = (+gpa).toFixed(2);
    x.push(+gpa);
    y.push(numStudents);
    color.push(getColorFromGPA(+gpa));
  }

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: x,
          y: y,
          marker: {
            color: color,
          },
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

export default CourseBarChart;
