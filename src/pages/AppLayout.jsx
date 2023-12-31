import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Map from '../components/Map'
import SideBar from '../components/SideBar'
import User from '../components/User'
import { useAuth } from '../Context/AuthContext'
import styles from './AppLayout.module.css'

export default function AppLayout() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  useEffect(
    function () {
      if (!isAuthenticated) navigate('/login')
    },
    [isAuthenticated, navigate],
  )
  return (
    <div className={styles.app}>
      <SideBar />
      <Map />
      <User />
    </div>
  )
}
