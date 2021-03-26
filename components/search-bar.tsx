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
import { JSONCourseContext } from '../contexts';
import { css } from '@emotion/react';
import { IJSONCourse } from '../type';

type SearchBarProps = {
  courses: { [key: string]: number[] };
  gradesData: d3.DSVParsedArray<any>;
};

type SearchBarState = {
  placeholder: string;
  options: string[];
  search: string;
  searchError: string;
};

type SearchItemProps = {
  gradesData: d3.DSVParsedArray<any>;
  option: string;
};

const SearchItem = ({ option, gradesData }: SearchItemProps) => {
  const { addCourse, removeCourse, courses } = useContext(JSONCourseContext);
  const [isOpen, setIsOpen] = useState(false);
  const [includes, setIncludes] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  const [subject, number] = option.split(' ');
  const course = new Course(subject, parseInt(number), gradesData);

  useEffect(() => {
    let found = false;
    for (const c of courses) {
      if (course.equals(c)) {
        found = true;
        break;
      }
    }
    setIncludes(found);
  }, [courses]);

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
              <Button ref={cancelRef} onClick={onClose}>
                Close
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
        <Link onClick={onLinkClick}>{includes ? `Remove` : `Add`} course</Link>
      </Box>
    </React.Fragment>
  );
};

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);

    this.state = {
      placeholder: '',
      options: [],
      search: '',
      searchError: '',
    };
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange = (e) => {
    const newSearch: string = e.target.value;
    this.setState((state) => ({
      ...state,
      search: newSearch,
    }));

    const updatedOptions = new Promise<string[]>((resolve, reject) => {
      const words: string[] = newSearch.split(' ');
      if (words.length >= 3) return [];
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
      if (words.length === 2 && !!!words[1]) {
        const subject = words[0];
        const numbers = this.props.courses[subject];
        return resolve(numbers.map((num) => subject + ' ' + num));
      }
      if (words.length === 1) {
        if (!!!words[0]) return resolve([]);

        const subjectPartial = words[0];
        let output: string[] = [];
        const subjectMatches = Object.keys(
          this.props.courses,
        ).filter((subject) => subject.startsWith(subjectPartial));
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
        console.log(errorMessage);
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
            placeholder={this.state.placeholder || 'Search for a course'}
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
