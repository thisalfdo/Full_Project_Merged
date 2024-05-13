import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';  // Changed from useNavigate to useHistory

const DocumentEdit = () => {
  const { id } = useParams();
  const history = useHistory(); // Changed from useNavigate to useHistory
  const [loading, setLoading] = useState(false);
  const [Type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:8070/documents/get/${id}`)
        .then((response) => {
          const document = response.data;
          setType(document.Type);
          setImage(document.image);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching document details:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      image,
      Type,
    };

    setLoading(true);
    axios
      .put(`http://localhost:8070/documents/update/${id}`, formData)
      .then((response) => {
        setSuccessMessage(response.data.message);
        alert('Update successfully');
        history.push('/DocumentList'); // Changed from navigate to history.push
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error editing document:', error);
        setErrorMessage(error.message);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>{id ? 'Edit Document' : 'Add Document'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group m-4">
          <label htmlFor="documentType">Document Type :</label>
          <select
            id="documentType"
            name="documentType"
            className="form-control"
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value={Type}>{Type}</option>
            <option value="NIC">NIC (National Identity Card)</option>
            <option value="Birth Certificate">Birth Certificate</option>
            <option value="Passport">Passport</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            className="form-control-file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div className="">
          <img
            className=""
            width={200}
            height={200}
            src={image}
            alt="Receipt"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {id ? 'Update Document' : 'Add Document'}
        </button>
      </form>
      {successMessage && (
        <div className="alert alert-success my-3">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-danger my-3">{errorMessage}</div>
      )}
    </>
  );
};

export default DocumentEdit;
