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

  constructor(subject: string, number: number, data: d3.DSVParsedArray<any>) {
    this.subject = subject;
    this.number = number;
    this.shortName = subject + ' ' + number;
    this.data = data;
    this.title = this.get_course_title();
  }

  static grade_to_gpa(grade: string): number {
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

  private get_course_title() {
    for (const row of this.data) {
      if (row['Number'] === this.number && row['Subject'] === this.subject) {
        return row['Course Title'];
      }
    }
  }

  private get_fitted_dataset(years: number[]) {
    return this.data.filter(
      (d) =>
        d['Subject'] === this.subject &&
        d['Number'] === this.number &&
        years.includes(d['Year']),
    );
  }

  get_aggregate_data(years = [2020]) {
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

  get_aggregate_gpa(years = [2020]) {
    const fittedDataset = this.get_fitted_dataset(years);
    let output: { [key: number]: number } = {};
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

  get_sunburst_data(years = [2020]) {
    let labels: string[] = [];
    let parents: string[] = [];
    let values: number[] = [];

    let bucketData = {
      As: 0,
      Bs: 0,
      Cs: 0,
      Ds: 0,
      Fs: 0,
    };

    const aggregateData = this.get_aggregate_data(years);

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

  get_barchart_data(years = [2020]) {
    const aggregateData = this.get_aggregate_data(years);

    let x = [];
    let y = [];
    let color: string[] = [];

    for (const [grade, num_students] of Object.entries(aggregateData)) {
      const gpa = Course.grade_to_gpa(grade);
      x.push(gpa);
      y.push(num_students);
      color.push(getColorFromGrade(grade));
    }

    return {
      x,
      y,
      color,
    };
  }

  to_dict(): IJSONCourse {
    return {
      subject: this.subject,
      number: this.number,
    };
  }

  equals(c: IJSONCourse | Course) {
    return this.subject === c.subject && this.number === c.number;
  }
}
