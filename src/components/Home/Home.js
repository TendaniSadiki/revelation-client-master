import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import {  FaTshirt } from 'react-icons/fa';
import Modal from "../Modal/Modal";
import "./Home.css";
import Loader from "../Loader/Loader";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const [loading, setLoading] = useState(true); // Track loading state
  console.log(products)
  useEffect(() => {
    const fetchProductsForAllUsers = async () => {
      try {
        const adminsCollectionRef = collection(db, "admins");
        const adminsSnapshot = await getDocs(adminsCollectionRef);

        const allProductsData = [];

        for (const adminDoc of adminsSnapshot.docs) {
          const userUid = adminDoc.id;
          const productsCollectionRef = collection(adminDoc.ref, "products");
          const querySnapshot = await getDocs(productsCollectionRef);

          querySnapshot.forEach((doc) => {
            allProductsData.push({ id: doc.id, ...doc.data(), userUid });
          });
        }

        setProducts(allProductsData);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchProductsForAllUsers();
  }, []);

  // Open modal with selected product
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedColor(product.availableColors[0]);
    setIsModalOpen(true);
    console.log("Color Quantities:", product.colorQuantities);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Filter products based on the selected category
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);
// Assume you want to retrieve the quantity for the product at index 2 (for example)
const productIndex = 2; // Change this to the desired index

if (filteredProducts.length > productIndex) {
  const quantity = filteredProducts[productIndex].quantity;
  console.log(`Quantity for product at index ${productIndex}: ${quantity}`);
} else {
  ;
}

  return (
    <div className="Home">
      <h2>Home</h2>

      {/* Add category selection buttons */}
      <div>
        <button onClick={() => setSelectedCategory("All")}>All</button>
        <button onClick={() => setSelectedCategory("Winter")}>Winter</button>
        <button onClick={() => setSelectedCategory("Summer")}>Summer</button>
        <button onClick={() => setSelectedCategory("Accessories")}>Accessories</button>
      </div>

      {loading ? ( // Display Loader while loading
        <Loader />
      ) : (
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id} className="product-item">
              <div>
                {product.colorImages ? (
                  <img
                    src={
                      product.colorImages.Blue ||
                      product.colorImages.Red ||
                      product.colorImages.Green ||
                      product.colorImages.Brown ||
                      product.colorImages.Black ||
                      product.colorImages.White ||
                      product.colorImages.Yellow ||
                      product.colorImages.Orange ||
                      product.colorImages.Purple
                    }
                    alt="product"
                    className="inventory-image"
                  />
                ) : (
                  <FaTshirt size={50} />
                )}
                <p className="product-name">Product Name: {product.productName}</p>
                <p className="product-price">Price: R{product.price}</p>
                <p className="product-colors">Colors: {product.availableColors.join(", ")}</p>
                <p className="product-user-uid">User UID: {product.userUid}</p>
                <button onClick={() => { openModal(product); }}>View Details</button>
              </div>
            </li>
          ))}
        </ul>
      )}

{isModalOpen && (
  
  <Modal
  
    data={{
      
      title: 'Product Details',
      product: selectedProduct,
      selectedColor: selectedColor,
      colorQuantities: selectedProduct.colorQuantities, // Pass the quantity
    }}
    closeModal={closeModal}
  />
)}

    </div>
  );
};

export default Home;
