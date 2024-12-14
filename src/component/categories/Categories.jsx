import React, { useEffect, useState } from 'react';
import styles from './Categories.module.css';
import axios from 'axios';
import API from '../../axis/axiosConfig';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: null });
  const [newSubCategory, setNewSubCategory] = useState({ name: '', description: '', image: null, categoryId: '' });
  const [editingCategoryData, setEditingCategoryData] = useState(null);
  const [editingSubCategoryData, setEditingSubCategoryData] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [showEditSubCategoryModal, setShowEditSubCategoryModal] = useState(false)
  const [newCategoryImage, setNewCategoryImage] = useState(null); 
  const [newSubCategoryEditImage, setNewSubCategoryEditImage] = useState(null)
  const [categoryError, setCategoryError] = useState('');
  const [categoryEditError, setCategoryEditError] = useState()
  const [subCategoryError, setSubCategoryError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Handlers for category and subcategory changes
  const handleCategoryChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleEditCategoryChange = (e) => {
    setEditingCategoryData({...editingCategoryData, [e.target.name]: e.target.value})
  }

  // const handleSubCategoryCategoryChange = (e) => {
  //   setEditingCategoryData({...editingSubCategoryData, [e.target.name]: e.target.value });
  // };

  const handleEditSubCategory = (e) => {
    setEditingSubCategoryData({...editingSubCategoryData, [e.target.name]: e.target.value });

  }

  const handleSubCategoryChange = (e) => {
    setNewSubCategory({ ...newSubCategory, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'category') {
          setNewCategory({ ...newCategory, image: file });
        } else {
          setNewSubCategory({ ...newSubCategory, image: file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  

  const handleImageUploadEditCategory = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategoryImage(file);
    }
  }

  const handleImageUpoadSubCategory = (e) => {
    const file=e.target.files[0];
    if (file) {
      setNewSubCategoryEditImage(file);
    }(file);
    }


  const editSubCategory = async ()=>{
    if (!editingSubCategoryData.name ||!editingSubCategoryData.description) {
      setSubCategoryError('All fields are required for the subcategory.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', editingSubCategoryData.name);
      formData.append('description', editingSubCategoryData.description);
      formData.append('categoryId',editingSubCategoryData.category.id)
      console.log(editingSubCategoryData);
      
      formData.append('categoryId', editingSubCategoryData.category.categoryId);
      if (newSubCategoryEditImage) formData.append('image', newSubCategoryEditImage);


      const response = await API.put(`/admin/categories/sub-category/${editingSubCategoryData.id}`,formData);
  
      if (response.status === 200) {
        setShowEditSubCategoryModal(false);
        fetchSubCategories(); // Refresh the category list
        setSubCategoryError('');
      }


    }catch (error) {
        console.error('Error editing category', error);
        setCategoryEditError('Failed to update category. Please try again.');
      }
  }


  const editCategory = async () => {
    if (!editingCategoryData.name ||!editingCategoryData.description) {
      setCategoryEditError('All fields are required for the category.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editingCategoryData.name);
      formData.append('description', editingCategoryData.description);
      if (newCategoryImage) formData.append('image', newCategoryImage);

      const response = await API.put(`/admin/categories/${editingCategoryData.id}`,formData)
      
      // const response = await axios.put(`http://localhost:8080/admin/categories/${editingCategoryData.id}`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
  
      if (response.status === 200) {
        setShowEditCategoryModal(false);
        fetchCategories(); // Refresh the category list
        setCategoryEditError('');
      }
    } catch (error) {
      console.error('Error editing category', error);
      setCategoryEditError('Failed to update category. Please try again.');
    }

  }

  const addCategory = async () => {
    if (!newCategory.name || !newCategory.description || !newCategory.image) {
      setCategoryError('All fields are required for the category.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      formData.append('description', newCategory.description);
      formData.append('image', newCategory.image);


      const response = await API.post('/admin/categories/add-category',formData)

      // const response = await axios.post('http://localhost:8080/admin/categories/add-category', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });

      if (response.status === 200) {
        setShowCategoryModal(false);
        fetchCategories(); 
        setCategoryError()
        // Reload categories
      }
    } catch (error) {
      console.error('Error adding category', error);
      setCategoryError('Failed to add category. Please try again.');
    }
  };

  const addSubCategory = async () => {
    if (!newSubCategory.name || !newSubCategory.description || !newSubCategory.categoryId || !newSubCategory.image) {
      setSubCategoryError('All fields are required for the subcategory.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const formData = new FormData();
    formData.append('name', newSubCategory.name);
    formData.append('description', newSubCategory.description);
    formData.append('categoryId', newSubCategory.categoryId);
    formData.append('image', newSubCategory.image);

    try {
   
      const response = await API.post('/admin/categories/add-subcategory',formData);
      
      // const response = await axios.post('http://localhost:8080/admin/categories/add-subcategory', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });

      if (response.status === 200) {
        setShowSubCategoryModal(false);
        setNewSubCategory({name: '', description: '', image: null, categoryId: '' })
        fetchSubCategories(); // Reload subcategories
      }
    } catch (error) {
      console.error('Error adding subcategory', error);
      setSubCategoryError('Failed to add subcategory. Please try again.');
    }
  };

  const  deleteCatgory = async (categoryId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    // Show a confirmation alert
  const isConfirmed = window.confirm('Are you sure you want to delete this category?');
  if (!isConfirmed) {
    return; // If the user cancels, stop further execution
  }

  try {
    const response = await axios.delete(`http://localhost:8080/admin/categories/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      alert('Category deleted successfully!');
      fetchCategories(); // Reload categories list after deletion
    }
  } catch (error) {
    console.error('Error deleting category', error);
    alert('Failed to delete category. Please try again.');
  }



    
  }

  const deleteSubCategory=async (subCategoryId)=>{
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    // Show a confirmation alert
    const isConfirmed = window.confirm('Are you sure you want to delete this Subcategory?');
    if (!isConfirmed) {
      return; // If the user cancels, stop further execution
    }

    try {
      const response = await axios.delete(`http://localhost:8080/admin/categories/sub-category/${subCategoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        alert('Category deleted successfully!');
        fetchCategories(); // Reload categories list after deletion
      }
    } catch (error) {
      console.error('Error deleting category', error);
      alert('Failed to delete category. Please try again.');
    }
  

  }

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get('http://localhost:8080/admin/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch categories. Please try again later.');
      console.error(err);
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    setLoading(true);
    try {

      const response = await API.get('/admin/categories/subcategories');

      // const response = await axios.get('http://localhost:8080/admin/categories/subcategories', {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });
      setSubCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch subcategories. Please try again later.');
      console.error(err);
      setLoading(false);
    }
  };

  const handleEditCategoryModal = (categoryId) => {
    setShowEditCategoryModal(true);
    setCategoryEditError(null);  
    setNewCategoryImage(null)
    // Find the category using categoryId
    const categoryToEdit = categories.find(category => category.id === categoryId);
    setEditingCategoryData(categoryToEdit);
  };


  const handleEditSubCategoryModal = (subCategoryId)=>{
    setShowEditSubCategoryModal(true)



   const subcategoryToEdit=subCategories.find(s => s.id==subCategoryId )
    setEditingSubCategoryData(subcategoryToEdit)
  }


  const addCategoryModal = ()=>{
    setShowCategoryModal(true);
    setNewCategory({ name: '', description: '', image: null })
  }




  // const handleCloseEditCategoryModal = () => {
  //   setShowEditCategoryModal(false); // Close the modal
  //   setEditingCategory(null);       // Clear the editing data
  //   setCategoryEditError(null);     // Clear any errors
  //   setNewCategoryImage(null);      // Clear any previewed image
  // };
  





  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    console.log(subCategories.category);
    
  }, []);

  return (
    <div className={styles.container}>
      <h1>Categories</h1>
      <button className={styles.addButton} onClick={addCategoryModal}>Add Category</button>
      <button className={styles.addButton} onClick={() => setShowSubCategoryModal(true)}>Add Subcategory</button>

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
          {categories.map((category, index) => (
            <tr key={index}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td><img src={category.image} alt={category.name} className={styles.image} /></td>
              <td>
                <button className={styles.editButton} 
                onClick={() => handleEditCategoryModal(category.id)} 
                >Edit</button>
                <button className={styles.deleteButton} onClick={()=> deleteCatgory(category.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Subcategories</h2>
      {
        console.log(subCategories)
        
      }
      <table className={styles.table}>
        <thead>
          <tr>

            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subCategories.map((subCategory, index) => (
            
            <tr key={index}>
              <td>{subCategory.name}</td>
              <td>{subCategory.description}</td>
              
              <td>{subCategory.category.name}</td>
              <td><img src={subCategory.image} alt={subCategory.name} className={styles.image} /></td>
              <td>
                <button className={styles.editButton} 
                onClick={()=>handleEditSubCategoryModal(subCategory.id)}
                 >Edit</button>
                <button className={styles.deleteButton} onClick={()=>deleteSubCategory(subCategory.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Add Category</h3>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleCategoryChange}
              placeholder="Category Name"
            />
            <textarea
              name="description"
              value={newCategory.description}
              onChange={handleCategoryChange}
              placeholder="Category Description"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'category')}
            />
            {newCategory.image && <img src={URL.createObjectURL(newCategory.image)} alt="Category" className={styles.image} />}
            <br />
            <button onClick={addCategory}>Add Category</button>
            <button className={styles.closeButton} onClick={() => setShowCategoryModal(false)}>Close</button>
            {categoryError && <p className={styles.error}>{categoryError}</p>}
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showSubCategoryModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Add Subcategory</h3>
            <input
              type="text"
              name="name"
              value={newSubCategory.name}
              onChange={handleSubCategoryChange}
              placeholder="Subcategory Name"
            />
            <textarea
              name="description"
              value={newSubCategory.description}
              onChange={handleSubCategoryChange}
              placeholder="Subcategory Description"
            />
            <select
              name="categoryId"
              value={newSubCategory.categoryId}
              onChange={handleSubCategoryChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'subcategory')}
            />
            {newSubCategory.image && <img src={URL.createObjectURL(newSubCategory.image)} alt="Subcategory" className={styles.image} />}
            <br />
            <button onClick={addSubCategory}>Add Subcategory</button>
            <button className={styles.closeButton} onClick={() => setShowSubCategoryModal(false)}>Close</button>
            {subCategoryError && <p className={styles.error}>{subCategoryError}</p>}
          </div>
        </div>



      )}

      
          {/* edit  category Modal */}

          {showEditCategoryModal && (
            <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Edit Category</h3>
              <input
                type="text"
                name="name"
                value={editingCategoryData.name}
                onChange={handleEditCategoryChange}
                placeholder="Category Name"
              />
              <textarea
                name="description"
                value={editingCategoryData.description}
                onChange={handleEditCategoryChange}
                placeholder="Category Description"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUploadEditCategory(e, 'category')}
              />
              <br />
            {newCategoryImage ? (
              <img src={URL.createObjectURL(newCategoryImage)} alt="Preview" className={styles.image} />
            ) : (
              editingCategoryData.image && <img src={editingCategoryData.image} alt="Category" className={styles.image} />
            )}
            <br />
              
              <br />
              <button onClick={editCategory}>Edit Category</button>
              <button className={styles.closeButton} onClick={() => setShowEditCategoryModal(false)}>Close</button>
              {categoryEditError && <p className={styles.error}>{categoryEditError}</p>}
            </div>
          </div>
          )

          }



          {/* edit sub Subcategory Modal */}
      {showEditSubCategoryModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Edit Subcategory</h3>
            <input
              type="text"
              name="name"
              value={editingSubCategoryData.name}
              onChange={handleEditSubCategory}
              placeholder="Subcategory Name"
            />
            <textarea
              name="description"
              value={editingSubCategoryData.description}
              onChange={handleEditSubCategory}
              placeholder="Subcategory Description"
            />
            <select
              name="categoryId"
              value={editingSubCategoryData.categoryId}
              onChange={handleEditSubCategory}
            >
              <option value={editingSubCategoryData.category.name}>{editingSubCategoryData.category.name}</option>
              
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpoadSubCategory(e, 'subcategory edit')}
            />
            {newSubCategoryEditImage ? (
              <img src={URL.createObjectURL(newSubCategoryEditImage)} alt="Preview" className={styles.image} />
            ) : (
              editingSubCategoryData.image && <img src={editingSubCategoryData.image} alt="Category" className={styles.image} />
            )}
            <br />
            <button onClick={editSubCategory}>Edi  Subcategory</button>
            <button className={styles.closeButton} onClick={() => setShowEditSubCategoryModal(false)}>Close</button>
            {subCategoryError && <p className={styles.error}>{subCategoryError}</p>}
          </div>
        </div>



      )}
    </div>
  );
};

export default Categories;



