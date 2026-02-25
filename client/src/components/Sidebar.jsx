import { useEffect, useState } from "react";
import {
	Box,
	VStack,
	Avatar,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Switch,
	Text,
	useColorMode,
	useColorModeValue,
	Tooltip,
} from "@chakra-ui/react";
import {
	FaWikipediaW,
	FaComments,
	FaYoutube,
	FaClipboardList,
	FaUserCircle,
	FaCog,
	FaHome,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const SidebarIcon = ({ icon: Icon, to, label, color, onClick }) => {
	const activeColor = "white";
	const inactiveColor = useColorModeValue("gray.600", "gray.400");
	const activeBg = "brand.600";
	const inactiveBg = useColorModeValue("gray.100", "whiteAlpha.100");
	const hoverBg = useColorModeValue("gray.200", "whiteAlpha.200");

	return (
		<Tooltip label={label} placement="right" hasArrow bg="brand.900" color="white" borderRadius="md" gutter={12}>
			<NavLink to={to} onClick={onClick}>
				{({ isActive }) => (
					<Box
						p={4}
						borderRadius="2xl"
						bg={isActive ? activeBg : inactiveBg}
						color={isActive ? activeColor : inactiveColor}
						boxShadow={isActive ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" : "none"}
						_hover={{ bg: isActive ? activeBg : hoverBg, transform: "translateY(-2px)", boxShadow: "lg" }}
						transition="all 0.3s ease"
						display="flex"
						alignItems="center"
						justifyContent="center"
						border="1px solid"
						borderColor={isActive ? "transparent" : useColorModeValue("gray.200", "whiteAlpha.50")}
					>
						<Icon size={22} />
					</Box>
				)}
			</NavLink>
		</Tooltip>
	);
};

const Sidebar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { colorMode, toggleColorMode } = useColorMode();
	const [collapsed, setCollapsed] = useState(true);
	const userData = useSelector(state => state.authSlice.userData)

	// Premium Solid Sidebar
	const bg = useColorModeValue("#ffffff", "#111111");
	const sidebarBorder = useColorModeValue("gray.200", "whiteAlpha.100");

	// In the new layout, Sidebar is height 100% of its container
	// We don't need absolute positioning or margin hacks as much.

	return (
		<>
			<Box
				w={collapsed ? "80px" : "240px"}
				h="100vh"
				bg={bg}
				borderRight="1px solid"
				borderColor={sidebarBorder}
				transition="width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)"
				display="flex"
				flexDirection="column"
				alignItems="center"
				py={8}
				zIndex={100}
				gap={8}
				position="relative"
				onMouseEnter={() => setCollapsed(false)}
				onMouseLeave={() => setCollapsed(true)}
			>
				{/* User Avatar - Glowing */}
				<NavLink to={'/userSettings'}>
					<Box
						p={1}
						borderRadius="full"
						border="2px solid"
						borderColor="brand.400"
						boxShadow="0 0 10px var(--chakra-colors-brand-400)"
						transition="all 0.3s"
						_hover={{ transform: "scale(1.05)", borderColor: "accent.400" }}
					>
						<Avatar
							name={userData?.name}
							size={collapsed ? "md" : "lg"}
							src={userData?.avatar}
							cursor="pointer"
						/>
					</Box>
				</NavLink>

				{/* Sidebar Icons */}
				<VStack
					spacing={4}
					w="full"
					px={3}
					flex={1}
					justify="flex-start"
					pt={8}
					overflowY="auto"
					css={{ '&::-webkit-scrollbar': { display: 'none' } }}
				>
					<SidebarIcon
						icon={FaHome}
						to="/"
						label="Dashboard"
					/>
					<SidebarIcon
						icon={FaComments}
						to="/chat"
						label="Chat"
					/>
					<SidebarIcon
						icon={FaYoutube}
						to="/youtube-recommendation"
						label="Videos"
					/>
					<SidebarIcon
						icon={FaWikipediaW}
						to="/wikipedia-search"
						label="Wiki"
					/>
					<SidebarIcon
						icon={FaClipboardList}
						to="/quiz"
						label="Quiz"
					/>
				</VStack>

				{/* Settings Icon */}
				<Box mt="auto">
					<Tooltip label="Settings" placement="right">
						<Box
							p={3}
							borderRadius="xl"
							_hover={{ bg: "whiteAlpha.200", transform: "rotate(90deg)" }}
							transition="all 0.5s"
							cursor="pointer"
							onClick={onOpen}
						>
							<FaCog
								size={24}
								color={useColorModeValue("gray.500", "gray.400")}
							/>
						</Box>
					</Tooltip>
				</Box>
			</Box>

			{/* Settings Modal */}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				isCentered
				size="sm"
			>
				<ModalOverlay backdropFilter="blur(5px)" />
				<ModalContent borderRadius="2xl">
					<ModalHeader>Settings</ModalHeader>
					<ModalCloseButton />
					<ModalBody py={6}>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							p={4}
							bg={useColorModeValue("gray.50", "whiteAlpha.100")}
							borderRadius="xl"
						>
							<Text fontWeight="medium">Dark Mode</Text>
							<Switch
								isChecked={colorMode === 'dark'}
								onChange={toggleColorMode}
								colorScheme="brand"
								size="lg"
							/>
						</Box>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="brand"
							onClick={onClose}
							borderRadius="xl"
						>
							Done
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Sidebar;
