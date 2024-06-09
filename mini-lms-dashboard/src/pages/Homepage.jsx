import React from 'react';
import Navbar from '../components/Navbar';
import { Box, Flex, Heading, Text, Button, Image, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

export default function Homepage() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGetStarted = () => {
    navigate('/dashboard'); // Navigate to the /dashboard page
  };

  return (
    <Box>
      <Navbar />
      <Box
        bgSize="cover"
        bgPosition="center"
        minHeight="calc(100vh - 64px)"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgGradient="linear(to-t, teal.400, cyan.400)"
      >
        <Flex
          direction="column"
          p="6"
          rounded="md"
          boxShadow="xl"
          bg="white"
          maxW="lg"
          textAlign="center"
          animation="fadeIn 2s ease-in-out"
        >
          <Image src="https://blog.planview.com/wp-content/uploads/2017/08/Tip_1_Juggling-too-many-task-Gif_Twitter.gif" alt="Logo" mb="4" borderRadius="md" />
          <Heading mb="4" color="gray.800">
            Welcome to the Student Dashboard
          </Heading>
          <Text mb="8" color="gray.600">
            This is where you can manage your student activities.
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing="4" justifyContent="center">
            <Button colorScheme="blue" size="lg" onClick={handleGetStarted}>
              Get Started
            </Button>
            <Button colorScheme="teal" size="lg">
              Learn More
            </Button>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
}
