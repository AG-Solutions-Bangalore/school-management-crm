import { styled } from "@mui/material";
import { Link } from "react-router-dom";
import { LoginImageUrl } from "../../../base/BaseUrl";

import CrmLogo from "../../../assets/Companylogo/ppvn-logo.png";
const LinkStyled = styled(Link)(() => ({
  height: "65px",
  width: "220px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const LargeLinkStyled = styled(Link)(() => ({
  height: "63px",
  width: "63px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const Logo = ({ isCollapsed }) => {
  return (
    <>
      {!isCollapsed ? (
        <LinkStyled to="/home">
          <img
            src={CrmLogo}
            alt="logo"
            // className="h-16"
            className="h-[3.4rem]"
          />
        </LinkStyled>
      ) : (
        <LargeLinkStyled to="/home">
          <img
            src={`${LoginImageUrl}/ppvn.png`}
            alt="logo"
            className="h-[2rem]"
          />
        </LargeLinkStyled>
      )}
    </>
  );
};

export default Logo;
