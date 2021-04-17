// @ts-ignore
import Gradident from 'javascript-color-gradient';
import * as d3 from 'd3';
import Course from './models/course';

export const getGradesData = (): Promise<d3.DSVParsedArray<any>> => {
  /**
   * Type coversion
   * @param d
   * @returns
   */
  const conversor = (d: any) => {
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

/**
 *
 * @param grade: the letter grade
 * @returns a color representation of a grade calculated using a gradient
 */
export const getColorFromGrade = (grade: string) => {
  const colorGradient = new Gradident();
  const blue = '#0000ff';
  const orange = '#ff8000';
  colorGradient.setGradient(orange, blue);
  colorGradient.setMidpoint(13);

  const gradeToColorMap: { [key: string]: string } = {
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

export const getColorFromGPA = (gpa: number) => {
  const grade = Course.gpa_to_grade(gpa);
  return getColorFromGrade(grade);
};
