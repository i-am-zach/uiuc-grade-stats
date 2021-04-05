import * as d3 from 'd3';
import { IJSONCourse } from '../type';
import { getColorFromGrade } from '../utils';

export default class Course {
  data: d3.DSVParsedArray<any>;
  subject: string;
  number: number;
  shortName: string;
  title: string;
  static possibleGrades = [
    'A+',
    'A',
    'A-',
    'B+',
    'B',
    'B-',
    'C+',
    'C',
    'C-',
    'D+',
    'D',
    'D-',
    'F',
  ];

  static possibleGpas = [
    0,
    0.33,
    0.67,
    1,
    1.33,
    1.67,
    2,
    2.33,
    2.67,
    3,
    3.33,
    3.67,
    4,
  ];

  constructor(subject: string, number: number, data: d3.DSVParsedArray<any>) {
    this.subject = subject;
    this.number = number;
    this.shortName = subject + ' ' + number;
    this.data = data;
    this.title = this.get_course_title();
  }

  static gpa_to_grade(gpa: number): string {
    const map = {
      4: 'A',
      3.67: 'A-',
      3.33: 'B+',
      3: 'B',
      2.67: 'B-',
      2.33: 'C+',
      2: 'C',
      1.67: 'C-',
      1.33: 'D+',
      1: 'D',
      0.67: 'D-',
      0.33: 'F',
      0: 'F',
    };

    return map[gpa];
  }

  static grade_to_gpa(grade: string): number {
    /**
     * CONVERTS A LETTER GRADE TO A GPA
     *
     * @returns number
     */
    if (grade.length > 2) {
      return NaN;
    }

    if (grade === 'F') return 0;
    if (grade === 'A+') return 4;

    let gpa: number;
    switch (grade[0]) {
      case 'A':
        gpa = 4;
        break;
      case 'B':
        gpa = 3;
        break;
      case 'C':
        gpa = 2;
        break;
      case 'D':
        gpa = 1;
        break;
      default:
        return NaN;
    }
    if (grade.length === 1) return gpa;
    if (grade[1] === '+') return gpa + 0.33;
    if (grade[1] === '-') return gpa - 0.33;
    return NaN;
  }

  /**
   * Gets the title of the course from the GPA data
   * Called in the constructor
   */
  private get_course_title(): string {
    for (const row of this.data) {
      if (row['Number'] === this.number && row['Subject'] === this.subject) {
        return row['Course Title'];
      }
    }
  }

  /**
   * Reduces the grades dataset to only rows that matches the data
   */
  private get_fitted_dataset(years: number[]) {
    return this.data.filter(
      (d) =>
        d['Subject'] === this.subject &&
        d['Number'] === this.number &&
        years.includes(d['Year']),
    );
  }

  /**
   * Returns an object that maps a letter grade to a number of students for the course
   *
   * @params years (number[]): The years to get the data from
   *
   * Example return type:
   * {
   *  "A+": 10,
   *  "A": 9,
   *  "A-": 3,
   *  ...
   *  "F": 0,
   * }
   */
  get_aggregate_data(years = [2020]): { [key: string]: number } {
    const fittedDataset = this.get_fitted_dataset(years);
    let output: { [key: string]: number } = {};
    for (const grade of Course.possibleGrades) {
      output[grade] = 0;
    }
    for (let row of fittedDataset) {
      for (const grade of Course.possibleGrades) {
        output[grade] += row[grade];
      }
    }
    return output;
  }

  /**
   * Returns an object that maps a GPA to a number of students for the course
   *
   * @params years (number[]): The years to get the data from
   *
   * Example return type:
   * {
   *  4.0: 10,
   *  3.67: 9,
   *  3.33: 3,
   *  ...
   *  0: 0,
   * }
   */
  get_aggregate_gpa(years = [2020]): { [key: string]: number } {
    const fittedDataset = this.get_fitted_dataset(years);
    let output: { [key: string]: number } = {};
    for (const grade of Course.possibleGrades) {
      const gpa = Course.grade_to_gpa(grade).toFixed(2);
      output[gpa] = 0;
    }
    for (let row of fittedDataset) {
      for (const grade of Course.possibleGrades) {
        const gpa = Course.grade_to_gpa(grade).toFixed(2);
        output[gpa] += row[grade];
      }
    }
    return output;
  }

  /**
   * Gets the total number of students that received grades from the course in the specified years
   */
  get_n(years = [2020]) {
    const fittedDataset = this.get_fitted_dataset(years);
    let total = 0;
    for (let row of fittedDataset) {
      for (let grade of Course.possibleGrades) {
        total += row[grade];
      }
    }
    return total;
  }

  /**
   * Gets the data required for a Plotly sunburst chart
   *
   * See https://plotly.com/javascript/sunburst-charts/
   * Example data:
   * [{
   *  type: "sunburst",
   *  labels: ["Eve", "Cain", "Seth", "Enos", "Noam", "Abel", "Awan", "Enoch", "Azura"],
   *  parents: ["", "Eve", "Eve", "Seth", "Seth", "Eve", "Eve", "Awan", "Eve" ],
   *  values:  [10, 14, 12, 10, 2, 6, 6, 4, 4],
   * }]
   */
  get_sunburst_data(years = [2020]) {
    const aggregateData = this.get_aggregate_data(years);

    let data = {
      name: 'main',
      children: [],
    };

    for (const [grade, numStudents] of Object.entries(aggregateData)) {
      const parent = grade[0] + 's';
      if (data.children.find((elem) => elem.name === parent)) {
        // Last elem will be current grade
        data.children[data.children.length - 1].children.push({
          name: grade,
          numStudents,
        });
      } else {
        data.children.push({ name: parent, children: [] });
      }
    }

    return data;
  }

  /**
   * See https://plotly.com/javascript/bar-charts/
   * Example data:
   * [{
   *  type: "bar",
   *  x: ['giraffes', 'orangutans', 'monkeys'],
   *  y: [20, 14, 23],
   *  color: ["red", "green", "blue"]
   * }]
   */
  get_barchart_data(years = [2020]) {
    const aggregateData = this.get_aggregate_gpa(years);

    let data: { gpa: string; numStudents: number }[] = [];

    for (let [gpa, numStudents] of Object.entries(aggregateData)) {
      data.push({
        gpa: gpa,
        numStudents: numStudents,
      });
    }

    return data;
  }

  /**
   * Converts a Course class to a simple JSON representation used in the JSONCourseContext
   */
  to_dict(): IJSONCourse {
    return {
      subject: this.subject,
      number: this.number,
    };
  }

  /**
   * Determines if a course equals another Course or JSONCourse
   */
  equals(c: IJSONCourse | Course) {
    return this.subject === c.subject && this.number === c.number;
  }
}
