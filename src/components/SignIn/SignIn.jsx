import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { TextInput } from '../Constance/Constance'; // Import your custom TextInput component
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setIsEmailVerified(auth.currentUser.emailVerified);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (!isEmailVerified) {
        await sendEmailVerification(auth.currentUser);
        setError('Please verify your email. We have sent a verification link to your email address.');
        return;
      }
      // Handle successful sign-in (e.g., redirect user to the dashboard)
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setError('Password reset email sent. Please check your email for further instructions.');
      closeForgotPasswordModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
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
          
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="true"
          placeholder="Enter your email" // Placeholder for email input
        />
        <TextInput
          type="password"
          
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password" // Placeholder for password input
        />
        <button type="button" onClick={handleSignIn}>
          Sign In
        </button>
        <button type="button" onClick={openForgotPasswordModal}>
          Forgot Password?
        </button>
      </form>

      {isForgotPasswordModalOpen && (
        <div className="forgot-password-modal">
          <div>
            <h2>Forgot Password</h2>
            <p>Enter your email address to reset your password.</p>
            <TextInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="true"
              placeholder="Enter your email" // Placeholder for email input
            />
            <button type="button" onClick={handleForgotPassword}>
              Reset Password
            </button>
            <button type="button" onClick={closeForgotPasswordModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
