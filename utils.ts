import Gradident from 'javascript-color-gradient';
import * as d3 from 'd3';

export const getGradesData = () => {
  const conversor = (d) => {
    for (const key of Object.keys(d)) {
      if (!isNaN(d[key])) {
        d[key] = +d[key];
      }
    }
    return d;
  };

  return d3.csv(
    'https://raw.githubusercontent.com/wadefagen/datasets/master/gpa/uiuc-gpa-dataset.csv',
    conversor,
  );
};

export const getCoursesObject = (gradeData: d3.DSVParsedArray<any>) => {
  let courses: { [key: string]: Set<string> } = {};

  for (let row of gradeData) {
    const subject = row['Subject'];
    if (Object.keys(courses).includes(subject)) {
      courses[subject].add(row['Number']);
    } else {
      courses[subject] = new Set();
      courses[subject].add(row['Number']);
    }
  }

  let output: { [key: string]: Array<string> } = {};
  for (let key of Object.keys(courses)) {
    output[key] = Array.from(courses[key]);
  }
  return output;
};

export const getColorFromGrade = (grade: string) => {
  const colorGradient = new Gradident();
  const blue = '#0000ff';
  const orange = '#ff8000';
  colorGradient.setGradient(orange, blue);
  colorGradient.setMidpoint(13);

  const gradeToColorMap = {
    'A+': colorGradient.getColor(1),
    A: colorGradient.getColor(2),
    'A-': colorGradient.getColor(3),
    'B+': colorGradient.getColor(4),
    B: colorGradient.getColor(5),
    'B-': colorGradient.getColor(6),
    'C+': colorGradient.getColor(7),
    C: colorGradient.getColor(8),
    'C-': colorGradient.getColor(9),
    'D+': colorGradient.getColor(10),
    D: colorGradient.getColor(11),
    'D-': colorGradient.getColor(12),
    F: colorGradient.getColor(13),
  };

  return gradeToColorMap[grade];
};

export const sortObject = (obj: Object) => {
  return Object.keys(obj)
    .sort((prev, curr) => parseFloat(prev) - parseFloat(curr))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
};
