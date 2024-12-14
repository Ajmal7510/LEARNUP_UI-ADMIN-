import React, { useEffect, useState } from "react";
import styles from "./Banner.module.css";
import axios from "axios";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    images: [null, null, null],
    previews: ["", "", ""],
    isActive: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error for the field
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const newImages = [...form.images];
    const newPreviews = [...form.previews];

    newImages[index] = file;
    newPreviews[index] = file ? URL.createObjectURL(file) : "";

    setForm({ ...form, images: newImages, previews: newPreviews });
    setErrors({ ...errors, images: "" }); // Clear the image error
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.description.trim()) newErrors.description = "Description is required.";
    if (!form.images.some((img) => img)) newErrors.images = "At least one image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true); // Start loading
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);

      form.images.forEach((image) => {
        if (image) formData.append("images", image);
      });

      const response = await axios.post("http://localhost:8080/admin/banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.statusCode === 200){
        setModalVisible(false);
      setForm({ name: "", description: "", images: [null, null, null], previews: ["", "", ""] });
      fetchBanner();
      }
      
    } catch (error) {
      console.error("Error submitting banner:", error);
      alert("Failed to submit banner.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      const banner = banners[index];
      const token = localStorage.getItem('token');
  
      if (!token) {
        window.location.href = '/login';
        return;
      }
  
      try {
        const response = await axios.delete(
          `http://localhost:8080/admin/banner/${banner.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          setBanners(banners.filter((_, i) => i !== index));
          alert('Banner deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Failed to delete banner.');
      }
    }
  };
  

  const toggleActive = async (index) => {
    const banner = banners[index];
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login'; // Redirect to login if no token
      return;
    }
  
    try {
      // Log the token to ensure it's being retrieved correctly
      console.log("Token: ", token);
  
      const response = await axios.patch(
        `http://localhost:8080/admin/banner/status/${banner.id}`,
        {},  // Empty body for PATCH request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Response:', response.data);
  
      fetchBanner();  // Refresh the banners after successful update
    } catch (error) {
      // Log error details
      console.error('Error updating banner status:', error);
      alert('Failed to update banner status.');
    }
  };
  
  

  const openModal = (banner, index) => {
    if (banner) {
      setCurrentBanner(index);
      setForm({
        name: banner.name,
        description: banner.description,
        images: [null, null, null],
        previews: banner.images,
        isActive: banner.isActive,
      });
    } else {
      setForm({ name: "", description: "", images: [null, null, null], previews: ["", "", ""], isActive: false });
    }
    setErrors({});
    setModalVisible(true);
  };

  const fetchBanner = async () => {
    // setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get('http://localhost:8080/admin/banner', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      
      setBanners(response.data);
      // setLoading(false);
    } catch (err) {
     
      console.error(err);
      // setLoading(false);
    }
  };



  useEffect(() => {
    fetchBanner(); // Fetch banners on component mount
  
    
  }, [])
  




  return (
    <div className={styles.container}>
      <h1>Banners</h1>
      <button className={styles.addButton} onClick={() => openModal(null)}>
        Add Banner
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner, index) => (
            <tr key={index}>
              <td>{banner.name}</td>
              <td>{banner.description}</td>
              <td>
                {banner.image1 && (
                  <img src={banner.image1} alt="Preview" className={styles.image} />
                )}
              </td>
              <td>
                {/* <button onClick={() => toggleActive(index)}
                   className={banner.isActive ? styles.activeButton : styles.inactiveButton}>
                  {banner.active ? "Deactivate" : "Activate"}
                </button> */}


                {
                  !banner.active ? (
                       <button onClick={() => toggleActive(index)}
                   className={banner.isActive ? styles.activeButton : styles.inactiveButton}>
                  {/* {banner.active ? "Deactivate" : "Activate"} */}
                  Activate
                </button> 
                  ): 
                  (
                    <h5 className={styles.isActiveText}>Is Active</h5>
                  )
                }
               



                 {
                  !banner.active && (
                    <button onClick={() => handleDelete(index)}
                    className={styles.deleteButton}
                    >
                      Delete</button>
                  )
                 }

              
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{currentBanner !== null ? "Edit Banner" : "Add Banner"}</h2>
            <form>
              <div>
                <label>Name</label>
                <input type="text" name="name" value={form.name} onChange={handleInputChange} />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>
              <div>
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleInputChange}></textarea>
                {errors.description && <p className={styles.error}>{errors.description}</p>}
              </div>
              <div className={styles.imageInputContainer}>
                {form.images.map((_, index) => (
                  <div key={index} className={styles.imageInputWrapper}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, index)}
                    />
                    {form.previews[index] && (
                      <img src={form.previews[index]} alt={`Preview ${index + 1}`} className={styles.previewImageHorizontal} />
                    )}
                  </div>
                ))}
                {errors.images && <p className={styles.error}>{errors.images}</p>}
              </div>
              <button type="button" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : currentBanner !== null ? "Update" : "Add"}
              </button>
              <button type="button" onClick={() => setModalVisible(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
