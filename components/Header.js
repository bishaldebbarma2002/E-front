import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import {useContext, useState} from "react";
import {CartContext} from "@/components/CartContext";
import CartIcon from "@/components/icons/CartIcon";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "@/components/icons/SearchIcon";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";


const StyledHeader = styled.header`
  background-color: blue;
  position:sticky;
  top:0;
  z-index:10;
`;
const Logo = styled(Link)`
  color:white;
  font-size:20px;
  text-decoration:none;
  position: relative;
  z-index: 3;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;
const StyledNav = styled.nav`
  ${props => props.mobileNavActive ? `
    display: block;
  ` : `
    display: none;
  `}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: blue;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;
const NavLink = styled(Link)`
  display: block;
  color:white;
  font-size:20px;
  text-decoration:none;
  min-width:30px;
  padding: 10px 0;
  svg{
    height:20px;
  }
  @media screen and (min-width: 768px) {
    padding:0;
  }
  &:hover {
    color: white;
    border-bottom: 2px solid white;
  }
  &.active {
    color: black;
    font-weight: bold;
    border-bottom: 2px solid black;
  }
`;
const NavButton = styled.button`
  background-color: transparent;
  width: 40px;
  height: 40px;
  border:0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;
const SideIcons = styled.div`
  display: flex;
  align-items: center;
  a{
    display:inline-block;
    min-width:20px;
    color:white;
    svg{
      width:20px;
      height:20px;
    }
  }
`;

export default function Header() {
  const {cartProducts} = useContext(CartContext);
  const [mobileNavActive,setMobileNavActive] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/"); // Redirect to the home page after logout
  };

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href="/">Z-Kart</Logo>
          <StyledNav mobileNavActive={mobileNavActive}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">All products</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/account">Account</NavLink>
            {session ? (
              <NavButton onClick={handleLogout}>Logout</NavButton>
            ) : (
              <NavLink href="/login">Login</NavLink>
            )}
          </StyledNav>
          <NavLink href="/cart">
        <CartIcon />({cartProducts.length})
      </NavLink>
          <SideIcons>
            <Link href="/search">
              <SearchIcon />
            </Link>
            <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
              <BarsIcon />
            </NavButton>
          </SideIcons>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
