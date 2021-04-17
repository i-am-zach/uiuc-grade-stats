import { Box, Text, Stack, Flex, Button } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IlliniosLogo from '../uiuc-I.svg';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        w="100%"
        background="gray.100"
        mb={4}
        p={8}
      >
        <Logo />
        <MenuToggle isOpen={isOpen} toggle={toggle} />
        <MenuLinks isOpen={isOpen} />
      </Flex>
    </Box>
  );
};

const Logo: React.FC = (props) => {
  return (
    <Flex align="center">
      <Box h="10" pr={3}>
        <img src={IlliniosLogo} alt="UIUC Logo" style={{ height: '100%' }} />
      </Box>
      <Box>
        <Text fontSize="xl" fontWeight="bold">
          UIUC Course Statistics
        </Text>
        <Text fontSize="xs">By Zach Lefkovitz</Text>
      </Box>
    </Flex>
  );
};

const MenuLinks: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <Box
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      flexBasis={{ base: '100%', md: 'auto' }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        pt={[4, 4, 0, 0]}
      >
        <MenuItem to="/">Home</MenuItem>
        <MenuItem to="/my-courses">My Courses</MenuItem>
        <MenuItem to="/search">Search</MenuItem>
      </Stack>
    </Box>
  );
};

const MenuItem: React.FC<{ to: string }> = ({ to, children }) => {
  return (
    <Link to={to}>
      <Button variant="ghost">{children}</Button>
    </Link>
  );
};

const MenuToggle: React.FC<{ isOpen: boolean; toggle: Function }> = ({
  isOpen,
  toggle,
}) => {
  return (
    <Box display={{ base: 'block', md: 'none' }} onClick={() => toggle()}>
      {isOpen ? <CloseIcon /> : <HamburgerIcon />}
    </Box>
  );
};

export default Navbar;
