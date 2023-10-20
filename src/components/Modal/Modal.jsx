import React, { useState } from 'react';
import { auth, db } from '../../config/firebase';
import { Timestamp, addDoc, collection, doc } from 'firebase/firestore';
import './Modal.css';

function Modal({ data, onAddToCart, onClose }) {
  // State for selected color, size, and displayed image
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [displayedImage, setDisplayedImage] = useState(null);

  // Handle color selection
  const handleColorChange = (color, image) => {
    setSelectedColor(color);
    setDisplayedImage(image);
  };

  // Handle size selection
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  // Handle adding the item to the cart
  const handleAddToCart = async () => {
    if (selectedColor && selectedSize) {
      try {
        // Get the current user
        const user = auth.currentUser;
        if (!user) {
          // Handle the case where the user is not logged in
          console.error('User is not logged in.');
          return;
        }

        // Reference the user's document
        const userCollectionRef = collection(db, 'users');
        const userUid = user.uid;
        const userDocRef = doc(userCollectionRef, userUid);

        // Create a reference to the user's cart subcollection
        const cartCollectionRef = collection(userDocRef, 'cart');

        // Create a new cart item
        const newItem = {
          product: data.product,
          selectedColor,
          selectedSize,
          timestamp: Timestamp.now(),
        };

        // Add the cart item to the user's cart subcollection
        await addDoc(cartCollectionRef, newItem);

        // Reset selections after adding to cart
        setSelectedColor('');
        setSelectedSize('');
        setDisplayedImage(null);
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error adding item to cart:', error);
        // Display an error message to the user here if necessary
      }
    } else {
      // Handle the case where either color or size is not selected
      console.error('Both color and size must be selected.');
      // Display a message to the user indicating the missing selection
    }
  };

  return (
    <div className="modal-container">
      <div >
      <span
        onClick={onClose}
        
      >
        &times; close
      </span>
      {data && (
        <div>
          {data.title && <h2>{data.title}</h2>}
          {data.product && (
            <div>
              <p>Product Name: {data.product.productName}</p>
              <p>Brand: {data.product.brand}</p>
              <p>Category: {data.product.category}</p>
              <p>Description: {data.product.description}</p>
              <p>Price: {data.product.price}</p>
              <p>Is Printable: {data.product.isPrintable ? 'Yes' : 'No'}</p>

              {/* Display colorImages */}
              {data.product.colorImages && (
                <div >
                  {Object.entries(data.product.colorImages).map(([color, image]) => (
                    <div key={color}>
                      <button
                        onClick={() => handleColorChange(color, image)}
                        style={{
                          backgroundColor: color,
                          border: 'none',
                          cursor: 'pointer',
                          padding: '5px 10px',
                          marginRight: '5px',
                        }}
                      >
                        {color}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Display the selected image */}
              {displayedImage && (
                <div>
                  <img src={displayedImage} alt={selectedColor} style={{ maxWidth: '100%' }} />
                </div>
              )}

              {/* Display available sizes as radio buttons */}
              <div>
                <label>Select Size:</label>
                {data.product.availableSizes.map((size) => (
                  <label key={size}>
                    <input
                      type="radio"
                      value={size}
                      checked={selectedSize === size}
                      onChange={() => handleSizeChange(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>

              {/* Button to add to cart */}
              <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
          )}
          {/* Display other data properties here */}
        </div>
      )}
    </div>
    </div>
  );
}

export default Modal;
