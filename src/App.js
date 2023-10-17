import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { auth, db } from "./config/firebase";
import Signup from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";
import { collection, doc, getDoc } from "firebase/firestore";
import "./App.css"
import Cart from "./components/Cart/Cart";

function App() {
  const [user, setUser] = useState(null);
  const [isUser, setisUser] = useState(false); // State to track admin role

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
  
        // Fetch user role from Firestore and check if it's admin
        const userDocRef = doc(collection(db, "users"), authUser.uid);
  
        try {
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists() && userDocSnapshot.data().role === "user") {
            setisUser(true);
          } else {
            setisUser(false);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          // Handle error state here, e.g., set isUser to false or show an error message
          setisUser(false);
        }
      } else {
        setUser(null);
        setisUser(false); // Reset admin status if not authenticated
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setisUser(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isEmailVerified = user && user.emailVerified;

  return (
    <Router>
      <div className="App">
        {isEmailVerified && isUser && (
          <nav>
            <ul>
            <li>
              <NavLink to="/home">Home</NavLink>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
              <li>
              <NavLink to="/cart">Cart</NavLink>
              </li>
            </ul>
          </nav>
        )}

        <Routes>
          {isEmailVerified && isUser ? (
            <>
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/*" element={<Home />} />
            <Route path="/*" element={<Navigate to="/home" />} />

            </>
          ) : (
            <>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/*" element={<Signup/>} />
            </>
          )}

         
        </Routes>
      </div>
    </Router>
  );
}

export default App;