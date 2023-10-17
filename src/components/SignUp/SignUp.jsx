import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { NavLink } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import "./SignUp.css";
import { TextInput } from "../Constance/Constance"; // Import your custom TextInput component

const SignUp = () => {
  // State variables for user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleGetStarted = () => {
    setStep(0);
  };

  const handleSignUp = async () => {
    try {
      if (step === 0) {
        handleGetStarted();
      } else if (step === 1) {
        // Create user account with email and password
        await createUserWithEmailAndPassword(auth, email, password);

        // Send email verification
        sendEmailVerification(auth.currentUser);

        // Set role to "user"

        // Save user data
        const userData = {
          username,
          phoneNumber,
          role: "user",
        };

        // Save user data to Firestore
        const userCollectionRef = collection(db, "users");
        const userUid = auth.currentUser.uid;
        const userDocRef = doc(userCollectionRef, userUid);
        await setDoc(userDocRef, userData);

        setStep(5); // Skip steps 2 and 3
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-container">
      {step === 1 && (
        <>
          <h2>Step 1: Provide Email, Password, Username, and Phone Number</h2>
          {error && <div className="error-message">{error}</div>}
          <form>
            <TextInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextInput
              type="tel"
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button type="button" onClick={handleSignUp}>
              Next
            </button>
          </form>
          <p>
            Already have an account? <NavLink to="/signin">Sign In</NavLink>
          </p>
        </>
      )}

      {/* ... other step rendering blocks ... */}
    </div>
  );
};

export default SignUp;
