import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Courses, Home, ErrorPage } from './pages';
import { CourseProvider, GradeDataProvider } from './context';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <CourseProvider>
        <GradeDataProvider>
          <Router>
            <div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/my-courses">My Courses</Link>
                  </li>
                  <li>
                    <Link to="/search">Search Courses</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <Switch>
              <Route path="/my-courses">
                <Courses />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="*">
                <ErrorPage />
              </Route>
            </Switch>
          </Router>
        </GradeDataProvider>
      </CourseProvider>
    </ChakraProvider>
  );
}

export default App;
