import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Flex, Heading, Input, List, ListItem, Stack, Text } from '@chakra-ui/react';

const VotingPageAdmin = () => {
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    age: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [refresh, setRefresh] = useState(false); // State variable to trigger re-fetch
  const baseUrl = 'https://voting-back-6.onrender.com/candidate';

 
  useEffect(() => {
    const fetchCandidates = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      if (!token) {
        console.error('Token not found in localStorage');
        return; // Early return if the token is not found
      }
  
      try {
        const response = await fetch(baseUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching candidates:', errorData.error); // Log the error message from the response
          return; // Exit if there's an error
        }
  
        const data = await response.json();
        console.log('Fetched candidates:', data); 
  
        const candidatesArray = Array.isArray(data) ? data : data ? [data] : [];
        setCandidates(candidatesArray);
      } catch (err) {
        console.error('Error fetching candidates:', err);
      }
    };
    fetchCandidates();
  }, [refresh]); // Trigger re-fetch when `refresh` changes
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateCandidate = async () => {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      await response.json(); 
      setFormData({ name: '', party: '', age: '' });
      setRefresh(!refresh); 
    } catch (err) {
      console.error('Error creating candidate:', err);
    }
  };

  const handleEditCandidate = (candidate) => {
    setEditMode(true);
    setFormData({
      name: candidate.name,
      party: candidate.party,
      age: candidate.age
    });
    setSelectedCandidateId(candidate._id);
  };

  const handleUpdateCandidate = async () => {
    try {
      const response = await fetch(`${baseUrl}/${selectedCandidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      await response.json(); // Wait for the response
      setEditMode(false);
      setFormData({ name: '', party: '', age: '' });
      setSelectedCandidateId(null);
      setRefresh(!refresh); // Toggle refresh state to trigger re-fetch
    } catch (err) {
      console.error('Error updating candidate:', err);
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRefresh(!refresh); // Toggle refresh state to trigger re-fetch
    } catch (err) {
      console.error('Error deleting candidate:', err);
    }
  };

  return (
    <Flex p={16}>
    <Box flex={1} mr={4}>
      <Heading mb={6} textAlign="center">
        Admin Panel
      </Heading>

      <Box mb={8} p={10} bg="gray.100" borderRadius="md" boxShadow="md">
        <Heading size="md" mb={4}>
          {editMode ? 'Edit Candidate' : 'Create Candidate'}
        </Heading>

        <Stack spacing={8}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="Candidate Name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Party</FormLabel>
            <Input
              type="text"
              name="party"
              placeholder="Party"
              value={formData.party}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Age</FormLabel>
            <Input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
            />
          </FormControl>

          <Button
            colorScheme={editMode ? 'yellow' : 'teal'}
            onClick={editMode ? handleUpdateCandidate : handleCreateCandidate}
          >
            {editMode ? 'Update Candidate' : 'Create Candidate'}
          </Button>
        </Stack>
      </Box>
    </Box>

    <Box flex={2} ml={4} p={7}>
      <Heading size="md" mb={3}>
        Candidate List
      </Heading>

      <List spacing={4}>
        {candidates.map((candidate) => (
          <ListItem
            key={candidate._id}
            p={4}
            bg="gray.100"
            borderRadius="md"
            boxShadow="md"
          >
            <Text fontSize="lg">
              {candidate.name || 'Unnamed'} - {candidate.party || 'No Party'} - Age: {candidate.age || 'N/A'} - ID: {candidate._id || 'N/A'}
            </Text>
            <Stack direction="row" mt={2}>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => handleEditCandidate(candidate)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => handleDeleteCandidate(candidate._id)}
              >
                Delete
              </Button>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Box>
  </Flex>
  );
};

export default VotingPageAdmin;
