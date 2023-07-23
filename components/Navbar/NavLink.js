import React from "react";
import { useRouter } from "next/router";
import { NavLink as Link } from "./NavElements";
import { NavLinkProps } from "../../types/propTypes";

const NavLink = ({ route, children, color, large, onClick }) => {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <Link
      href={route}
      onClick={onClick}
      color={color}
      large={large}
      className={currentRoute === route ? "active" : ""}
    >
      {children}
    </Link>
  );
};

export default NavLink;
