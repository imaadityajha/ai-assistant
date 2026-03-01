import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	VStack,
	HStack,
	IconButton,
	Input,
	Flex,
	useColorModeValue,
	Heading,
	Text,
	ListItem,
	UnorderedList,
	Icon,
} from "@chakra-ui/react";
import { FaMicrophone, FaPaperPlane, FaTrash, FaRobot } from "react-icons/fa";
import { addTopic, deleteTopic } from "../store/chatTopicSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteChat, setChat } from "../store/prevChatSlice";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const markdownComponents = {
	h1: (props) => (
		<Heading
			as="h1"
			size="xl"
			my={2}
			{...props}
		/>
	),
	h2: (props) => (
		<Heading
			as="h2"
			size="lg"
			my={2}
			{...props}
		/>
	),
	h3: (props) => (
		<Heading
			as="h3"
			size="md"
			my={2}
			{...props}
		/>
	),
	p: (props) => (
		<Text
			fontSize="md"
			my={2}
			{...props}
		/>
	),
	ul: ({ children, ...props }) => (
		<UnorderedList
			pl={5}
			my={2}
			{...props}
		>
			{children}
		</UnorderedList>
	),
	li: ({ children, ...props }) => (
		<Box
			as="li"
			mb={1}
			ml={4}
			{...props}
		>
			{children}
		</Box>
	),

	code: (props) => (
		<Box
			as="code"
			bg="gray.100"
			color="purple.600"
			px={2}
			py={1}
			borderRadius="md"
			fontFamily="mono"
			fontSize="sm"
			whiteSpace="pre-wrap"
			fontWeight="semibold"
			{...props}
		/>
	),
	pre: (props) => (
		<Box
			as="pre"
			bg="gray.900"
			color="white"
			p={4}
			borderRadius="md"
			overflowX="auto"
			fontSize="sm"
			fontFamily="mono"
			mb={4}
			border="1px solid"
			borderColor="gray.700"
			boxShadow="md"
			{...props}
		/>
	),
};

