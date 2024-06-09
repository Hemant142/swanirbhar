import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
  Divider,
  Button,
  Flex,
  Spinner,
  Badge,
  ButtonGroup,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Cookies from "js-cookie";
import axios from "axios";

export default function Course() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://swanirbharapi.onrender.com/users/${userId}`
        );
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLessonCompletion = async (courseId, lessonId) => {
    const updatedUserData = { ...userData };
    const course = updatedUserData.selectedCourse.find(
      (course) => course.id === courseId
    );
    const lesson = course.lessons.find((lesson) => lesson.id === lessonId);
    lesson.completed = true;

    try {
      await axios.patch(
        `https://swanirbharapi.onrender.com/users/${userId}`,
        updatedUserData
      );
      setUserData(updatedUserData);
    } catch (error) {
      console.error("Error updating lesson completion:", error);
    }
  };

  const getFilteredCourses = () => {
    if (filter === "all") {
      return userData.selectedCourse;
    }
    if (filter === "completed") {
      return userData.selectedCourse.filter((course) =>
        course.lessons.every((lesson) => lesson.completed)
      );
    }
    if (filter === "uncompleted") {
      return userData.selectedCourse.filter((course) =>
        course.lessons.every((lesson) => !lesson.completed)
      );
    }
    if (filter === "partial") {
      return userData.selectedCourse.filter(
        (course) =>
          course.lessons.some((lesson) => lesson.completed) &&
          course.lessons.some((lesson) => !lesson.completed)
      );
    }
  };

  const getCourseStatus = (course) => {
    if (course.lessons.every((lesson) => lesson.completed)) {
      return "completed";
    }
    if (course.lessons.every((lesson) => !lesson.completed)) {
      return "uncompleted";
    }
    return "partial";
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

  const filteredCourses = getFilteredCourses();

  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" px={4} py={10}>
        <Heading as="h2" size="xl" mb={6} color="gray.800" textAlign="center">
          Selected Courses
        </Heading>
        <Flex justifyContent="center" mb={4}>
          <ButtonGroup>
            <Button colorScheme="teal" onClick={() => setFilter("all")}>
              All ({userData.selectedCourse.length})
            </Button>
            <Button colorScheme="green" onClick={() => setFilter("completed")}>
              Completed (
              {
                userData.selectedCourse.filter((course) =>
                  course.lessons.every((lesson) => lesson.completed)
                ).length
              }
              )
            </Button>
            <Button colorScheme="red" onClick={() => setFilter("uncompleted")}>
              Incompleted (
              {
                userData.selectedCourse.filter((course) =>
                  course.lessons.every((lesson) => !lesson.completed)
                ).length
              }
              )
            </Button>
            <Button colorScheme="orange" onClick={() => setFilter("partial")}>
              Partial (
              {
                userData.selectedCourse.filter(
                  (course) =>
                    course.lessons.some((lesson) => lesson.completed) &&
                    course.lessons.some((lesson) => !lesson.completed)
                ).length
              }
              )
            </Button>
          </ButtonGroup>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              maxW="md"
              bg="white"
              boxShadow="md"
              rounded="lg"
            >
              <Image
                src="https://via.placeholder.com/350x250"
                alt={course.title}
                height="250px"
                objectFit="cover"
                borderTopRadius="lg"
              />
              <CardBody>
                <Stack spacing="3">
                  <Heading fontSize="xl" color="gray.800" textAlign="center">
                    {course.course}
                  </Heading>
                  <Text color="gray.600" textAlign="center">
                    {course.description}
                  </Text>
                  <Badge
                    colorScheme={
                      getCourseStatus(course) === "completed"
                        ? "green"
                        : getCourseStatus(course) === "uncompleted"
                        ? "red"
                        : "orange"
                    }
                  >
                    {getCourseStatus(course)}
                  </Badge>
                  <Divider />
                  <Text fontWeight="bold" mt="2">
                    Lessons:
                  </Text>
                  {course.lessons.map((lesson) => (
                    <Flex
                      key={lesson.id}
                      justifyContent="space-between"
                      alignItems="center"
                      px="4"
                    >
                      <Text color={lesson.completed ? "green.500" : "gray.800"}>
                        {lesson.title}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme={lesson.completed ? "green" : "blue"}
                        onClick={() =>
                          handleLessonCompletion(course.id, lesson.id)
                        }
                        isDisabled={lesson.completed}
                      >
                        {lesson.completed ? "Completed" : "Complete"}
                      </Button>
                    </Flex>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
