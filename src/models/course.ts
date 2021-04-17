import * as d3 from 'd3';
import { IJSONCourse } from '../type';

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
    4.0,
    3.67,
    3.33,
    3.0,
    2.67,
    2.33,
    2.0,
    1.67,
    1.33,
    1.0,
    0.67,
    0.33,
    0.0,
  ];

  constructor(subject: string, number: number, data: d3.DSVParsedArray<any>) {
    this.subject = subject;
    this.number = number;
    this.shortName = subject + ' ' + number;
    this.data = data;
    this.title = this.get_course_title();
  }

  static grade_to_gpa(grade: string): string {
    /**
     * CONVERTS A LETTER GRADE TO A GPA
     *
     * @returns number
     */
    if (grade.length > 2) {
      return 'NaN';
    }

    if (grade === 'F') return '0';
    if (grade === 'A+') return '4';

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
        return 'NaN';
    }
    if (grade.length === 1) return gpa.toFixed(2);
    if (grade[1] === '+') return (gpa + 0.33).toFixed(2);
    if (grade[1] === '-') return (gpa - 0.33).toFixed(2);
    return 'NaN';
  }

  static gpa_to_grade(gpa: number): string {
    let strGpa = gpa.toFixed(2);

    const grades = [
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
    const gpas = [
      4,
      3.67,
      3.33,
      3,
      2.67,
      2.33,
      2,
      1.67,
      1.33,
      1,
      0.67,
      0,
    ].map((num) => num.toFixed(2));

    return grades[gpas.indexOf(strGpa)];
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
    return '';
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
  getAggregateData(years = [2020]): { [key: string]: number } {
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
  getAggregateGpa(years = [2020]): { [key: number]: number } {
    const fittedDataset = this.get_fitted_dataset(years);
    let output: { [key: string]: number } = {};
    for (const grade of Course.possibleGrades) {
      const gpa = Course.grade_to_gpa(grade);
      output[gpa] = 0;
    }
    for (let row of fittedDataset) {
      for (const grade of Course.possibleGrades) {
        const gpa = Course.grade_to_gpa(grade);
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
    let labels: string[] = [];
    let parents: string[] = [];
    let values: number[] = [];

    let bucketData: { [key: string]: number } = {
      As: 0,
      Bs: 0,
      Cs: 0,
      Ds: 0,
      Fs: 0,
    };

    const aggregateData = this.getAggregateData(years);

    for (const [grade, num_students] of Object.entries(aggregateData)) {
      const parent = grade[0] + 's';
      bucketData[parent] += num_students;
      labels.push(grade);
      parents.push(parent);
      values.push(num_students);
    }

    for (const [parent, num_students] of Object.entries(bucketData)) {
      labels.push(parent);
      parents.push('');
      values.push(num_students);
    }

    return {
      labels,
      values,
      parents,
    };
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