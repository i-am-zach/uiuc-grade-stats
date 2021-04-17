// @ts-nocheck

import React from 'react';
import Content from './home.mdx';
import { Box, Heading, Text, Link, Code, Divider, UnorderedList, OrderedList, ListItem } from '@chakra-ui/layout';
import { MDXProvider } from '@mdx-js/react';

const components = {
  h1: (props) => <Heading id={props.children} size="2xl" pb="3" pt="8" {...props} />,
  h2: (props) => (
    <>
      <Heading size="xl" pb="3" pt="2" {...props} />
      <Divider />
    </>
  ),
  h3: (props) => (
    <>
      <Heading size="lg" pb="3" pt="1" {...props} />
    </>
  ),
  p: (props) => <Text fontSize="xl" pb="3" {...props} />,
  a: ({ href, ...rest }) => (
    <a href={href}>
      <Link color="blue.400" {...rest} />
    </a>
  ),
  inlineCode: (props) => <Code {...props} />,
  ul: (props) => <UnorderedList {...props} />,
  ol: (props) => <OrderedList {...props} />,
  li: (props) => <ListItem fontSize="xl" {...props} />,
};

export const Home = () => {
  return (
    <Box p="4">
      <MDXProvider components={components}>
        <Content />
      </MDXProvider>
    </Box>
  );
};
