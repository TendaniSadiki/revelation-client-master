import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { auth, db } from "./config/firebase";
import Home from "./components/Home/Home";
import { collection, doc, getDoc } from "firebase/firestore";
import "./App.css";
import Cart from "./components/Cart/Cart";
import HomeOffline from "./components/Home/HomeOffiline";
import Loader from "./components/Loader/Loader";

function App() {
  const [user, setUser] = useState(null);
  const [isUser, setisUser] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

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
          setisUser(false);
        } finally {
          setLoading(false); // Set loading to false when finished
        }
      } else {
        setUser(null);
        setisUser(false);
        setLoading(false); // Set loading to false when not authenticated
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
        {loading ? ( // Display Loader component while loading
          <Loader />
        ) : (
          isEmailVerified && isUser && (
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
          )
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
              <Route path="/*" element={<HomeOffline />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
