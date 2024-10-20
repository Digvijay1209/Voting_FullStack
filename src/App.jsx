import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Signup'; 
import Login from './Login'; 
import VotingPage from './VotingPage';
import VotingPageAdmin from './VotingPageAdmin';


function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Signup/>} /> 
          <Route path="/signup" element={<Signup/>} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/VotingPage" element={<VotingPage />} />
          <Route path="/VotingPageAdmin" element={<VotingPageAdmin />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
