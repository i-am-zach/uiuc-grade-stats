import * as d3 from "d3";

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
