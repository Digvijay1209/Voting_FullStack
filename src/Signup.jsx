import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    address: '',
    aadharCardNumber: '',
    password: '',
    role: 'voter', 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup data:', formData);

    try {
      const response = await fetch('http://localhost:3000/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful signup
        toast({
          title: 'Signup successful.',
          description: 'Please login.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        // Handle errors from the backend
        toast({
          title: 'Signup failed.',
          description: data.error || 'An error occurred. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error during signup:', error);
      toast({
        title: 'Signup failed.',
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
      height="90%" // Adjust height to reduce overall size
      overflowY="auto" // Allow internal scrolling if necessary
    >
      <Heading as="h2" size="lg" textAlign="center" marginBottom="20px">
        Sign Up
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3}> {/* Adjusted spacing for a tighter layout */}
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Age</FormLabel>
            <Input
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email (optional)"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Mobile</FormLabel>
            <Input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number (optional)"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Address</FormLabel>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </FormControl>
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
          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="voter">Voter</option>
              <option value="admin">Admin</option>
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            Sign Up
          </Button>
          <Button 
            colorScheme="gray" 
            width="full" 
            marginTop="2" // Adjusted margin to fit better
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </VStack>
      </form>
    </Box>
  </Box>
  );
}