function ChatBox() {
	const [messages, setMessages] = useState([]);
	const [botTyping, setBotTyping] = useState(false);

	const [input, setInput] = useState("");
	const chatEndRef = useRef(null);
	const prevChats = useSelector((state) => state.chatHistory.chats);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setChat(messages));
		chatEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, [messages]);

	useEffect(() => {
		if (prevChats) {
			setMessages(prevChats);
		}
	}, []);

	const handleSendMessage = async () => {
		if (input.trim() === "") return;

		const newMessage = { text: input.toUpperCase(), sender: "user" };
		setMessages((prevMessages) => [...prevMessages, newMessage]);
		setInput("");
		setBotTyping(true);

		try {
			const response = await fetch(
				"https://ai-assistant-1-htd9.onrender.com/api/v1/chat/getResponse",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						question: "Describe and teach about " + input,
					}),
					credentials: "include",
				}
			);

			const data = await response.json();

			if (response.ok) {
				const botMessage = {
					text: data.data.ai_response,
					sender: "bot",
				};
				setMessages((prevMessages) => [...prevMessages, botMessage]);

				if (data.data.topic) dispatch(addTopic(data.data.topic));
			} else {
				throw new Error(data.error || "AI response failed");
			}
		} catch (error) {
			console.error("Error fetching response:", error);
			setMessages((prevMessages) => [
				...prevMessages,
				{
					text: "⚠️ AI is not responding. Try again later.",
					sender: "bot",
				},
			]);
		}
		setBotTyping(false);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleClearChat = () => {
		setMessages([]);
		dispatch(deleteChat());
		dispatch(deleteTopic());
	};

	const handleVoiceInput = () => {
		if (!("webkitSpeechRecognition" in window)) {
			alert("Voice recognition not supported. Try Chrome.");
			return;
		}
		const recognition = new window.webkitSpeechRecognition();
		recognition.lang = "en-US";
		recognition.continuous = false;
		recognition.interimResults = false;

		recognition.onresult = (event) => {
			const transcript = event.results[0][0].transcript;
			setInput(transcript);
		};
		recognition.onerror = (event) =>
			console.error("Voice recognition error:", event.error);

		recognition.start();
	};

	const botBg = useColorModeValue("white", "whiteAlpha.200");
	const userBg = "brand.500";
	const userColor = "white";
	const botColor = useColorModeValue("gray.800", "white");
	const borderColor = useColorModeValue("gray.100", "whiteAlpha.100");

	return (
		<Flex
			direction="column"
			h="100%"
			w="full"
			position="relative"
		>
			{/* Premium Chat Header */}
			<Box px={6} pt={6} pb={0}>
				<Flex
					direction="row"
					align="center"
					bgGradient="linear(to-r, brand.600, purple.600)"
					p={5}
					borderRadius="2xl"
					color="white"
					boxShadow="xl"
					position="relative"
					overflow="hidden"
				>
					<Box position="absolute" top="-50px" right="-50px" boxSize="150px" bg="whiteAlpha.200" borderRadius="full" />
					<Box position="absolute" bottom="-30px" left="-20px" boxSize="100px" bg="blackAlpha.200" borderRadius="full" />

					<HStack spacing={4} zIndex={1}>
						<Box p={2} bg="whiteAlpha.200" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.300">
							<Icon as={FaRobot} boxSize={6} color="white" />
						</Box>
						<VStack align="start" spacing={0}>
							<Heading size="md" fontWeight="bold">AI Knowledge Hub</Heading>
							<Text fontSize="xs" opacity={0.9} fontWeight="medium" letterSpacing="wide">
								PROFESSIONAL ASSISTANT
							</Text>
						</VStack>
					</HStack>
				</Flex>
			</Box>
			<Box
				flex={1}
				overflowY="auto"
				p={6}
				scrollBehavior="smooth"
				css={{
					'&::-webkit-scrollbar': { width: '4px' },
					'&::-webkit-scrollbar-track': { width: '6px' },
					'&::-webkit-scrollbar-thumb': { background: useColorModeValue('gray.200', 'whiteAlpha.200'), borderRadius: '24px' },
				}}
			>
				<VStack
					spacing={6}
					align="stretch"
					pb={4}
				>
					{messages.map((msg, index) => (
						<HStack
							key={index}
							justify={msg.sender === "user" ? "flex-end" : "flex-start"}
							align="flex-start"
							spacing={3}
						>
							{/* Avatar for Bot */}
							{msg.sender === "bot" && (
								<Box
									p={1}
									bg="brand.500"
									borderRadius="full"
									boxShadow="0 0 10px var(--chakra-colors-brand-500)"
								>
									<Text fontSize="xs">🤖</Text>
								</Box>
							)}

							<Box
								bg={msg.sender === "user" ? "transparent" : botBg}
								bgGradient={msg.sender === "user" ? "linear(to-r, brand.500, brand.600)" : undefined}
								color={msg.sender === "user" ? userColor : botColor}
								backdropFilter={msg.sender === "bot" ? "blur(10px)" : undefined}
								border="1px solid"
								borderColor={msg.sender === "bot" ? borderColor : "transparent"}
								px={5}
								py={3}
								borderRadius="2xl"
								borderBottomRightRadius={msg.sender === "user" ? "none" : "2xl"}
								borderBottomLeftRadius={msg.sender === "bot" ? "none" : "2xl"}
								maxW="80%"
								boxShadow={msg.sender === "user" ? "lg" : "sm"}
							>
								<ReactMarkdown
									components={markdownComponents}
									rehypePlugins={[rehypeRaw, rehypeHighlight]}
								>
									{msg.text}
								</ReactMarkdown>
							</Box>

							{/* Avatar for User */}
							{msg.sender === "user" && (
								<Box
									p={1}
									bg="purple.500"
									borderRadius="full"
									boxShadow="lg"
								>
									<Text fontSize="xs">👤</Text>
								</Box>
							)}
						</HStack>
					))}
					{botTyping && (
						<HStack align="center" spacing={3}>
							<Box
								p={1}
								bg="brand.500"
								borderRadius="full"
								boxShadow="0 0 10px var(--chakra-colors-brand-500)"
							>
								<Text fontSize="xs">🤖</Text>
							</Box>
							<Box
								bg={botBg}
								color={botColor}
								px={5}
								py={3}
								borderRadius="2xl"
								borderBottomLeftRadius="none"
								fontStyle="italic"
								fontSize="sm"
								boxShadow="sm"
								backdropFilter="blur(10px)"
								border="1px solid"
								borderColor={borderColor}
							>
								<Text
									as="span"
									className="typing-dots"
								>
									Thinking<span className="dot">.</span>
									<span className="dot">.</span>
									<span className="dot">.</span>
								</Text>
							</Box>
						</HStack>
					)}
					<div ref={chatEndRef}></div>
				</VStack>
			</Box>

			{/* Premium Floating Input Area */}
			<Box
				p={4}
				pb={6}
			>
				<HStack
					w="full"
					bg={useColorModeValue("white", "rgba(20, 20, 30, 0.6)")}
					backdropFilter="blur(20px)"
					p={2}
					borderRadius="full"
					boxShadow="xl"
					border="1px solid"
					borderColor={useColorModeValue("gray.100", "whiteAlpha.100")}
					spacing={2}
				>
					<IconButton
						icon={<FaMicrophone />}
						aria-label="Voice Input"
						colorScheme="brand"
						variant="ghost"
						rounded="full"
						onClick={handleVoiceInput}
					/>
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Ask anything..."
						flex={1}
						variant="unstyled"
						px={4}
						fontSize="md"
						color={useColorModeValue("gray.800", "white")}
					/>
					<IconButton
						icon={<FaPaperPlane />}
						onClick={handleSendMessage}
						aria-label="Send"
						colorScheme="brand"
						rounded="full"
						size="md"
						boxShadow="lg"
						_hover={{ transform: "scale(1.05)", bgGradient: "linear(to-r, brand.400, brand.500)" }}
					/>
					<IconButton
						icon={<FaTrash />}
						onClick={handleClearChat}
						aria-label="Clear Chat"
						colorScheme="red"
						variant="ghost"
						rounded="full"
						size="sm"
					/>
				</HStack>
			</Box>
		</Flex>
	);
}

export default ChatBox;
