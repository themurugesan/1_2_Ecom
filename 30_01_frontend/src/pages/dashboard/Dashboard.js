import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardHeader from "../header/cardHeader";  
import axios from 'axios';  
import "./Dashboard.css";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);  
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []); 
  const [valids,setValid]=useState([])
  
  useEffect(() => {
    fetchImages();  
  }, []);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/dashimages',{
        headers: {
          Authorization: localStorage.token
        }
      });
      if(data.valid){
        setValid(data.valid)
        
        console.log(data.valid,"nofitfy items")
        
        
      }
      setImages(data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  
  const handleAddToCart = async (image) => {
    const existingItem = cart.find(item => item._id === image._id);
    console.log(existingItem, "existsssssssssss");
  
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(item =>
        item._id === image._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...image, quantity: 1 }];
    }
  
    // Update the state
    setCart(updatedCart);
  
    // Make API call to update cart in backend
    try {
      await axios.post("http://localhost:5000/api/cart", updatedCart, { // Send updatedCart, not existingItem
        headers: {
          Authorization: localStorage.token
        }
      });
      console.log("Cart updated successfully.");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  
    // Update localStorage with the new cart state
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  

  const handleViewCart = () => {
    navigate("/cart");
  };

  return (
    <>
      <CardHeader />
      <div className="app-container">
        <h1 className="heading">Category</h1>
        <h2>Phone</h2> 
        

        <div className="images-container">
          
          {images.map((image) => (
            <div key={image._id} className="image-card">
              {/* {alert(valids.map(item=>item.title,"it is available product"))} */}
              <h2 className="image-title">{image.title}</h2>
              <p className="image-description">{image.description}</p>
              <p className="image-price">Price: ${image.amount}</p>
              <img
                className="image-thumbnail"
                src={`http://localhost:5000/${image.image}`}
                alt={image.title}
              />
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(image)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>

      
        <button className="view-cart-btn" onClick={handleViewCart}>
          View Cart
        </button>
      </div>
    </>
  );
};

export default Dashboard;
