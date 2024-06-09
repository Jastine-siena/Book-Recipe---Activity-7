import React, { useEffect, useState } from "react";
import axios from 'axios';

const DataForm = () => {
  const API_URL = 'https://silver-hummingbird-c13315.netlify.app/.netlify/functions/api/';
  const [data, setData] = useState([]);
  const [recipe, setRecipe] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  useEffect(() => {
    // Filter recipes based on search input
    if (searchInput.trim() === '') {
      setFilteredRecipes(data);
    } else {
      const filtered = data.filter(recipe =>
        recipe.ingredients.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  }, [searchInput, data]);

  const handleSubmit = (e, id = null) => {
    e.preventDefault();
    if (!recipe.trim() || !ingredients.trim()) {
      setError('Recipe and Ingredients are required');
      return;
    }
  
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'put' : 'post';
    
    const newData = { recipe, ingredients, cuisine };
  
    axios[method](url, newData)
      .then((response) => {
        if (id) {
          setData(data.map((item) => (item._id === id ? response.data : item)));
        } else {
          setData([...data, response.data]);
          setRecipe(''); 
          setIngredients(''); 
          setCuisine('');
        }
        setError(null);
      })
      .catch((error) => {
        console.error('There was an error!', error);
        setError('An error occurred while saving data.');
      });
  };

  const handleEdit = (_id) => {
    const itemToEdit = data.find((item) => item._id === _id);
    if (itemToEdit) {
      setRecipe(itemToEdit.recipe);
      setIngredients(itemToEdit.ingredients);
      setCuisine(itemToEdit.cuisine);
      setEditItem(_id);
    }
  };
  
  const handleDelete = (_id) => {
    axios
      .delete(`${API_URL}/${_id}`)
      .then(() => {
        setData(prevData => prevData.filter((item) => item._id !== _id));
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleUpdate = (e) => {
    handleSubmit(e, editItem);
    setEditItem(null);
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="mb-5" style={{ backgroundColor: '#4158D0', backgroundImage: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)' }}>
      <h2 className="text-center font-weight-bold mb-4">BOOK RECIPE</h2>
      <div className="form-group">
        <input
          type='text' 
          className="form-control mb-2 ml-5"
          value={searchInput}
          onChange={handleSearch}
          placeholder='Search by ingredients'
          style={{ maxWidth: '250px' }}
        />
      </div>
      <form onSubmit={editItem ? handleUpdate : handleSubmit}>
        {/* Add input for cuisine */}
        <div className="form-group">
          <input
            type='text' 
            className="form-control mb-2"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)} 
            placeholder='Cuisine'
            style={{ maxWidth: '250px' }}
          />
        </div>
        <div className="form-group">
          <input
            type='text' 
            className="form-control mb-2"
            value={recipe}
            onChange={(e) => setRecipe(e.target.value)} 
            placeholder='Recipe'
            style={{ maxWidth: '250px' }}
          />
        </div>
        <div className="form-group">
          <input
            type='text'
            className="form-control mb-2"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder='Ingredients'
            style={{ maxWidth: '250px' }}
          />
        </div>
        <button className="btn btn-primary mb-3" type='submit'>{editItem ? 'Update Recipe' : 'Add Recipe'}</button>
      </form>
      {error && <p className="text-danger">{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Recipe</th>
            <th>Ingredients</th>
            <th>Cuisine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop through filtered recipes */}
          {filteredRecipes.map((item) => (
            <tr key={item._id}>
              <td>{item.recipe}</td>
              <td>{item.ingredients}</td>
              <td>{item.cuisine}</td>
              <td>
                <button className="btn btn-danger mr-2" onClick={() => handleDelete(item._id)}>Delete</button>
                <button className="btn btn-success" onClick={() => handleEdit(item._id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataForm;
