import Course from "./models/course";
import Papa from "papaparse";

interface IJSONCourse {
    subject: string;
    number: number;
}

type JSONCourseContextProps = {
    courses: IJSONCourse[]
    addCourse: (course: IJSONCourse) => void
    removeCourse: (course: IJSONCourse) => void
    includes: (course: IJSONCourse) => boolean
}