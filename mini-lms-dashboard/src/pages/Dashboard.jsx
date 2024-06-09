import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Heading,
  Container,
  SimpleGrid,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  Divider,
  ButtonGroup,
  Button,
  Spinner,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, CardFooter } from "@chakra-ui/react";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const isAuth = Cookies.get("isLoggedIn");
  const userId = Cookies.get("userId");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://swanirbharapi.onrender.com/courses");
        setCourses(response.data);
        setFilteredCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filterCourses = () => {
      let filtered = courses;
  
      if (searchTerm) {
        filtered = filtered.filter((course) =>
          course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
  
      if (category) {
        filtered = filtered.filter(
          (course) =>
            course.category && course.category.toLowerCase() === category.toLowerCase()
        );
      }
  
      setFilteredCourses(filtered);
    };
  
    filterCourses();
  }, [searchTerm, category, courses]);
  

  const handleEnroll = async (courseId) => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    try {
      const courseResponse = await axios.get(
        `https://swanirbharapi.onrender.com/courses/${courseId}`
      );
      const courseData = courseResponse.data;

      const userResponse = await axios.get(
        `https://swanirbharapi.onrender.com/users/${userId}`
      );
      const userData = userResponse.data;

      // Check if the course is already enrolled
      if (userData.selectedCourse.some((course) => course.id === courseId)) {
        toast({
          title: "Already Enrolled",
          description: "You are already enrolled in this course.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Ensure the course is not already selected
      const updatedSelectedCourses = [...userData.selectedCourse, courseData];

      await axios.patch(`https://swanirbharapi.onrender.com/users/${userId}`, {
        selectedCourse: updatedSelectedCourses,
      });

      toast({
        title: "Course Added",
        description: "You have successfully enrolled in the course.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
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
            Error loading courses. Please try again later.
          </Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Box bgGradient="linear(to-t, teal.400, cyan.400)" minH="100vh" pb="10">
      <Navbar />
      <Container maxW="container.xl" px={4} py={10}>
        <Flex direction="column" align="center" mb={10}>
          <Heading as="h2" size="xl" mb={6} color="white">
            Our Courses
          </Heading>
          <Flex
            mb={6}
            direction={{ base: "column", md: "row" }}
            align="center"
            gap={4}
          >
            <Input
              placeholder="Search Courses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxWidth="300px"
              bg="white"
            />
            <Select
              placeholder="Filter by Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxWidth="300px"
              bg="white"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </Select>
          </Flex>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Card key={course.id} maxW="sm" bg="white" boxShadow="md">
                <CardBody>
                  <Image
                    src="https://via.placeholder.com/350x250"
                    alt={course.title}
                    height="250px"
                    width="100%"
                    objectFit="cover"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading fontSize="xl" color="gray.800">
                      {course.course}
                    </Heading>
                    <Text color="gray.600">{course.description}</Text>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Button colorScheme="teal" variant="solid">
                      <Link to={`/courses/${course.id}`}>View Details</Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Text>No courses available.</Text>
          )}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Dashboard;
