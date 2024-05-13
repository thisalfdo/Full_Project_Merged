import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  useToast,
  Input,
  Textarea,
  Select,
  Container,
  VStack,
  Heading,
  List,
  ListItem,
  FormControl,
  FormLabel,
  HStack,
  Text,
} from '@chakra-ui/react';

const Dashboard = () => {
    const [userProjects, setProjects] = useState([]);
    const [projectData, setProjectData] = useState({ pName: '', Des: '', cName: '', architect: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [architects, setArchitects] = useState([]);
    const toast = useToast();

    useEffect(() => {
        fetchProjects();
        fetchArchitects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`http://localhost:5000/api/projects/user/${userId}`, config);
            setProjects(res.data.userProjects);
        } catch (error) {
            toast({
                title: "Error fetching projects",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const fetchArchitects = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`http://localhost:5000/api/user/architects`, config);
            setArchitects(res.data.architects);
        } catch (error) {
            toast({
                title: "Error fetching architects",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleInputChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`http://localhost:5000/api/projects/search?searchQuery=${searchQuery}`, config);
            setProjects(res.data.projects);
        } catch (error) {
            console.error('Error searching projects:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const projectDataWithArchitect = { ...projectData, architectName: projectData.architect };
            if (editingProjectId) {
                await axios.put(`http://localhost:5000/api/projects/update/${editingProjectId}`, projectDataWithArchitect, config);
            } else {
                await axios.post('http://localhost:5000/api/projects/create', projectDataWithArchitect, config);
            }
            toast({
                title: editingProjectId ? "Project Updated" : "Project Created",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            fetchProjects();
            setProjectData({ pName: '', Des: '', cName: '', architect: '' });
            setEditingProjectId(null);
        } catch (error) {
            console.error('Error creating/updating project:', error);
        }
    };

    const handleDelete = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/projects/delete/${projectId}`, config);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleEdit = (projectId) => {
        const projectToEdit = userProjects.find(project => project._id === projectId);
        setProjectData({
            pName: projectToEdit.pName,
            Des: projectToEdit.Des,
            cName: projectToEdit.cName,
            architect: projectToEdit.architect
        });
        setEditingProjectId(projectId);
    };

    const projectListItems = userProjects.map(project => (
        <ListItem key={project._id} mb={5}>
            <Box p="4" borderWidth="1px" borderRadius="md" shadow="md">
                <Heading size="md" mb={2}>Project Details</Heading>
                <Text mb={2}><strong>Project Name:</strong> {project.pName}</Text>
                <Text mb={2}><strong>Description:</strong> {project.Des}</Text>
                <Text mb={2}><strong>Client Name:</strong> {project.cName}</Text>
                <HStack spacing={4}>
                    <Button colorScheme="red" onClick={() => handleDelete(project._id)}>Delete Project</Button>
                    <Button colorScheme="teal" onClick={() => handleEdit(project._id)}>Edit Project</Button>
                </HStack>
            </Box>
        </ListItem>
    ));

    return (
        <Container maxW="container.xl">
            <VStack spacing={4} align="stretch">
                <Heading>{editingProjectId ? 'Edit Project' : 'Create New Project'}</Heading>
                <form onSubmit={handleSubmit}>
                    <FormControl>
                        <FormLabel>Project Name</FormLabel>
                        <Input type="text" name="pName" value={projectData.pName} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea name="Des" value={projectData.Des} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Client Name</FormLabel>
                        <Input type="text" name="cName" value={projectData.cName} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Architect</FormLabel>
                        <Select name="architect" value={projectData.architect} onChange={handleInputChange}>
                            <option value="">Select Architect</option>
                            {architects.map(architect => (
                                <option key={architect} value={architect}>{architect}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <Button mt={4} colorScheme="blue" type="submit">{editingProjectId ? 'Update Project' : 'Create Project'}</Button>
                </form>
                <Input placeholder="Search projects" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} mb={4} />
                <Button onClick={handleSearch} colorScheme="green">Search</Button>
                <Heading size="lg">Projects</Heading>
                <List spacing={3}>
                    {projectListItems}
                </List>
            </VStack>
        </Container>
    );
};

export default Dashboard;
