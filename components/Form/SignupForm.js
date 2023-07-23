import React, { useState } from "react";
import axios from "axios";

import { Helmet } from "react-helmet";
import { ErrorText } from "./InputFeildElements";
import { BsPerson } from "react-icons/bs";
import { AiOutlineMail, AiOutlineUnlock } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import AppLogoTitle from "../AppLogoTitle";
import {
  Container,
  Form,
  FormTitle,
  InfoText,
  InfoTextContainer,
  Link,
} from "./FormElements";
import InputFeild from "./InputFeild";
import { Container as ButtonElements } from "../Button/ButtonElements";
import { getErrorMsg, loginUser } from "../../helpers";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Image from "next/image";

const SignupForm = () => {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false); // New state for hover effect
  const router = useRouter();

  const validateData = () => {
    const err = [];

    if (data.fullName.length < 4) {
      err.push({ fullName: "Full name must be at least 4 characters long" });
    } else if (data.fullName.length > 30) {
      err.push({ fullName: "Full name should be less than 30 characters" });
    }

    if (data.password.length < 6) {
      err.push({ password: "Password should be at least 6 characters long" });
    }

    if (data.password !== data.confirmPassword) {
      err.push({ confirmPassword: "Passwords don't match" });
    }

    setValidationErrors(err);

    return err.length === 0;
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    const isValid = validateData();

    if (isValid) {
      try {
        setLoading(true);
        const apiRes = await axios.post(
          "http://localhost:4000/api/auth/signup",
          data
        );

        if (apiRes?.data?.success) {
          const loginRes = await loginUser({
            email: data.email,
            password: data.password,
          });

          if (loginRes && !loginRes.ok) {
            setSubmitError(loginRes.error || "");
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMsg = error.response?.data?.error;
          setSubmitError(errorMsg);
        }
      }

      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleGoogleSignup = async () => {
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
    <React.Fragment>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>

      <Container
        style={{
          backgroundImage: 'url("/assets/login.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <AppLogoTitle />

        <Form onSubmit={handleSignup}>
          <FormTitle>Sign Up</FormTitle>

          <InputFeild
            type="text"
            placeholder="Full Name"
            value={data.fullName}
            name="fullName"
            onChange={handleInputChange}
            icon={<BsPerson />}
            required
            error={getErrorMsg("fullName", validationErrors)}
          />
          <InputFeild
            type="email"
            placeholder="Email"
            value={data.email}
            name="email"
            onChange={handleInputChange}
            icon={<AiOutlineMail />}
            required
          />
          <InputFeild
            type="password"
            placeholder="Password"
            value={data.password}
            name="password"
            onChange={handleInputChange}
            icon={<AiOutlineUnlock />}
            required
            error={getErrorMsg("password", validationErrors)}
          />
          <InputFeild
            type="password"
            placeholder="Confirm Password"
            value={data.confirmPassword}
            name="confirmPassword"
            onChange={handleInputChange}
            icon={<RiLockPasswordLine />}
            required
            error={getErrorMsg("confirmPassword", validationErrors)}
            style={{ marginBottom: "5rem" }}
          />

          <ButtonElements type="submit" title="Sign Up" disabled={loading}>
            Sign Up
          </ButtonElements>

          <ButtonElements
            title="Sign up with Google"
            onClick={handleGoogleSignup}
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
            Sign up with Google{" "}
            <Image src={"/assets/google.svg"} width="15" height="15" />
          </ButtonElements>

          {submitError && <ErrorText>{submitError}</ErrorText>}

          <InfoTextContainer>
            <InfoText>Already have an account?</InfoText>
            <Link href="/login">Login</Link>
          </InfoTextContainer>
        </Form>
      </Container>
    </React.Fragment>
  );
};

export default SignupForm;
