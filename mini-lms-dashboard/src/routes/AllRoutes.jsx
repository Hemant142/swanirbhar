import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from '../pages/Homepage'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import TeacherPage from '../pages/TeacherPage'
import UserProfile from '../pages/UserProfile'
import PrivateRoutes from './PrivateRoutes'
import Course from '../pages/Course'
import CourseDetail from '../pages/CourseDetail'

export default function AllRoutes() {
  return (
    <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/course' element={<PrivateRoutes><Course/></PrivateRoutes>} />
        <Route path='/courses/:id' element={<CourseDetail/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/teacherpage' element={<PrivateRoutes><TeacherPage/></PrivateRoutes>}/>
        <Route path='/userprofile' element={<UserProfile/>} />
    </Routes>
  )
}
