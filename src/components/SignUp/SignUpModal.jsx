import React from "react";
import SignUp from "../SignUp/SignUp";

const SignUpModal = ({ closeModal }) => {
  return (
    <div>
      
      <SignUp closeModal={closeModal} />
    </div>
  );
};

export default SignUpModal;
