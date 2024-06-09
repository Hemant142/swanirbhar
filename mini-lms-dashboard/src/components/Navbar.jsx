import React from 'react';
import { 
  Box, 
  Flex, 
  HStack, 
  Link, 
  IconButton, 
  Button, 
  useDisclosure, 
  useColorModeValue, 
  Stack,
  Heading
} from '@chakra-ui/react';
import Cookies from 'js-cookie'; 
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const Links = (isTeach) => {
  if (isTeach) {
    return [{ name: 'Teacher Page', path: '/teacherpage' }];
  } else {
    return [
      { name: 'Home', path: '/' },
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'My Courses', path: '/course', auth: true },
      { name: 'User Profile', path: '/userprofile', auth: true },
    ];
  }
};

const Navbar = () => {
  const isLoggedIn = Cookies.get('isLoggedIn') === 'true' ? true : false; // Check if user is logged in
  const isTeach = Cookies.get('teach') === 'true' ? true : false;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const bg = useColorModeValue('teal.500', 'teal.900');
  const hoverBg = useColorModeValue('teal.300', 'teal.700');
  const textColor = useColorModeValue('white', 'white');

  return (
    <>
      <Box bg={bg} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Heading color={textColor} size="md">
                {isTeach ? 'Teacher Dashboard' : 'Student Dashboard'}
              </Heading>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links(isTeach).map((link) =>
                (link.auth === undefined || link.auth === isLoggedIn) ? (
                  <Link
                    key={link.name}
                    as={RouterLink}
                    to={link.path}
                    px={2}
                    py={1}
                    rounded={'md'}
                    _hover={{
                      textDecoration: 'none',
                      bg: hoverBg,
                    }}
                    color={textColor}
                  >
                    {link.name}
                  </Link>
                ) : null
              )}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            {isLoggedIn ? (
              <Button
                as={RouterLink}
                to="/login"
                colorScheme={'teal'}
                variant={'solid'}
                onClick={() => {
                  Cookies.remove('isLoggedIn');
                  Cookies.remove('userData');
                  Cookies.remove('teach')
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                as={RouterLink}
                to="/login"
                colorScheme={'teal'}
                variant={'solid'}
              >
                Login
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links(isTeach).map((link) =>
                (link.auth === undefined || link.auth === isLoggedIn) ? (
                  <Link
                    key={link.name}
                    as={RouterLink}
                    to={link.path}
                    px={2}
                    py={1}
                    rounded={'md'}
                    _hover={{
                      textDecoration: 'none',
                      bg: hoverBg,
                    }}
                    color={textColor}
                  >
                    {link.name}
                  </Link>
                ) : null
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Navbar;
