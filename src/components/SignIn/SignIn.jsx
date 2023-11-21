import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { TextInput } from '../Constance/Constance'; // Import your custom TextInput component

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true); // Initially assuming email is verified

  useEffect(() => {
    // Check if the user's email is verified when the component mounts
    if (auth.currentUser) {
      setIsEmailVerified(auth.currentUser.emailVerified);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (!isEmailVerified) {
        // User's email is not verified, send them a verification email
        await sendEmailVerification(auth.currentUser);
        setError('Please verify your email. We have sent a verification link to your email address.');
        return;
      }
      // Handle successful sign-in (e.g., redirect user to the dashboard)
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signin-container">
      {error && <div className="error-message">{error}</div>}
      {isEmailVerified ? null : (
        <div className="error-message">
          Your email is not verified. Please check your email for a verification link.
        </div>
      )}
      <form>
        <TextInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete = "true"
        />
        <TextInput
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleSignIn}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
