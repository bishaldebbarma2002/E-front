import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import AppLogoTitle from "../AppLogoTitle";
import { Container, Form, FormTitle } from "./ForgotPasswordElements";
import InputFeild from "./InputFeild";
import { Container as ButtonElements } from "../Button/ButtonElements";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Container>
      <AppLogoTitle />

      <Form onSubmit={handleSubmit}>
        <FormTitle> Forgot Password </FormTitle>

        <InputFeild
          placeholder="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          icon={<AiOutlineMail />}
          required
        />

        <ButtonElements title="Submit" type="submit">
          Submit
        </ButtonElements>
      </Form>
    </Container>
  );
};

export default ForgotPasswordForm;
