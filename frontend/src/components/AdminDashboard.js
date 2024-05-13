import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  Text,
  useToast,
  Select,
  Heading,
  Container,
  VStack,
  List,
  ListItem
} from '@chakra-ui/react'; // Updated imports

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState({});
    const toast = useToast();

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const res = await axios.get('http://localhost:5000/api/user', config);
            setUsers(res.data.users);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/user/${userId}`);
            toast({
                title: "User Deleted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            fetchAllUsers();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRoleChange = (userId, newRole) => {
        setSelectedRoles({ ...selectedRoles, [userId]: newRole });
    };

    const handleRoleUpdate = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:5000/api/user/${userId}/role`, { role: selectedRoles[userId] }, config);
            toast({
                title: "Role Updated",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            fetchAllUsers();
        } catch (error) {
            setError(error.message);
        }
    };

    const renderUsers = () => {
        return users.map(user => (
            <ListItem key={user._id}>
                <Box p="4" borderWidth="1px" borderRadius="md" shadow="md" marginBottom="4">
                    <Text mb="2" fontSize="lg" fontWeight="bold">User Details</Text>
                    <Text mb="2"><strong>Name:</strong> {user.name}</Text>
                    <Text mb="2"><strong>Email:</strong> {user.email}</Text>
                    <Flex alignItems="center" mb="2">
                        <Text mr="2"><strong>Role:</strong></Text>
                        <Select
                            placeholder="Select role"
                            value={selectedRoles[user._id] || user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            width="auto"
                        >
                            <option value="user">User</option>
                            <option value="architect">Architect</option>
                            <option value="admin">Admin</option>
                        </Select>
                        <Button colorScheme="teal" ml="2" onClick={() => handleRoleUpdate(user._id)}>Update Role</Button>
                    </Flex>
                    <Button colorScheme="red" onClick={() => handleDeleteUser(user._id)}>Delete User</Button>
                </Box>
            </ListItem>
        ));
    };

    return (
        <Container maxW="container.xl" centerContent>
            <VStack spacing={4} align="stretch" w="100%">
                <Heading as="h1" size="xl">Admin Dashboard</Heading>
                {error && <Text color="red.500">Error: {error}</Text>}
                <List spacing={3}>
                    {renderUsers()}
                </List>
            </VStack>
        </Container>
    );
};

export default AdminDashboard;
