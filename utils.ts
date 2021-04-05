import Gradident from 'javascript-color-gradient';
import * as d3 from 'd3';
import Course from "./models/course";

/**
 * Asynchronously fetches the csv data and converts it to an array of objects
 * @returns a d3 DSVParsedArray promise
 */
export const getGradesData = (): Promise<d3.DSVParsedArray<any>> => {
  /**
   * Type coversion
   * @param d
   * @returns
   */
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

/**
 *
 * @param gradeData: the d3 parsed array fetched
 * @returns an object that maps course subjects to an array of course numbers
 * Example return:
 * {
 *  "CS": ["100", "101", "102", "173", "211",...],
 *  "ECE": ["100", "101", "102", "173", "211",...],
 * }
 */
export const getCoursesObject = (
  gradeData: d3.DSVParsedArray<any>,
): { [key: string]: string[] } => {
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

  const gradeToColorMap = {
    'A+': "#43A047",
    A: "#4CAF50",
    'A-': "#66BB6A",
    'B+': "#00ACC1",
    B: "#00BCD4",
    'B-': "#26C6DA",
    'C+': "#1E88E5",
    C: "#2196F3",
    'C-': "#42A5F5",
    'D+': "#5E35B1",
    D: "#673AB7",
    'D-': "#7E57C2",
    F: "#E91E63",
  };

  return gradeToColorMap[grade];
};

export const getColorFromGpa = (gpa: number) => {
  const grade = Course.gpa_to_grade(gpa);

  return getColorFromGrade(grade);
};
