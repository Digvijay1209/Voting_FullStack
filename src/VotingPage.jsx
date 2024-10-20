import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  useToast,
  Text,
  List,
  ListItem,
  ListIcon,
  Input,
  FormControl,
  FormLabel,
  Flex,
  Grid
} from '@chakra-ui/react';
import { CheckCircleIcon } from "@chakra-ui/icons";

import { useNavigate } from 'react-router-dom';

export default function VotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [voteCounts, setVoteCounts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

 

  const fetchCandidates = async () => {
    try {
      const response = await fetch('https://voting-backend-one.vercel.app//candidate', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      console.log(data)
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: 'Error fetching candidates',
        description: 'Unable to load candidates. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const fetchVoteCounts = async () => {
    try {
      const response = await fetch('https://voting-backend-one.vercel.app//candidate/vote/count', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = await response.json();
  
      // Check if data is an array before setting it
      if (Array.isArray(data)) {
        console.log(data)
        setVoteCounts(data);
      } else {
        setVoteCounts([]); // Set to an empty array if it's not in the expected format
      }
    } catch (error) {
      console.error('Error fetching vote counts:', error);
      toast({
        title: 'Error fetching vote counts',
        description: 'Unable to load vote counts. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setVoteCounts([]); // In case of error, fallback to empty array
    }
  };
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://voting-backend-one.vercel.app//user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUserProfile(data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Error fetching user profile',
        description: 'Unable to load user profile. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleVote = async (candidateId) => {
    try {
      console.log("Test :",candidateId);
      const response = await fetch(`https://voting-backend-one.vercel.app//candidate/vote/${candidateId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Vote successful!',
          description: 'Your vote has been recorded.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchVoteCounts(); // Refresh vote counts after voting
      } else {
        const data = await response.json();
        toast({
          title: 'Vote failed.',
          description: data.error || 'An error occurred. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error during voting:', error);
      toast({
        title: 'Vote failed.',
        description: 'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://voting-backend-one.vercel.app//user/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        toast({
          title: 'Password updated!',
          description: 'Your password has been changed successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const data = await response.json();
        toast({
          title: 'Password update failed.',
          description: data.error || 'An error occurred. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: 'Password update failed.',
        description: 'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    fetchCandidates();
    fetchVoteCounts();
    fetchUserProfile();
  }, []);
  if (loading) {
    return <Text>Loading...</Text>; 
  }
  
  return (

    <Flex
    height="100vh"
    width="100vw"
    backgroundColor="#f4f4f4"
  >
    <Flex direction="column" align="flex-start" justify="center" flex={1} p={20}>
      <VStack spacing={7} align="stretch">
        <Box p={2} borderWidth={7} borderRadius="md">
          <Heading as="h3" size="md" mb={4}>Vote Counts</Heading>
          <List spacing={2}>
            {voteCounts.length > 0 ? (
              voteCounts.map((record, index) => (
                <ListItem key={index}>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  {record.party}: {record.voteCount} votes
                </ListItem>
              ))
            ) : (
              <ListItem>No vote data available</ListItem> 
            )}
          </List>
        </Box>

        <Box p={2} borderWidth={7} borderRadius="md">
          <Heading as="h3" size="md" mb={4}>User Profile</Heading>
          <Text>Name: {userProfile.name}</Text>
          <Text>Email: {userProfile.email || 'Not provided'}</Text>
          <Text>Mobile: {userProfile.mobile || 'Not provided'}</Text>
          <Text>Address: {userProfile.address}</Text>
          <Text>Age: {userProfile.age}</Text>
          <FormControl onSubmit={handlePasswordChange} mt={4}>
            <FormLabel>Change Password</FormLabel>
            <Input
              placeholder="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              mb={2}
            />
            <Input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              mb={2}
            />
            <Button colorScheme="blue" onClick={handlePasswordChange}>
              Update Password
            </Button>
          </FormControl>
        </Box>
      </VStack>
    </Flex>
    <Flex direction="column" align="center" justify="center" flex={1} p={7}>
      <Box
        p={4} 
        borderWidth={7}
        borderRadius="md"
        maxHeight="400px" 
        overflowY="auto"  
        width="100%"     
      >
        <Heading as="h3" size="md" mb={4}>Candidates</Heading>
        <List spacing={2}>
          {candidates.map(candidate => (
            <ListItem key={candidate._id}>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              {candidate.name} ({candidate.party})
              <Button ml={4} onClick={() => handleVote(candidate._id)} colorScheme="teal">
                Vote
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Flex>
  </Flex>
  );
}
