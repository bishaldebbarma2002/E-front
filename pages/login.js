import React, { useContext } from "react";
import LoginForm from "@/components/Form/LoginForm";
import { CartContext } from "@/components/CartContext";

const Login = () => {
  const { login } = useContext(CartContext);

  const handleLogin = (user) => {
    // Perform your login logic here
    // Once the user is logged in, call the login function from the CartContext
    login(user);
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default Login;
