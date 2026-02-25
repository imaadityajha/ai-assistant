import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, Route, Routes } from 'react-router-dom'
import { login } from './store/authSlice'
import { Flex, Text } from '@chakra-ui/react'
import ErrorBoundary from './components/ErrorBoundary'
import { ColorModeSwitcher } from './components/ColorModeSwitcher'
import Layout from './components/Layout'

function App() {

  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrent = async () => {
    const res = await fetch('http://localhost:8000/api/v1/users/getCurrentUser',
      {
        method: 'GET',
        credentials: 'include',
      }
    )
    if (!res.ok) {
      return;
    }
    const data = await res.json()
    dispatch(login(data.data));
  }

  useEffect(() => {
    setIsLoading(true);
    fetchCurrent()
    setIsLoading(false);
  }, [])

  return isLoading ? (<>
    <Flex h='100vh' w='100vw' display={'flex'} alignItems={'center'} justifyContent={'center'}>
      <Text fontSize={'3xl'}>Loading.....</Text>
    </Flex>
  </>) : (
    <ErrorBoundary>
      {/* Layout is applied via Router configuration in main.jsx, but we can also wrap Outlet here if App deals with layout. 
         Wait, main.jsx sets App as the root element. If we want Layout on all pages except Login, we should update main.jsx router config,
         OR conditionally render Layout here. 
         
         Better approach: Update 'main.jsx' to use Layout as a parent route for authenticated pages.
         For now, since 'App' is the root, let's keep it clean.
         Actually, let's modify 'main.jsx' structure to implement Layout properly.
         Reverting changes here to keep App simple as a data loader/auth checker.
      */}
      <Outlet />
    </ErrorBoundary>
  )
}

export default App
