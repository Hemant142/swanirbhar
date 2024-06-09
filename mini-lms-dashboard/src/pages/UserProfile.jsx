import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Progress,
  Flex,
  Spinner,
  Divider,
  Button,
  Input,
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toggle,setToggle]=useState(false)
  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
    password: '',
  });
  const userId = Cookies.get('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://swanirbharapi.onrender.com/users/${userId}`);
        setUserData(response.data);
        setEditedUser({
          username: response.data.username,
          email: response.data.email,
          password: response.data.password,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, toggle]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(`https://swanirbharapi.onrender.com/users/${userId}`, editedUser);
      setToggle(!toggle)
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const calculateProgress = (lessons) => {
    const completedLessons = lessons.filter(lesson => lesson.completed).length;
    const totalLessons = lessons.length;
    return (completedLessons / totalLessons) * 100;
  };

  if (loading) {
    return (
      <Container maxW="container.xl" px={4} py={10}>
        <Flex justifyContent="center" alignItems="center">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" px={4} py={10}>
        <Flex justifyContent="center" alignItems="center">
          <Text color="red.500">
            Error loading user profile. Please try again later.
          </Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" px={4} py={10}>
        <Heading as="h2" size="xl" mb={6} color="gray.800" textAlign="center">
          User Profile
        </Heading>
        <Box mb={10}>
          <Card>
            <CardBody>
              <Stack spacing={4}>
                <Heading as="h4" size="md" color="gray.600">
                  User Details
                </Heading>
                {!isEditing ? (
                  <>
                    <Text><strong>Username:</strong> {userData.username}</Text>
                    <Text><strong>Email:</strong> {userData.email}</Text>
                    <Button colorScheme="teal" onClick={handleEdit}>Edit</Button>
                  </>
                ) : (
                  <>
                    <Stack spacing={4}>
                      <Input
                        type="text"
                        name="username"
                        value={editedUser.username}
                        onChange={handleInputChange}
                        placeholder="Username"
                        mb={2}
                      />
                      <Input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        mb={2}
                      />
                      <Input
                        type="password"
                        name="password"
                        value={editedUser.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        mb={2}
                      />
                    </Stack>
                    <Button colorScheme="teal" onClick={handleSubmit} mb={2}>Save</Button>
                  </>
                )}
              </Stack>
            </CardBody>
          </Card>
        </Box>
        <Divider mb={10} />
        <Heading as="h4" size="md" color="gray.600" mb={4}>
          Course Progress
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {userData.selectedCourse.map(course => (
            <Card key={course.id} maxW="sm" bg="white" boxShadow="md">
              <CardBody>
                <Stack spacing={3}>
                  <Heading fontSize="lg" color="gray.800">
                    {course.course}
                  </Heading>
                  <Text color="gray.600">{course.description}</Text>
                  <Progress
                    value={calculateProgress(course.lessons)}
                    colorScheme="teal"
                    size="md"
                    borderRadius="lg"
                  />
                  <Text color="gray.600">
                    {calculateProgress(course.lessons).toFixed(2)}% Complete
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
