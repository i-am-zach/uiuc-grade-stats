import {
  ChakraProvider,
  Flex,
  Box,
  Heading,
  Text,
  Link,
} from '@chakra-ui/react';
import { JSONCourseProvider } from '../contexts';
import SideBar from '../components/sidebar';
import { MDXProvider } from '@mdx-js/react';

const components = {
  h1: (props) => (
    <Heading size="2xl" pb={5}>
      {props.children}
    </Heading>
  ),
  h2: (props) => (
    <Heading size="xl" pb={5}>
      {props.children}
    </Heading>
  ),
  h3: (props) => (
    <Heading size="lg" pb={4}>
      {props.children}
    </Heading>
  ),
  p: (props) => (
    <Text pb={4} fontSize="lg">
      {props.children}
    </Text>
  ),
  a: (props) => <Link href={props.href} color="blue.400">{props.children}</Link>,
};

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS>
      <JSONCourseProvider>
        <Flex>
          <SideBar></SideBar>
          <Box w="full" px={12} py={4}>
            <MDXProvider components={components}>
              <Component {...pageProps} />
            </MDXProvider>
          </Box>
        </Flex>
      </JSONCourseProvider>
    </ChakraProvider>
  );
}

export default MyApp;
