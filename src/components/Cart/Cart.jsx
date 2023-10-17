import React, { useEffect, useState } from 'react';
import { db, auth } from '../../config/firebase';
import { collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedColorImage, setSelectedColorImage] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userEmail, setUserEmail] = useState(''); // State to hold the user's email
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Get the user's email and set it in the state
      setUserEmail(user.email);

      const fetchCartItems = async () => {
        try {
          const userCollectionRef = collection(db, 'users');
          const userDocRef = doc(userCollectionRef, user.uid);

          const cartCollectionRef = collection(userDocRef, 'cart');
          const q = query(cartCollectionRef);

          const querySnapshot = await getDocs(q);

          const items = [];
          let total = 0;

          querySnapshot.forEach((doc) => {
            const cartItem = { id: doc.id, ...doc.data() };
            items.push(cartItem);

            const itemPrice = parseFloat(cartItem.product.price);
            total += itemPrice;
          });

          setCartItems(items);
          setTotalPrice(total.toFixed(2));

          if (items.length > 0) {
            const firstCartItem = items[0];
            setSelectedColorImage(
              firstCartItem.product.colorImages[firstCartItem.selectedColor]
            );
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      };

      fetchCartItems();
    }
  }, [user]);

  const handleCartItemClick = (cartItem) => {
    setSelectedColorImage(cartItem.product.colorImages[cartItem.selectedColor]);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const userCollectionRef = collection(db, 'users');
      const userDocRef = doc(userCollectionRef, user.uid);
      const cartItemDocRef = doc(collection(userDocRef, 'cart'), itemId);

      await deleteDoc(cartItemDocRef);

      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      // Create a batch to update multiple documents in a single batch
      const batch = db.batch();

      // For each item in the cart, calculate and update the quantity
      cartItems.forEach((cartItem) => {
        const itemDocRef = doc(collection(db, 'products'), cartItem.id);
        const newQuantity = cartItem.product.quantity - 1; // Subtract one from the quantity

        // Update the product's quantity in Firestore
        batch.update(itemDocRef, { quantity: newQuantity });
      });

      // Commit the batch to update all product quantities at once
      await batch.commit();

      // After updating quantities, you can proceed with the checkout logic here
      alert('Checkout successful!');

      // Clear the cart
      setCartItems([]);
      setTotalPrice(0);
      setSelectedColorImage(null);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Cart</h2>
      <div className="user-email">
        <p>User Email: {userEmail}</p>
      </div>
      <div className="selected-color-image">
        {selectedColorImage && (
          <img src={selectedColorImage} alt="Selected Color" className="color-image" />
        )}
      </div>
      <ul className="cart-list">
        {cartItems.map((item) => (
          <li key={item.id} className="cart-item" onClick={() => handleCartItemClick(item)}>
            <p className="item-name">Product Name: {item.product.productName}</p>
            <p>Price: R {item.product.price}</p>
            <p>Color: {item.selectedColor}</p>
            <p>Size: {item.selectedSize}</p>
            <button onClick={() => handleDeleteItem(item.id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
      <p className="total-price">Total Price: R {totalPrice}</p>
      <button onClick={handleCheckout} className="checkout-button">Checkout</button>
    </div>
  );
}

export default Cart;
