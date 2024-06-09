import React from 'react'
import Login from '../pages/Login'
import Cookies from 'js-cookie'; 
export default function PrivateRoutes({children}) {
    const isAuth = Cookies.get('isLoggedIn')
    const teacher=Cookies.get('teach')
 console.log(isAuth)
 if(!isAuth){
    return <Login />
  }
  return (
    children
  )
}
