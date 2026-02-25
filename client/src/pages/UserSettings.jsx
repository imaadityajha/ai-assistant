import React, { useState, useEffect } from "react";
import {
	Flex,
	Box,
	Avatar,
	Text,
	Button,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	VStack,
	Spinner,
	useToast,
	useColorModeValue,
	Container,
	Heading,
	Badge,
	SimpleGrid,
	FormControl,
	FormLabel,
	Input,
	Switch,
	Center
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { logout, login } from "../store/authSlice.js";
import { FaHistory, FaUserEdit, FaSignOutAlt, FaCog, FaBell, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UserSettings() {
	const user = useSelector((state) => state.authSlice.userData);
	const history = useSelector((state) => state.chatTopic.topics);
	const status = useSelector((state) => state.authSlice.status); // Assuming authSlice has status
	const dispatch = useDispatch();
	const toast = useToast();
	const navigate = useNavigate()
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// Theme hooks
	const bg = useColorModeValue("gray.50", "gray.900");
	const cardBg = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.800", "white");
	const mutedColor = useColorModeValue("gray.600", "gray.400");
	const borderColor = useColorModeValue("gray.200", "gray.700");

	// Redirect or show loader if user data is missing but we expect it
	// In a real app, you might want to fetch user data here if it's missing but a token exists.
	// For now, if no user and no landing page logic, we show a friendly message or loader.

	if (!user) {
		return (
			<Center h="100%" w="100%" bg={bg}>
				<VStack spacing={4}>
					<Spinner size="xl" color="brand.500" thickness="4px" />
					<Text fontSize="lg" color={mutedColor}>Loading profile...</Text>
					<Button variant="link" colorScheme="brand" onClick={() => navigate('/authentication/login')}>
						Go to Login
					</Button>
				</VStack>
			</Center>
		)
	}

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			const res = await fetch(
				"http://localhost:8000/api/v1/users/logout",
				{
					method: "POST",
					credentials: "include",
				}
			);
			if (!res.ok) {
				throw new Error("Getting problem while logging out");
			}
			dispatch(logout());
			navigate('/authentication/login'); // Ensure navigation happens
			toast({
				title: "Logged out successfully.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Logout failed.",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoggingOut(false);
		}
	};

	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || "",
		email: user?.email || "",
		username: user?.username || "",
		bio: user?.bio || "",
	});
	const [isSaving, setIsSaving] = useState(false);

	// Update form data when user loads
	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				email: user.email || "",
				username: user.username || "",
				bio: user.bio || "",
			});
		}
	}, [user]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSaveProfile = async () => {
		setIsSaving(true);
		try {
			const res = await fetch("http://localhost:8000/api/v1/users/update-account", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Failed to update profile");
			}

			const data = await res.json();

			// Update Redux store with new user data
			dispatch(login({ userData: data.data }));

			toast({
				title: "Profile Updated",
				description: "Your changes have been saved successfully.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			setIsEditing(false);
		} catch (error) {
			toast({
				title: "Update Failed",
				description: error.message || "Could not save changes. Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Flex h="100%" width="100%" bg={bg} justifyContent="center" overflowY="auto">
			<Container maxW="container.lg" py={8}>
				<VStack spacing={8} align="stretch" pb={20}>
					<Heading size="xl" color={textColor}>Settings & Profile</Heading>

					<Box
						bg={cardBg}
						borderRadius="2xl"
						boxShadow="xl"
						p={8}
						borderWidth="1px"
						borderColor={borderColor}
					>
						<Flex direction={{ base: "column", md: "row" }} align="center" gap={8}>
							<Avatar
								size="2xl"
								name={user?.name}
								src={user?.avatar}
								borderWidth="4px"
								borderColor="brand.500"
								boxShadow="lg"
							/>
							<VStack align={{ base: "center", md: "start" }} spacing={1} flex={1}>
								<Heading size="lg" color={textColor}>{formData.name || "Anonymous User"}</Heading>
								<Text color={mutedColor} fontSize="lg">{formData.email || "No email available"}</Text>
								<Flex gap={2} mt={2}>
									<Badge colorScheme="green" variant="subtle" borderRadius="full" px={3}>
										Active
									</Badge>
									<Badge colorScheme="purple" variant="subtle" borderRadius="full" px={3}>
										Pro Member
									</Badge>
								</Flex>
							</VStack>
							<Button
								leftIcon={<FaSignOutAlt />}
								colorScheme="red"
								variant="ghost"
								onClick={handleLogout}
								isLoading={isLoggingOut}
								size="lg"
							>
								Logout
							</Button>
						</Flex>
					</Box>

					<Box
						bg={cardBg}
						borderRadius="2xl"
						boxShadow="xl"
						overflow="hidden"
						borderWidth="1px"
						borderColor={borderColor}
						minH="400px"
					>
						<Tabs variant="line" colorScheme="brand" isLazy size="lg">
							<TabList px={6} pt={4} borderBottomColor={borderColor}>
								<Tab fontWeight="semibold">Profile Details</Tab>
								<Tab fontWeight="semibold">Activity History</Tab>
								<Tab fontWeight="semibold">Preferences</Tab>
							</TabList>

							<TabPanels p={{ base: 4, md: 8 }}>
								<TabPanel>
									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
										<VStack align="start" spacing={4}>
											<FormControl>
												<FormLabel>Full Name</FormLabel>
												<Input
													name="name"
													value={formData.name}
													onChange={handleInputChange}
													isReadOnly={!isEditing}
													bg={isEditing ? useColorModeValue("white", "gray.700") : useColorModeValue("gray.50", "gray.700")}
													borderColor={isEditing ? "brand.500" : "transparent"}
													_focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px #4f46e5" }}
												/>
											</FormControl>
											<FormControl>
												<FormLabel>Email Address</FormLabel>
												<Input
													name="email"
													value={formData.email}
													onChange={handleInputChange}
													isReadOnly={!isEditing} // Usually email is harder to change, but enabling for now
													bg={isEditing ? useColorModeValue("white", "gray.700") : useColorModeValue("gray.50", "gray.700")}
													borderColor={isEditing ? "brand.500" : "transparent"}
												/>
											</FormControl>
											<FormControl>
												<FormLabel>Username</FormLabel>
												<Input
													name="username"
													value={formData.username}
													onChange={handleInputChange}
													isReadOnly={!isEditing}
													bg={isEditing ? useColorModeValue("white", "gray.700") : useColorModeValue("gray.50", "gray.700")}
													borderColor={isEditing ? "brand.500" : "transparent"}
												/>
											</FormControl>
										</VStack>
										<VStack align="start" spacing={4}>
											<FormControl>
												<FormLabel>Bio</FormLabel>
												<Input
													as="textarea"
													name="bio"
													value={formData.bio}
													onChange={handleInputChange}
													isReadOnly={!isEditing}
													placeholder="Tell us a little about yourself..."
													minH="120px"
													py={2}
													bg={isEditing ? useColorModeValue("white", "gray.700") : useColorModeValue("gray.50", "gray.700")}
													borderColor={isEditing ? "brand.500" : "transparent"}
												/>
											</FormControl>

											{isEditing ? (
												<Flex gap={4} width="100%" mt={4}>
													<Button
														flex={1}
														variant="outline"
														onClick={() => setIsEditing(false)}
														isDisabled={isSaving}
													>
														Cancel
													</Button>
													<Button
														flex={1}
														colorScheme="brand"
														onClick={handleSaveProfile}
														isLoading={isSaving}
														loadingText="Saving..."
													>
														Save Changes
													</Button>
												</Flex>
											) : (
												<Button
													leftIcon={<FaUserEdit />}
													colorScheme="brand"
													variant="outline"
													mt={4}
													width="100%"
													onClick={() => setIsEditing(true)}
												>
													Edit Profile
												</Button>
											)}
										</VStack>
									</SimpleGrid>
								</TabPanel>

								<TabPanel>
									{history && history.length > 0 ? (
										<VStack spacing={3} align="stretch">
											{history.map((item, i) => (
												<Flex
													key={i}
													p={4}
													bg={useColorModeValue("gray.50", "whiteAlpha.100")}
													borderRadius="xl"
													align="center"
													gap={4}
													_hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.200"), transform: "translateX(4px)" }}
													transition="all 0.2s"
													cursor="pointer"
												>
													<Box p={2} bg="brand.100" borderRadius="full" color="brand.600">
														<FaHistory />
													</Box>
													<VStack align="start" spacing={0}>
														<Text color={textColor} fontWeight="semibold">{item}</Text>
														<Text fontSize="xs" color={mutedColor}>Viewed recently</Text>
													</VStack>
												</Flex>
											))}
										</VStack>
									) : (
										<Flex direction="column" align="center" justify="center" h="300px" color={mutedColor} bg={useColorModeValue("gray.50", "whiteAlpha.50")} borderRadius="xl">
											<Text fontSize="6xl" mb={4}>🕒</Text>
											<Heading size="md" mb={2}>No History Found</Heading>
											<Text>Your recent checks and chats will appear here.</Text>
										</Flex>
									)}
								</TabPanel>

								<TabPanel>
									<VStack spacing={6} align="stretch" maxW="lg">
										<Flex justify="space-between" align="center">
											<Flex gap={3} align="center">
												<FaBell />
												<Text fontWeight="medium">Email Notifications</Text>
											</Flex>
											<Switch colorScheme="brand" defaultChecked />
										</Flex>
										<Flex justify="space-between" align="center">
											<Flex gap={3} align="center">
												<FaLock />
												<Text fontWeight="medium">Two-Factor Authentication</Text>
											</Flex>
											<Switch colorScheme="brand" />
										</Flex>
										<Flex justify="space-between" align="center">
											<Flex gap={3} align="center">
												<FaCog />
												<Text fontWeight="medium">Data Usage</Text>
											</Flex>
											<Button size="sm" variant="link" colorScheme="brand">Manage</Button>
										</Flex>
									</VStack>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Box>
				</VStack>
			</Container>
		</Flex>
	);
}

export default UserSettings;
