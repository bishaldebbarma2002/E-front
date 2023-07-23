import React, { useState } from "react";
import { useRouter } from "next/router";
import { AiOutlineMail, AiOutlineUnlock } from "react-icons/ai";
import { loginUser } from "../../helpers";
import AppLogoTitle from "../AppLogoTitle";
import { Container as ButtonElements } from "../Button/ButtonElements";
import {
  Container,
  Form,
  FormTitle,
  InfoText,
  InfoTextContainer,
  Link,
} from "./FormElements";
import InputFeild from "./InputFeild";
import { ErrorText } from "./InputFeildElements";
import { signIn } from "next-auth/react";
import Image from "next/image";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isGoogleHovered, setIsGoogleHovered] = useState(false); // New state for hover effect
  const router = useRouter();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const loginRes = await loginUser({ email, password });

      if (loginRes && !loginRes.ok) {
        setSubmitError(loginRes.error || "");
      } else {
        router.push("/");
      }
    } catch (error) {
      setSubmitError("An error occurred. Please try again.");
      console.error(error);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await signIn("google", { callbackUrl: "/" });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleMouseEnter = () => {
    setIsGoogleHovered(true);
  };

  const handleGoogleMouseLeave = () => {
    setIsGoogleHovered(false);
  };

  return (
    <Container
      style={{
        backgroundImage: 'url("/assets/login.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <AppLogoTitle />
      <Form onSubmit={handleLogin}>
        <FormTitle style={{ color: "darkblue", textShadow: "0 0 0.3px black" }}>
          Login
        </FormTitle>

        <InputFeild
          placeholder="Email"
          type="email"
          icon={<AiOutlineMail />}
          value={email}
          onChange={handleEmailChange}
          required
        />

        <InputFeild
          placeholder="Password"
          type="password"
          icon={<AiOutlineUnlock />}
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <Link href="/forgot-password">Forgot Password?</Link>

        <ButtonElements type="submit" title="Login" disabled={loading}>
          Login
        </ButtonElements>

        <ButtonElements
          title="Sign in with Google"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            backgroundColor: isGoogleHovered ? "black" : "white",
            color: isGoogleHovered ? "white" : "black",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
          }}
          onMouseEnter={handleGoogleMouseEnter}
          onMouseLeave={handleGoogleMouseLeave}
        >
          Sign in with Google{" "}
          <Image src={"/assets/google.svg"} width="15" height="15" />
        </ButtonElements>

        {submitError && <ErrorText>{submitError}</ErrorText>}

        <InfoTextContainer>
          <InfoText>New User?</InfoText>
          <Link href="/signup">Create an Account</Link>
        </InfoTextContainer>
      </Form>
    </Container>
  );
};

export default LoginForm;
