import React from 'react';
import { Box, Text, Button, Link, Heading, VStack } from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';

export default function Sidebar() {
  return (
    <Box minW={{ base: '200px', md: '250px' }} minH="100vh">
      <Box
        position="fixed"
        top="0"
        left="0"
        bottom="0"
        minW={{ base: '200px', md: '250px' }}
        background="gray.100"
        p={5}
      >
        <VStack spacing={3} align="start">
          <NextLink href="/">
            <Link>
              <Heading size="md">UIUC Grade Statistics</Heading>
            </Link>
          </NextLink>
          <NextLink href="/my-courses">
            <Button leftIcon={<StarIcon />} isFullWidth={true}>
              <Text color="gray.700">My Courses</Text>
            </Button>
          </NextLink>
          <NextLink href="/search">
            <Button leftIcon={<SearchIcon />} isFullWidth={true}>
              <Text color="gray.700">Search</Text>
            </Button>
          </NextLink>
        </VStack>
      </Box>
    </Box>
  );
}
