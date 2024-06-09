import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useColorModeValue,
  Text,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://swanirbharapi.onrender.com/users');
        const userData = response.data;
        localStorage.setItem('userData', JSON.stringify(userData));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const user = userData.find(user => user.email === email && user.password === password);

      if (!user) {
        setError('Invalid email or password.');
        return;
      }

      setError('');
      
      Cookies.set('isLoggedIn', 'true');
      Cookies.set('userId', user.id);

      if (email === "teacher@gmail.com" && password === "teacher@123") {
        Cookies.set('teach', 'true');
        navigate('/teacherpage');
      } else {
        navigate('/');
      }
      
      toast({
        title: 'Login successful',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setError('Invalid email or password.');
      console.error('Login error:', error);
      toast({
        title: 'Login error',
        description: 'An error occurred during login. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Navbar/>
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={useColorModeValue('gray.50', 'gray.800')}
        p={4}
      >
        <Box
          maxW={{ base: 'sm', md: 'md', lg: 'lg' }}
          w="full"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="lg"
          rounded="lg"
          p={6}
          m={4}
        >
          <Heading as="h2" size="xl" mb={6} textAlign="center" color="teal.500">
            Login
          </Heading>
          <Stack spacing={4} as="form" onSubmit={handleLogin}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </FormControl>
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Button type="submit" colorScheme="teal" size="lg" mt={4} w="full">
              Login
            </Button>
            <Text textAlign="center" mt={4}>
              Create an account?{' '}
              <Link as={RouterLink} to="/signup" color="teal.500">
                Signup
              </Link>
            </Text>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
