// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Input,
  Text,
  SimpleGrid,
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Link,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';
import Course from '../models/course';
import * as d3 from 'd3';
import { CourseContext as JSONCourseContext } from '../context';
import { css } from '@emotion/react';

type SearchBarProps = {
  courses: { [key: string]: string[] };
  gradesData: d3.DSVParsedArray<any>;
};

type SearchBarState = {
  options: string[];
  search: string;
  searchError: string;
};

type SearchItemProps = {
  gradesData: d3.DSVParsedArray<any>;
  option: string;
};

/**
 *
 * @param option string: A string representation of a course
 *    Ex: MATH 286 or CS 173
 * @returns
 */
const SearchItem = ({ option, gradesData }: SearchItemProps) => {
  // The methods from the JSONCourseContext
  const { addCourse, removeCourse, courses } = useContext(JSONCourseContext);
  // The hooks for the confirmation popup that shows after adding/removing a course
  const [isOpen, setIsOpen] = useState(false);
  // Whether or not the course is included in the array of JSON Courses
  const [includes, setIncludes] = useState(false);
  // Method called when the popup is closed
  const onClose = () => setIsOpen(false);
  // Requried for a the chakra-ui popup
  const cancelRef = React.useRef();
  const [subject, number] = option.split(' ');
  // The course model derived from the option

  useEffect(() => {
    // Determines if the course is in the JSON Courses Array
    let found = false;
    for (const c of courses || []) {
      if (course.equals(c)) {
        found = true;
        break;
      }
    }
    setIncludes(found);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses]);

  const course = new Course(subject, parseInt(number), gradesData);

  const onLinkClick = () => {
    if (includes) {
      removeCourse(course.to_dict());
      setIsOpen(true);
    } else {
      addCourse(course.to_dict());
      setIsOpen(true);
    }
  };

  return (
    <React.Fragment>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {includes ? `Added Course` : `Removed Course`}
            </AlertDialogHeader>

            <AlertDialogBody>
              {course.shortName}: {course.title}
            </AlertDialogBody>

            <AlertDialogFooter textAlign="center">
              <Button ref={cancelRef} onClick={onClose} colorScheme="blue">
                Okay
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box
        border="2px solid #d6d6d6"
        borderRadius="0.5rem"
        p={3}
        sx={{
          ':hover': {
            borderColor: 'lightblue',
            boxShadow: '2px 2px 2px #c5e5f0, -2px -2px 2px #c5e5f0',
            cursor: 'pointer',
          },
        }}
      >
        <Text size="xl">{option}</Text>
        <Text fontWeight="semibold">{course.title}</Text>
        <Link onClick={onLinkClick} color={includes ? 'red.500' : 'blue.500'}>
          {includes ? `Remove` : `Add`} course
        </Link>
      </Box>
    </React.Fragment>
  );
};

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);

    this.state = {
      // An array of string representation of courses that match the current search term.
      // Default to an empty array instead of displaying all the courses with an empty search for
      // performance reasons
      options: [],
      // The value of the input
      search: '',
      // An error message
      searchError: '',
    };
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch: string = e.target.value;
    this.setState((state) => ({
      ...state,
      search: newSearch,
    }));

    /**
     * Asychronously gets the updated coures options that match the search term
     * The algoritithm for finding for matches is simplying returning every instance that the
     * search term starts with (a "perfect" match). Therefore, this search DOES NOT account for the course title, only the
     * coures subject and number.
     */
    const updatedOptions = new Promise<string[]>((resolve, reject) => {
      const words: string[] = newSearch.split(' ');
      // If the search contains more than three words, there will be no matches
      if (words.length >= 3) return [];
      // Case for search terms and the second term is not whitespace
      if (words.length === 2 && words[1]) {
        const subject = words[0];
        const numPartial = words[1];
        const numbers = this.props.courses[subject];
        let output = [];
        for (const num of numbers) {
          if (num.toString().startsWith(numPartial)) {
            output.push(subject + ' ' + num);
          }
        }
        return resolve(output);
      }
      // Case for search terms and the second term is whitespace
      if (words.length === 2 && !!!words[1]) {
        const subject = words[0];
        const numbers = this.props.courses[subject];
        return resolve(numbers.map((num) => subject + ' ' + num));
      }
      // Case for a single, incomplete search term
      // ex: EN when searching for ENG
      // ex: MAT when searching for MATH
      if (words.length === 1) {
        if (!!!words[0]) return resolve([]);
        const subjectPartial = words[0];
        let output: string[] = [];

        const subjectMatches = Object.keys(
          this.props.courses,
        ).filter((subject) => subject.startsWith(subjectPartial));

        // If there are more than ten subjects the match the search partial
        // do not return anything because the search is too slow
        if (subjectMatches.length > 10) {
          return resolve([]);
        }
        for (const subject of subjectMatches) {
          for (const num of this.props.courses[subject]) {
            output.push(subject + ' ' + num);
          }
        }
        return resolve(output);
      }
      reject('Something went wrong');
    });

    updatedOptions
      .then((newOptions) => {
        let errorMessage = '';
        if (newOptions.length === 0) {
          if (newSearch && newSearch.toLowerCase() === newSearch) {
            errorMessage = `No matches. Make sure to type the course's subject in all caps.`;
          }
        }
        this.setState((state) => {
          return {
            ...state,
            options: newOptions,
            searchError: errorMessage,
          };
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    const styles = {
      selected: css`
        font-size: 1.5rem;
        height: 3rem;
        margin-top: 3rem;
        border-color: #3182ce;
        box-shadow: 0 0 0 1px #3182ce;
      `,
    };

    return (
      <>
        <FormControl isInvalid={!!this.state.searchError}>
          <Input
            placeholder={'Search for a course'}
            sx={{
              ':focus': {
                fontSize: '1.5rem',
                height: '3rem',
                marginTop: '3rem',
              },
            }}
            css={this.state.search.length > 0 ? styles.selected : null}
            value={this.state.search}
            onChange={this.onInputChange}
          />
          <FormHelperText>Ex: CS 101 or MATH 286</FormHelperText>
          <FormErrorMessage>{this.state.searchError}</FormErrorMessage>
        </FormControl>
        <Box pt={4}>
          <SimpleGrid columns={[1, 2, 3]} spacingY={2} spacingX={4}>
            {this.state.options.map((option) => (
              <SearchItem
                key={option}
                option={option}
                gradesData={this.props.gradesData}
              ></SearchItem>
            ))}
          </SimpleGrid>
        </Box>
      </>
    );
  }
}

export default SearchBar;
