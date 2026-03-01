import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Box,
	Button,
	Input,
	VStack,
	Text,
	HStack,
	Icon,
	useColorModeValue,
	Heading,
	Container,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Flex,
} from "@chakra-ui/react";
import { FaPhone, FaEnvelope, FaFacebook } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { login as authLogin } from "../store/authSlice";

function LoginSignup() {
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userdata = useSelector((state) => state.authSlice.userData);
	const { type } = useParams();
	const [isSignUp, setIsSignUp] = useState(type === "signup");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});

	// Theme hooks
	// Theme hooks - Consolidating unused vars
	// (Removed old variables bgRight, textColor, mutedColor, bgLeft)

	useEffect(() => {
		if (userdata) {
			navigate("/");
		}
	}, [userdata, navigate]);

	useEffect(() => {
		setIsSignUp(type === "signup");
	}, [type]);

	const validateForm = () => {
		let newErrors = {};
		if (isSignUp && !formData.name.trim()) {
			newErrors.name = "Full Name is required";
		}
		// On signup, email must be valid format. On login, allow both email and username
		if (isSignUp) {
			if (!formData.email.includes("@") || !formData.email.includes(".")) {
				newErrors.email = "Invalid email format";
			}
		} else {
			// Login: accept email or username (at least 1 character)
			if (!formData.email || formData.email.trim().length === 0) {
				newErrors.email = "Email or Username is required";
			}
		}
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(formData.password)) {
			newErrors.password =
				"Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};


	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		// Clear error when user types
		if (errors[e.target.name]) {
			setErrors({ ...errors, [e.target.name]: null });
		}
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setIsLoading(true);

		const endpoint = isSignUp
			? "https://ai-assistant-1-htd9.onrender.com/api/v1/users/register"
			: "https://ai-assistant-1-htd9.onrender.com/api/v1/users/login";

		const body = isSignUp
			? {
				name: formData.name,
				email: formData.email,
				password: formData.password,
			}
			: {
				email: formData.email,
				password: formData.password,
			};

		try {
			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok) {
				setErrors({ general: data.message || "Operation failed" });
				return;
			}

			// ✅ BOTH SIGNUP & LOGIN → OTP PAGE
			navigate(`/otpVerification/${formData.email}`);

		} catch (error) {
			console.error("Error submitting form:", error);
			setErrors({ general: "Network error. Please try again." });
		} finally {
			setIsLoading(false);
		}
	};


	// Premium Theme Colors
	const bgForm = useColorModeValue("white", "gray.900");
	const inputBg = useColorModeValue("gray.50", "whiteAlpha.50");
	const inputBorder = useColorModeValue("gray.200", "whiteAlpha.100");
	const brandGradient = "linear(to-r, brand.600, brand.400)";

	return (
		<Flex w="100vw" h="100vh" overflow="hidden">
			{/* Left Side - Premium Image & Glass Overlay */}
			<Box
				display={{ base: "none", lg: "flex" }}
				w="50%"
				h="full"
				bgImage="url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')"
				bgSize="cover"
				bgPos="center"
				position="relative"
				alignItems="center"
				justifyContent="center"
			>
				{/* Dark Overlay for Readability */}
				<Box
					position="absolute"
					top="0"
					left="0"
					w="full"
					h="full"
					bg="blackAlpha.600"
					backdropFilter="blur(5px)"
				/>

				{/* Content Overlay */}
				<VStack
					position="relative"
					zIndex={1}
					spacing={8}
					textAlign="center"
					color="white"
					p={12}
					maxW="lg"
				>
					<Box
						p={8}
						bg="whiteAlpha.100"
						backdropFilter="blur(20px)"
						borderRadius="3xl"
						border="1px solid"
						borderColor="whiteAlpha.200"
						boxShadow="2xl"
					>
						<Heading
							fontSize="5xl"
							fontWeight="800"
							lineHeight="1.1"
							mb={4}
							letterSpacing="tight"
						>
							{isSignUp ? "Join the Future." : "Welcome Back."}
						</Heading>
						<Text fontSize="lg" color="whiteAlpha.800" fontWeight="medium">
							{isSignUp
								? "Create your account and start your professional journey with AI-powered training."
								: "Sign in to access your personalized dashboard and continue your progress."}
						</Text>
					</Box>
				</VStack>
			</Box>

			{/* Right Side - Clean Premium Form */}
			<Flex
				w={{ base: "100%", lg: "50%" }}
				h="full"
				align="center"
				justify="center"
				bg={useColorModeValue("linear(to-br, gray.50, brand.50)", "gray.900")} // Premium Subtle Gradient instead of White
				position="relative"
			>
				{/* Decorative Background Elements on Form Side */}
				<Box
					position="absolute"
					top="-10%"
					right="-10%"
					w="500px"
					h="500px"
					bgGradient="radial(brand.200, transparent 60%)"
					opacity={0.4}
					filter="blur(80px)"
					animation="pulse 10s infinite alternate"
				/>
				<Box
					position="absolute"
					bottom="-10%"
					left="-10%"
					w="400px"
					h="400px"
					bgGradient="radial(accent.200, transparent 60%)"
					opacity={0.3}
					filter="blur(80px)"
					animation="pulse 15s infinite alternate-reverse"
				/>

				{/* Premium Glass/Card Form Container */}
				<VStack
					w="full"
					maxW="md"
					p={10}
					spacing={8}
					bg={useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(26, 32, 44, 0.8)")}
					backdropFilter="blur(20px)"
					borderRadius="3xl"
					boxShadow="2xl"
					border="1px solid"
					borderColor={useColorModeValue("whiteAlpha.500", "whiteAlpha.100")}
					as="form"
					onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
					zIndex={1}
				>
					<VStack spacing={3} w="full" align="flex-start">
						<Text
							color="brand.600"
							fontWeight="bold"
							textTransform="uppercase"
							fontSize="xs"
							letterSpacing="wider"
						>
							{isSignUp ? "Start for free" : "Secure Access"}
						</Text>
						<Heading fontSize="3xl" fontWeight="900" letterSpacing="tight">
							{isSignUp ? "Create Account" : "Sign In to PAT"}
						</Heading>
						<Text color="gray.500" fontSize="md">
							{isSignUp ? "Enter your details below to create your account" : "Enter your email and password to access your account"}
						</Text>
					</VStack>

					{errors.general && (
						<Box
							w="full"
							p={4}
							bg="red.50"
							color="red.600"
							borderRadius="xl"
							textAlign="center"
							fontSize="sm"
							fontWeight="medium"
							border="1px solid"
							borderColor="red.100"
						>
							{errors.general}
						</Box>
					)}

					<VStack spacing={5} w="full">
						{isSignUp && (
							<FormControl isInvalid={errors.name}>
								<FormLabel fontSize="sm" fontWeight="bold" color="gray.600">Full Name</FormLabel>
								<Input
									name="name"
									placeholder="John Doe"
									value={formData.name}
									onChange={handleChange}
									bg={inputBg}
									border="1px solid"
									borderColor={inputBorder}
									fontSize="md"
									h="50px"
									borderRadius="xl"
									_focus={{
										borderColor: "brand.500",
										boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
									}}
									_hover={{
										borderColor: "gray.300"
									}}
								/>
								<FormErrorMessage>{errors.name}</FormErrorMessage>
							</FormControl>
						)}

						<FormControl isInvalid={errors.email}>
						<FormLabel fontSize="sm" fontWeight="bold" color="gray.600">
							{isSignUp ? "Email Address" : "Email or Username"}
						</FormLabel>
						<Input
							name="email"
							placeholder={isSignUp ? "name@example.com" : "name@example.com or username"}
								onChange={handleChange}
								bg={inputBg}
								border="1px solid"
								borderColor={inputBorder}
								fontSize="md"
								h="50px"
								borderRadius="xl"
								_focus={{
									borderColor: "brand.500",
									boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
								}}
								_hover={{
									borderColor: "gray.300"
								}}
							/>
							<FormErrorMessage>{errors.email}</FormErrorMessage>
						</FormControl>

						<FormControl isInvalid={errors.password}>
							<FormLabel fontSize="sm" fontWeight="bold" color="gray.600">Password</FormLabel>
							<Input
								name="password"
								placeholder="••••••••"
								type="password"
								value={formData.password}
								onChange={handleChange}
								bg={inputBg}
								border="1px solid"
								borderColor={inputBorder}
								fontSize="md"
								h="50px"
								borderRadius="xl"
								_focus={{
									borderColor: "brand.500",
									boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
								}}
								_hover={{
									borderColor: "gray.300"
								}}
							/>
							<FormErrorMessage>{errors.password}</FormErrorMessage>
						</FormControl>

						{/* Forgot password link (visible only on Sign In) */}
						{!isSignUp && (
							<HStack w="full" justify="flex-end">
								<Button
									variant="link"
									color="brand.600"
									fontWeight="medium"
									onClick={() => navigate('/forgot-password')}
									_hover={{ textDecoration: 'none', color: 'brand.500' }}
								>
									Forgot Password?
								</Button>
							</HStack>
						)}
						<Button
							type="submit"
							bgGradient={brandGradient}
							color="white"
							size="lg"
							w="full"
							h="50px"
							isLoading={isLoading}
							loadingText="Processing..."
							mt={4}
							borderRadius="xl"
							boxShadow="lg"
							_hover={{
								bgGradient: "linear(to-r, brand.500, brand.300)",
								transform: "translateY(-2px)",
								boxShadow: "xl"
							}}
							_active={{
								transform: "translateY(0)"
							}}
							fontSize="md"
							fontWeight="bold"
						>
							{isSignUp ? "Create Account" : "Sign In"}
						</Button>
					</VStack>

					<HStack spacing={1} fontSize="sm" color="gray.500">
						<Text>
							{isSignUp ? "Already have an account?" : "Don't have an account?"}
						</Text>
						<Button
							variant="link"
							color="brand.600"
							fontWeight="bold"
							onClick={() => setIsSignUp(!isSignUp)}
							_hover={{ textDecoration: "none", color: "brand.500" }}
						>
							{isSignUp ? "Sign In" : "Sign Up"}
						</Button>
					</HStack>
				</VStack>
			</Flex>
		</Flex>
	);
}

export default LoginSignup;

