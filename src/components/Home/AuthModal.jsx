import React, { useState } from 'react';
import SignInModal from '../SignIn/SignInModal';
import SignUpModal from '../SignUp/SignUpModal';
import './AuthModal.css'; // Add this line

const AuthModal = ({ closeModal, modalType }) => {
  const [authType, setAuthType] = useState(modalType || 'signin');

  const switchAuthType = () => {
    if (authType === 'signin') {
      setAuthType('signup');
    } else {
      setAuthType('signin');
    }
  };

  return (
    <div className="auth-modal-container">
      <div className="auth-modal">
        <div className="auth-header">
          <h2>{authType === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        {authType === 'signin' ? (
          <SignInModal />
        ) : (
          <SignUpModal />
        )}
        <p>
          {authType === 'signin'
            ? "Don't have an account? "
            : "Already have an account? "}
          <button onClick={switchAuthType}>
            {authType === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
