import React, { createContext, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { getGradesData } from '../utils';

export const GradeDataContext = createContext<d3.DSVParsedArray<any> | null>(
  null,
);

export const GradeDataProvider: React.FC = ({ children }) => {
  useEffect(() => {
    getGradesData().then((data) => setGradeData(data));
  }, []);
  const [gradeData, setGradeData] = useState<d3.DSVParsedArray<any> | null>(
    null,
  );

  return (
    <GradeDataContext.Provider value={gradeData}>
      {children}
    </GradeDataContext.Provider>
  );
};
