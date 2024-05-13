// src/components/NotificationAdmin.js
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Dropdown } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { FaBell } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation"; // Import TypeAnimation

function NotificationAdmin() {
    {
        const [notices, setNotices] = useState([]);
        const [showModal, setShowModal] = useState(false);
        const [formData, setFormData] = useState({
          title: "",
          content: "",
          code: "", // Add code field
        });
        const [editIndex, setEditIndex] = useState(null); // To keep track of the index of the notice being edited
      
        useEffect(() => {
          fetchNotices();
        }, []);
      
        const fetchNotices = async () => {
          try {
            const response = await axios.get("http://localhost:8080/api/notices");
            setNotices(response.data);
          } catch (error) {
            console.error("Error fetching notices:", error);
          }
        };
      
        const handleCloseModal = () => {
          setShowModal(false);
          setFormData({ title: "", content: "", code: "" }); // Reset code field
          setEditIndex(null); // Reset editIndex
        };
      
        const handleShowModal = () => setShowModal(true);
      
        const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData({ ...formData, [name]: value });
        };
      
        const handleSubmit = async (e) => {
          e.preventDefault();
          try {
            if (editIndex !== null) {
              // If editIndex is not null, it means we're editing an existing notice
              await axios.put(
                `http://localhost:8080/api/notices/${notices[editIndex]._id}`, // Assuming _id is the unique identifier for the notice
                formData
              );
            } else {
              // Otherwise, we're adding a new notice
              await axios.post("http://localhost:8080/api/notices", formData);
            }
            fetchNotices();
            handleCloseModal();
          } catch (error) {
            console.error("Error:", error);
          }
        };
      
        const handleEdit = (index) => {
          setEditIndex(index);
          setFormData({
            title: notices[index].title,
            content: notices[index].content,
            code: notices[index].code, // Set code field when editing
          });
          handleShowModal();
        };
      
        const handleDelete = async (index) => {
          const confirmDelete = window.confirm(
            "Are you sure you want to delete this notification?"
          );
          if (confirmDelete) {
            try {
              await axios.delete(
                `http://localhost:8080/api/notices/${notices[index]._id}`
              );
              fetchNotices();
            } catch (error) {
              console.error("Error deleting notice:", error);
            }
          }
        };
      
        const generatePDF = () => {
          const doc = new jsPDF();
          doc.text("Notification Admin Panel", 10, 10);
          const tableData = notices.map((notice) => [
            notice.title,
            notice.content,
            notice.code, // Add code to tableData
            new Date(notice.datePublished).toLocaleString(),
          ]);
          doc.autoTable({
            head: [["Title", "Content", "Code", "Date Published"]], // Add Code header
            body: tableData,
          });
          doc.save("notifications.pdf");
        };
      
        return (
          <div className="container">
            <TypeAnimation
              sequence={["Notification Admin Panel"]}
              speed={10}
              style={{ fontSize: "3rem" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 16,
                alignItems: "center",
              }}
            >
              <Button
                style={{ marginBottom: 8 }}
                variant="outline-success"
                onClick={generatePDF}
              >
                Generate PDF
              </Button>
              <Button
                style={{ marginBottom: 8 }}
                variant="primary"
                onClick={handleShowModal}
              >
                Add Notification
              </Button>
      
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  <FaBell />
                </Dropdown.Toggle>
      
                <Dropdown.Menu>
                  {notices.map((notice, index) => (
                    <Dropdown.Item key={index}>
                      {notice.title} <br />
                      <span>{notice.content}</span>
                      <hr />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
      
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Content</th>
      
                  <th>Date Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr key={index}>
                    <td>{notice.code}</td>
                    <td>{notice.title}</td>
                    <td>{notice.content}</td>
      
                    <td>{new Date(notice.datePublished).toLocaleString()}</td>
                    <td>
                      <Button variant="info" onClick={() => handleEdit(index)}>
                        Edit
                      </Button>{" "}
                      <Button variant="danger" onClick={() => handleDelete(index)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
      
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {editIndex !== null ? "Edit Notification" : "Add Notification"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="content">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="code">
                    {" "}
                    {/* Add code field */}
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <br />
                  <div className="text-center">
                    {" "}
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        );
      }
    }

export default NotificationAdmin;
