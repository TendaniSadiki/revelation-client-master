import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaTshirt } from 'react-icons/fa';
import AuthModal from "./AuthModal";
import Loader from "../Loader/Loader";
import "./HomeOffline.css"; // Import your CSS file

const HomeOffline = () => {
  const [products, setProducts] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState("signin");
  const [loading, setLoading] = useState(true); // State to track loading

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
        setLoading(false); // Data is loaded, set loading to false
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Handle the error and set loading to false
      }
    };

    fetchProductsForAllUsers();
  }, []);

  // Open the Auth Modal with the specified type (Sign In or Sign Up)
  const openAuthModal = (type) => {
    setAuthModalType(type);
    setIsAuthModalOpen(true);
  };

  // Handle product click
  const handleProductClick = (product) => {
    // Check if the user is authenticated and show the appropriate modal
    if (!isUserAuthenticated()) {
      if (product.category === "SpecialCategory") { // Replace "SpecialCategory" with your specific category
        openAuthModal("signup");
      } else {
        openAuthModal("signin");
      }
    } else {
      // Handle the case when the user is authenticated
      // For example, you can show product details here
      console.log("User is authenticated. Show product details.");
    }
  };

  // Simulated function to check user authentication
  const isUserAuthenticated = () => {
    // Replace this with your actual authentication logic
    // For example, check if the user is logged in
    return false;
  };

  return (
    <div className="Home">
      <h2>Home</h2>

      {loading ? ( // Display the loader while loading is true
        <Loader />
      ) : (
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id} className="product-item">
              <div className="product-details">
                {/* Display product details when authenticated, else open auth modal */}
                <div onClick={() => handleProductClick(product)}>
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
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isAuthModalOpen && (
        <AuthModal
          modalType={authModalType}
          closeModal={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default HomeOffline;
