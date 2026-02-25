import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    const bg = useColorModeValue('gray.50', 'gray.900');

    return (
        <Flex h="100vh" flexDirection="row" overflow="hidden" position="relative">
            {/* Premium Deep Background */}
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg={useColorModeValue("gray.50", "gray.900")}
                zIndex={0}
            />

            {/* Animated Mesh Gradient Overlay */}
            <Box
                position="absolute"
                top="-50%"
                left="-50%"
                right="-50%"
                bottom="-50%"
                bgGradient="radial(circle at 50% 50%, brand.900 0%, transparent 50%), radial(circle at 100% 0%, brand.800 0%, transparent 50%)"
                filter="blur(100px)"
                opacity={0.4}
                zIndex={0}
                animation="drift 20s infinite alternate"
                sx={{
                    "@keyframes drift": {
                        "0%": { transform: "translate(0, 0) rotate(0deg)" },
                        "100%": { transform: "translate(20px, 20px) rotate(2deg)" },
                    }
                }}
                pointerEvents="none"
            />

            {/* Global Sidebar - Fixed on the left */}
            <Box display={{ base: 'none', md: 'block' }} zIndex={20}>
                <Sidebar />
            </Box>

            {/* Main Content Area */}
            <Flex
                flexDirection="column"
                flex="1"
                overflow="hidden"
                position="relative"
                zIndex={1}
                bg="transparent"
            >
                {/* Top Navbar */}
                <Navbar />

                {/* Page Content Scrollable Area */}
                <Box
                    flex="1"
                    overflowY="auto"
                    overflowX="hidden"
                    position="relative"
                    css={{
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-track': { width: '6px' },
                        '&::-webkit-scrollbar-thumb': { background: useColorModeValue('gray.300', 'gray.600'), borderRadius: '24px' },
                    }}
                >
                    <Box minH="calc(100vh - 60px - 60px)">
                        <Outlet />
                    </Box>
                    <Footer />
                </Box>
            </Flex>
        </Flex>
    );
};

export default Layout;
