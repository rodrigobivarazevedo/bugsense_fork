import React from "react";
import { ReactSVG } from "react-svg";
import logo from "../assets/logo.svg";

export interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 200,
  height = 33,
  className = "",
}) => {
  return (
    <div style={{ width, height }} className={className}>
      <ReactSVG src={logo} />
    </div>
  );
};

export default Logo;

