import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export const Container = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  text-decoration: none;
  color: #24a0ed;
`;

export const AppTitle = styled.h2`
  font-size: 1.2rem;
`;

export const LogoImage = styled(Image)`
  margin-left: 0.5rem;
  height: 3.2rem;
  width: 3.2rem;
`;
