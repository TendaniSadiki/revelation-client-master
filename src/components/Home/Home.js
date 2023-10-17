import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaTshirt } from 'react-icons/fa';
import Modal from "../Modal/Modal";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

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
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductsForAllUsers();
  }, []);

  // Open modal with selected product
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedColor(product.availableColors[0]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Filter products based on the selected category
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);

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

      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
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
                  className="InventoryImage"
                />
              ) : (
                <FaTshirt size={50} />
              )}
              <p>Product Name: {product.productName}</p>
              <p>Price: {product.price}</p>
              <p>Colors: {product.availableColors.join(", ")}</p>
              <p>User UID: {product.userUid}</p>
              <button onClick={() => { openModal(product); }}>View Details</button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <Modal
          data={{ title: 'Product Details', product: selectedProduct, selectedColor: selectedColor }}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default Home;
