import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CardHeader from "../header/cardHeader";
import "./CardPage.css";

export const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [unavailableProducts, setUnavailableProducts] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cartget", {
        headers: {
          Authorization: localStorage.token,
        },
      });
      console.log(response, "responseeeeeeeee");

      if (response.status === 200) {
        setCart(response.data.cart);
        if (response.data.unavailableProducts) {
          setUnavailableProducts(response.data.unavailableProducts);
        }
      } else {
        console.error("Error fetching cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (id, notify) => {
    try {
      const itemToRemove = cart.find((item) => item._id === id);
      console.log(itemToRemove, "remove itemsss");
      const updatedCart = cart.filter((item) => item._id !== id);
      console.log(updatedCart, "updated Cartttts");

      setCart(updatedCart);

      const response = await axios.post(
        "http://localhost:5000/api/cartput",
        notify ? { id, notify } : { id },
        {
          headers: {
            Authorization: localStorage.token,
          },
        }
      );

      if (response.status === 200) {
        console.log("Cart updated successfully");
      } else {
        console.error("Error updating cart:", response.statusText);
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <>
      <CardHeader />
      <div className="app-container">
        <h1 className="heading">Your Cart</h1>
        <h2>
          <center>Unavailable Products</center>
        </h2>
        <div className="cart-items-container">
          {unavailableProducts.length > 0 ? (
            unavailableProducts.map((item) => (
              <div key={item._id} className="cart-item">
                <h2>{item.title}</h2>
                <p>Price: ${item.amount}</p>
                <p>Quantity: {item.quantity}</p>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromCart(item._id, true)} // Use `notify` flag here
                >
                  Notify Me
                </button>
              </div>
            ))
          ) : (
            <p>No unavailable products at the moment!</p> // Friendly message for empty unavailable list
          )}
        </div>

        <h2>Available Products</h2>
        <div className="cart-items-container">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item._id} className="cart-item">
                <h2>{item.title}</h2>
                <p>Price: ${item.amount}</p>
                <p>Quantity: {item.quantity}</p>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromCart(item._id)} // Remove without notify flag
                >
                  Remove from Cart
                </button>
              </div>
            ))
          ) : (
            <p>
              Your cart is empty. <a href="/dashboard">Browse Products</a>
            </p> // Provide a link to products page
          )}
        </div>

        <div className="cart-actions">
          {cart?.length > 0 ? (
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          ) : (
            <h5>Not Checkout</h5>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
