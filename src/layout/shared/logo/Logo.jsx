import { styled } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../../assets/Companylogo/dfc.png";
import { LoginImageUrl } from "../../../base/BaseUrl";

const LinkStyled = styled(Link)(() => ({
  height: "63px",
  width: "180px",
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
            src={`${LoginImageUrl}/ppvn.png`}
            alt="logo"
            className="h-16"
            priority
          />
        </LinkStyled>
      ) : (
        <LargeLinkStyled to="/home">
          <img
            src={`${LoginImageUrl}/ppvn.png`}
            alt="logo"
            className="h-[2rem]"
            priority
          />
        </LargeLinkStyled>
      )}
    </>
  );
};

export default Logo;
