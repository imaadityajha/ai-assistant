import React from 'react';
import { Container, Heading, Text, Box, Grid, VStack, HStack, Icon, Link, Avatar, useColorModeValue } from '@chakra-ui/react';
import { FaLinkedin, FaGithub, FaEnvelope, FaTwitter } from 'react-icons/fa';

const TeamMember = ({ name, role, email, github, linkedin, twitter, photo }) => {
  const bgColor = useColorModeValue('white', '#171717');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const roleColor = useColorModeValue('blue.600', 'brand.400');
  const emailColor = useColorModeValue('gray.600', 'whiteAlpha.700');

  return (
    <Box
      bg={bgColor}
      rounded="lg"
      shadow="md"
      p={6}
      textAlign="center"
      border="1px"
      borderColor={borderColor}
      _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
      transition="all 0.3s"
    >
      <VStack spacing={4}>
        <Avatar
          size="2xl"
          name={name}
          src={photo}
          border="4px"
          borderColor="brand.500"
        />
        <Box>
          <Heading size="md" mb={2} color={textColor}>{name}</Heading>
          <Text color={roleColor} fontSize="sm" fontWeight="600" mb={4}>{role}</Text>
        </Box>
        <VStack spacing={3} width="100%">
          <Text color={emailColor} fontSize="sm">{email}</Text>
          <HStack justify="center" spacing={4}>
            {linkedin && (
              <Link href={linkedin} isExternal title="LinkedIn">
                <Icon as={FaLinkedin} w={5} h={5} color={useColorModeValue("blue.600", "brand.400")} _hover={{ color: useColorModeValue("blue.700", "brand.300") }} />
              </Link>
            )}
            {github && (
              <Link href={github} isExternal title="GitHub">
                <Icon as={FaGithub} w={5} h={5} color={useColorModeValue("gray.800", "whiteAlpha.800")} _hover={{ color: useColorModeValue("gray.900", "white") }} />
              </Link>
            )}
            {twitter && (
              <Link href={twitter} isExternal title="Twitter">
                <Icon as={FaTwitter} w={5} h={5} color={useColorModeValue("blue.400", "brand.300")} _hover={{ color: useColorModeValue("blue.500", "brand.200") }} />
              </Link>
            )}
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default function About() {
  const teamMembers = [
    {
      name: "Aaditya Jha",
      role: "Full Stack Developer",
      email: "aadityajha2022@gmail.com",
      github: "https://github.com/imaadityajha",
      linkedin: "https://www.linkedin.com/in/imaadityajha/",
      twitter: "https://twitter.com/imaadityajha",
      photo: "/me_pp.jpg" 

    },
    {
      name: "Abhay Kumar Yadav",
      role: "Frontend Developer",
      email: "22A91A501@aec.edu.in",
      github: "https://github.com",
      linkedin: "https://www.linkedin.com/in/abhay-kumar-yadav-730806278/",
      twitter: "https://twitter.com",
      photo: "/501.jpg"
    },
    {
      name: "Palli Harshavardhan",
      role: "Backend Developer",
      email: "22A91A542@aec.edu.in",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      photo: "/542.jpg"
    },
    {
      name: "Suraj Kumar",
      role: "UI/UX Designer",
      email: "21A91A547@aec.edu.in",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      photo: "/547.jpg"
    }
  ];

  const projectGuide = {
    name: "DR. K NAGARAJU",
    role: "Project Guide & Mentor",
    email: "nagarajuk@adityauniversity.in",
    // github: "https://github.com",
    // linkedin: "https://linkedin.com",
    // twitter: "https://twitter.com",
    photo: "guide.jpg"
  };

  return (
    <Container maxW="container.lg" py={12}>
      <Box mb={12}>
        <Heading mb={4}>About</Heading>
        <Text color={useColorModeValue('gray.600', 'whiteAlpha.700')} fontSize="lg" textAlign={"justify"}>
          The AI-Driven Smart Personalized Learning Assistant is an intelligent web platform created to provide personalized academic guidance to students. It combines artificial intelligence with modern web technologies to deliver interactive learning support, secure authentication, quiz generation, and smart resource recommendations. The system is designed to enhance student engagement, improve knowledge retention, and make learning more adaptive and efficient.
          
          <p><strong>Empowering learners through intelligent, secure, and personalized education.</strong></p>
        </Text>
      </Box>

      {/* Meet Our Team Section */}
      <Box>
        <Heading size="lg" mb={8}>Meet Our Team</Heading>
        
        {/* Team Members - First Row */}
        <Box mb={10}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </Grid>
        </Box>

        {/* Project Guide - Second Row */}
        <Box>
          <Heading size="md" mb={6} textAlign="center" color={useColorModeValue('blue.600', 'brand.400')}>Project Guide</Heading>
          <Box display="flex" justifyContent="center">
            <Box width={{ base: "100%", md: "50%", lg: "33%" }}>
              <TeamMember {...projectGuide} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
