import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  Divider,
  List,
  ListItem,
  ListIcon,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `https://swanirbharapi.onrender.com/courses/${id}`
        );
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <Container maxW="container.xl">
        <Box padding="6" boxShadow="lg" bg="white">
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        </Box>
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container maxW="container.xl">
        <Box p={12}>
          <Text>Error fetching course. Please try again later.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" py={12}>
        <Heading fontSize="3xl">{course.course}</Heading>
        <Text fontSize="xl" color="gray.600" mt={2}>
          {course.description}
        </Text>
        <Badge
          variant="solid"
          colorScheme="teal"
          fontSize="xl"
          mt={4}
          px={2}
          py={1}
        >
          {course.category}
        </Badge>
        <Divider mt={6} mb={4} />
        <Heading fontSize="xl">Lessons</Heading>
        <List spacing={3} mt={2}>
          {course.lessons.map((lesson) => (
            <ListItem key={lesson.id} display="flex" alignItems="center">
              <ListIcon
                as={lesson.completed ? "check-circle" : "minus-circle"}
                color={lesson.completed ? "green.500" : "gray.400"}
                fontSize="lg"
                mr={2}
              />
              <Text
                fontSize="md"
                color={lesson.completed ? "green.500" : "gray.600"}
              >
                {lesson.title}
              </Text>
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default CourseDetail;
