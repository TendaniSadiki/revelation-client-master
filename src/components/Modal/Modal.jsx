import { Timestamp, addDoc, collection, doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { auth, db } from '../../config/firebase';

const modalStyle = {
  border: '1px solid #ccc',
  padding: '20px',
  maxWidth: '400px',
  margin: '0 auto',
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const colorImagesStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '10px 0',
};

const closeButtonStyle = {
  float: 'right',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: 'bold',
};

function Modal({ data, onAddToCart, onClose }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [displayedImage, setDisplayedImage] = useState(null);

  const handleColorChange = (color, image) => {
    setSelectedColor(color);
    setDisplayedImage(image);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

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
      }
    } else {
      // Handle the case where either color or size is not selected
      console.error('Both color and size must be selected.');
    }
  };
  
  

  return (
    <div style={modalStyle}>
      <span
        onClick={onClose}
        style={{ ...closeButtonStyle, marginRight: '5px' }}
      >
        &times;
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
                <div style={colorImagesStyle}>
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
  );
}

export default Modal;
