import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

import {
  Box,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  useToast,
  useBreakpointValue,
  Heading,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { HiChevronDown, HiOutlineChevronUp } from 'react-icons/hi';

export default function TeacherPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
  const [isLessonVisible, setIsLessonVisible] = useState({});
  const toast = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://swanirbharapi.onrender.com/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsEditCourseModalOpen(true);
  };

  const handleEditLesson = (lesson, courseId) => {
    const course = courses.find(course => course.id === courseId);
    setSelectedCourse(course);
    setSelectedLesson({ ...lesson, courseId });
    setIsEditLessonModalOpen(true);
  };

  const handleCloseEditCourseModal = () => {
    setIsEditCourseModalOpen(false);
  };

  const handleCloseEditLessonModal = () => {
    setIsEditLessonModalOpen(false);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(prevCourse => ({
      ...prevCourse,
      course: e.target.value
    }));
  };

  const handleCourseDescriptionChange = (e) => {
    setSelectedCourse(prevCourse => ({
      ...prevCourse,
      description: e.target.value
    }));
  };

  const handleCourseCategoryChange = (e) => {
    setSelectedCourse(prevCourse => ({
      ...prevCourse,
      category: e.target.value
    }));
  };

  const handleLessonTitleChange = (e) => {
    setSelectedLesson(prevLesson => ({
      ...prevLesson,
      title: e.target.value
    }));
  };

  const handleLessonCompletionChange = (e) => {
    setSelectedLesson(prevLesson => ({
      ...prevLesson,
      completed: e.target.checked
    }));
  };

  const handleUpdateCourse = async () => {
    try {
      const response = await axios.patch(`https://swanirbharapi.onrender.com/courses/${selectedCourse.id}`, selectedCourse);
      const updatedCourse = response.data;
      const updatedCourses = courses.map(course => {
        if (course.id === updatedCourse.id) {
          return updatedCourse;
        }
        return course;
      });
      setCourses(updatedCourses);
      setIsEditCourseModalOpen(false);
      toast({
        title: "Course updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "An error occurred.",
        description: "Failed to update course.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateLesson = async () => {
    try {
      const updatedCourse = {
        ...selectedCourse,
        lessons: selectedCourse.lessons.map(lesson => {
          if (lesson.id === selectedLesson.id) {
            return selectedLesson;
          }
          return lesson;
        })
      };

      const response = await axios.patch(`https://swanirbharapi.onrender.com/courses/${selectedCourse.id}`, updatedCourse);
      const updatedCourseData = response.data;
      const updatedCourses = courses.map(course => {
        if (course.id === updatedCourseData.id) {
          return updatedCourseData;
        }
        return course;
      });
      setCourses(updatedCourses);
      setIsEditLessonModalOpen(false);
      toast({
        title: "Lesson updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast({
        title: "An error occurred.",
        description: "Failed to update lesson.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`https://swanirbharapi.onrender.com/courses/${courseId}`);
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      toast({
        title: "Course deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "An error occurred.",
        description: "Failed to delete course.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteLesson = async (courseId, lessonId) => {
    try {
      const course = courses.find(course => course.id === courseId);
      const updatedLessons = course.lessons.filter(lesson => lesson.id !== lessonId);
      const updatedCourse = { ...course, lessons: updatedLessons };

      await axios.patch(`https://swanirbharapi.onrender.com/courses/${courseId}`, updatedCourse);
      const updatedCourses = courses.map(course => {
        if (course.id === updatedCourse.id) {
          return updatedCourse;
        }
        return course;
      });
      setCourses(updatedCourses);
      toast({
        title: "Lesson deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "An error occurred.",
        description: "Failed to delete lesson.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleLessonVisibility = (courseId) => {
    setIsLessonVisible(prevState => ({
      ...prevState,
      [courseId]: !prevState[courseId]
    }));
  };

  const columnWidth = useBreakpointValue({ base: "auto", md: "150px", lg: "200px" });

  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Navbar />
      <Container maxW="container.xl" bg="white" boxShadow="md" borderRadius="md" p={6}>
        <Heading mb={6} color="teal.500">Teacher Page</Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Actions</Th>
                <Th width={columnWidth}>Course</Th>
                <Th>Description</Th>
                <Th>Category</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.map((course) => (
                <React.Fragment key={course.id}>
                  <Tr>
                    <Td>
                      <IconButton
                        icon={isLessonVisible[course.id] ? <HiOutlineChevronUp /> : <HiChevronDown />}
                        onClick={() => toggleLessonVisibility(course.id)}
                        variant="ghost"
                        colorScheme="teal"
                        aria-label="Toggle Lessons"
                      />
                    </Td>
                    <Td width={columnWidth}>{course.course}</Td>
                    <Td>{course.description}</Td>
                    <Td>{course.category}</Td>
                    <Td><Button colorScheme="teal" onClick={() => handleEditCourse(course)}>Edit</Button></Td>
                    <Td><Button colorScheme="red" onClick={() => handleDeleteCourse(course.id)}>Delete</Button></Td>
                  </Tr>
                  {isLessonVisible[course.id] && (
                    <Tr>
                      <Td colSpan="6" p={0}>
                        <Box overflowX="auto">
                          <Table variant="simple" size="sm">
                            <Thead>
                              <Tr>
                                <Th>Lesson</Th>
                                <Th>Completed</Th>
                                <Th>Edit Lesson</Th>
                                <Th>Delete Lesson</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {course.lessons.map((lesson) => (
                                <Tr key={lesson.id}>
                                  <Td>{lesson.title}</Td>
                                  <Td>{lesson.completed ? 'Yes' : 'No'}</Td>
                                  <Td><Button size="sm" colorScheme="teal" onClick={() => handleEditLesson(lesson, course.id)}>Edit</Button></Td>
                                  <Td><Button size="sm" colorScheme="red" onClick={() => handleDeleteLesson(course.id, lesson.id)}>Delete</Button></Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Box>
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Container>

      <Modal isOpen={isEditCourseModalOpen} onClose={handleCloseEditCourseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Course</FormLabel>
              <Input value={selectedCourse?.course} onChange={handleCourseChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input value={selectedCourse?.description} onChange={handleCourseDescriptionChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Category</FormLabel>
              <Input value={selectedCourse?.category} onChange={handleCourseCategoryChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdateCourse}>
              Save
            </Button>
            <Button onClick={handleCloseEditCourseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditLessonModalOpen} onClose={handleCloseEditLessonModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Lesson</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input value={selectedLesson?.title} onChange={handleLessonTitleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Completed</FormLabel>
              <Checkbox isChecked={selectedLesson?.completed} onChange={handleLessonCompletionChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdateLesson}>
              Save
            </Button>
            <Button onClick={handleCloseEditLessonModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
