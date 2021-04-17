import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Courses, Home, ErrorPage, SearchPage } from './pages';
import { CourseProvider, GradeDataProvider } from './context';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';

function App() {
  return (
    <CourseProvider>
      <GradeDataProvider>
        <ChakraProvider>
          <Box>
            <Router>
              <Navbar />
              <Switch>
                <Route path="/my-courses">
                  <Courses />
                </Route>
                <Route path="/search">
                  <SearchPage />
                </Route>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="*">
                  <ErrorPage />
                </Route>
              </Switch>
            </Router>
          </Box>
        </ChakraProvider>
      </GradeDataProvider>
    </CourseProvider>
  );
}

export default App;
