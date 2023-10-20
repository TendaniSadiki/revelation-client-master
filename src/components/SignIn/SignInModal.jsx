import React from "react";
import SignIn from "../SignIn/SignIn";

const SignInModal = ({ closeModal }) => {
  return (
    <div>
      <h2>Sign In</h2>
      <SignIn closeModal={closeModal} />
    </div>
  );
};

export default SignInModal;
