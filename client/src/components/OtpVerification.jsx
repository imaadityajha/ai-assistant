import { useState, useEffect, useRef } from "react";
import {
	Box,
	Button,
	Input,
	Text,
	Flex,
	VStack,
	Heading,
	useColorModeValue,
	HStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice.js";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function OtpVerification() {
	const { email } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [timer, setTimer] = useState(10 * 60); // 10 minutes
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const firstInputRef = useRef(null);

	// Theme colors
	const bgForm = useColorModeValue("white", "gray.900");
	const inputBg = useColorModeValue("gray.50", "whiteAlpha.50");
	const inputBorder = useColorModeValue("gray.200", "whiteAlpha.100");
	const brandGradient = "linear(to-r, brand.600, brand.400)";
	const bgPage = useColorModeValue("linear(to-br, gray.50, brand.50)", "gray.900");

	useEffect(() => {
		firstInputRef.current?.focus();
	}, []);

	const handleChange = (index, value) => {
		setError("");
		if (isNaN(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value.slice(-1); // Only keep last digit
		setOtp(newOtp);

		if (value && index < 5) {
			document.getElementById(`otp-input-${index + 1}`)?.focus();
		}
	};

	const handleNext = async () => {
		if (timer === 0) {
			setError("Time expired. Please request a new OTP.");
			return;
		}

		setLoading(true);
		const completeOtp = otp.join("");

		try {
			const response = await fetch("http://localhost:8000/api/v1/users/verifyOTP", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ otp: completeOtp, email }),
				credentials: "include"
			});

			if (!response.ok) {
				setError("Verification failed. Please try again.");
				return;
			}

			const data = await response.json();
			if (data.message === "Verified Success") {
				dispatch(authLogin(data.data));
				navigate("/");
			} else {
				setError("Incorrect OTP. Please check and try again.");
			}
		} catch (err) {
			console.error(err);
			setError("Server error. Try again later.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
			return () => clearInterval(interval);
		}
	}, [timer]);

	const handleBack = () => {
		navigate(-1);
	};

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
							Verify Your Identity
						</Heading>
						<Text fontSize="lg" color="whiteAlpha.800" fontWeight="medium">
							Enter the one-time password sent to your email to continue securely.
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
				bg={bgPage}
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
					zIndex={1}
				>
					{/* Header */}
					<VStack spacing={3} w="full" align="flex-start">
						<Text
							color="brand.600"
							fontWeight="bold"
							textTransform="uppercase"
							fontSize="xs"
							letterSpacing="wider"
						>
							Secure Access
						</Text>
						<Heading fontSize="3xl" fontWeight="900" letterSpacing="tight">
							OTP Verification
						</Heading>
						<Text color="gray.500" fontSize="md">
							Enter the OTP sent to <strong>{email}</strong>
						</Text>
					</VStack>

					{/* Error Message */}
					{error && (
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
							{error}
						</Box>
					)}

					{/* OTP Input Fields */}
					<VStack spacing={6} w="full">
						<HStack spacing={3} justify="center" w="full">
							{otp.map((value, index) => (
								<Input
									key={index}
									id={`otp-input-${index}`}
									ref={index === 0 ? firstInputRef : null}
									type="text"
									maxLength="1"
									textAlign="center"
									fontSize="2xl"
									fontWeight="bold"
									w="50px"
									h="60px"
									borderRadius="xl"
									bg={inputBg}
									border="2px solid"
									borderColor={inputBorder}
									_focus={{
										borderColor: "brand.500",
										boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
									}}
									_hover={{
										borderColor: "gray.300"
									}}
									onChange={(e) => handleChange(index, e.target.value)}
									value={value}
									placeholder="•"
									color={useColorModeValue("gray.800", "white")}
								/>
							))}
						</HStack>

						{/* Timer */}
						<Text fontSize="sm" fontWeight="600" color="brand.600">
							Time remaining: {`${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`}
						</Text>

						{/* Verify Button */}
						<Button
							bgGradient={brandGradient}
							color="white"
							size="lg"
							w="full"
							h="50px"
							isLoading={loading}
							loadingText="Verifying..."
							onClick={handleNext}
							isDisabled={otp.includes("") || loading}
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
							mt={4}
						>
							Verify OTP
						</Button>
					</VStack>

					{/* Back Button */}
					<Button
						leftIcon={<ArrowBackIcon />}
						variant="outline"
						colorScheme="brand"
						w="full"
						borderRadius="xl"
						onClick={handleBack}
						_hover={{
							bg: useColorModeValue("brand.50", "whiteAlpha.100")
						}}
					>
						Back
					</Button>
				</VStack>
			</Flex>
		</Flex>
	);
}
