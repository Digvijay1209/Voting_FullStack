import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';



export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    aadharCardNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login data:', formData);

    try {
      const response = await fetch('https://voting-back-6.onrender.com/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Received data:', data); 

      if (response.ok) {
        toast({
          title: 'Login successful.',
          description: 'Welcome back!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

       
        localStorage.setItem('token', data.token);

       
        setTimeout(() => {
          if (data.role === 'voter') {
            navigate('/VotingPage');
          } else if (data.role === 'admin') {
            navigate('/VotingPageAdmin');
          }
        }, 2000);
      } else {
        toast({
          title: 'Login failed.',
          description: data.error || 'An error occurred. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: 'Login failed.',
        description: 'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      backgroundColor="#f4f4f4"
    >
      <Box
        maxWidth="400px"
        width="100%"
        padding="15px"
        background="white"
        borderRadius="8px"
        boxShadow="lg"
      >
        <Heading as="h2" size="lg" textAlign="center" marginBottom="30px">
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Aadhar Card Number</FormLabel>
              <Input
                name="aadharCardNumber"
                type="number"
                value={formData.aadharCardNumber}
                onChange={handleChange}
                placeholder="Enter your Aadhar Card Number"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Login
            </Button>
   
            <Button 
              colorScheme="teal" 
              width="full" 
              onClick={() => navigate('/')}
            >
              Sign Up
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
