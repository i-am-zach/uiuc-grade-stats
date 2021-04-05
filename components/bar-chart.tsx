import React from 'react';
import Course from '../models/course';
import { Box } from '@chakra-ui/layout';
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';

export type BarChartProps = {
  course: Course;
  years: number[];
};

const BarChartComponent: React.FC<BarChartProps> = ({ course, years }) => {
  const dataMap = course.get_aggregate_gpa(years);
  dataMap['0.33'] = 0;
  console.log(course.title, 'Bar Chart', dataMap);
  let data = [];
  for (const [gpa, numStudents] of Object.entries(dataMap)) {
    data.push({ gpa, numStudents });
  }

  data.sort((a, b) => parseFloat(a.gpa) - parseFloat(b.gpa));
  return (
    <ResponsiveContainer height={300} width="100%">
      <BarChart data={data}>
        <Bar dataKey="numStudents"></Bar>
        <XAxis dataKey="gpa" />
        <YAxis />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;

{
  /* <ResponsiveBar
  data={barChartData}
  keys={['numStudents']}
  indexBy="gpa"
  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
  padding={0.3}
  colors={(args) => {
    const gpa = parseFloat(args.indexValue);
    const color = getColorFromGpa(gpa);
    return color;
  }}
  tooltip={(props) => (
    <div>
      <div>GPA: {props.indexValue}</div>
      <div>Number of Students: {props.value}</div>
    </div>
  )}
/>; */
}
