import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {

const currentUser = useSelector(state => state.user.currentUser);

  return (
    <div>
      {currentUser ? <Outlet /> : <Navigate to="/signin" />}
    </div>
  )
}

export default PrivateRoutes
