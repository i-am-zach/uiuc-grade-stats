import React from 'react';
import Course from '../models/course';
import { Box } from '@chakra-ui/react';
import { getColorFromGrade } from '../utils';
import { VictoryPie, VictoryTooltip } from 'victory';
export type PieChartComponentProps = {
  course: Course;
  years: number[];
};

const PieLabel = ({}) => {
  <text>
    <tspan></tspan>
    <tspan></tspan>
  </text>
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  course,
  years,
}) => {
  const dataMap = course.get_aggregate_data(years);
  const n = course.get_n(years);
  console.log(course.title, 'Pie Chart', dataMap);
  let data = [];
  for (const [grade, numStudents] of Object.entries(dataMap)) {
    data.push({
      x: grade,
      y: (numStudents / n * 100).toFixed(2) + "%",
    });
  }
  return (
    <Box height="500px" w="500px">
      <svg viewBox="0 0 400 400">
        <VictoryPie
          height={400}
          width={400}
          data={data}
          labelRadius={100}
          standalone={false}
          labelComponent={<VictoryTooltip/>}
        ></VictoryPie>
      </svg>
    </Box>
  );
};

export default PieChartComponent;
