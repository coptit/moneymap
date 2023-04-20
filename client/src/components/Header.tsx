import { logo, wallet, split, logout } from "../assets";
import React from "react";

const Header = () => {
  return (
    <header className="w-full bg-[#49A8FF] py-4">
      <div className="w-[80%] flex justify-between m-auto">
        <a href="/">
          <img src={logo} alt="logo" />
        </a>
        <div className="flex gap-8">
          <a className="hover:opacity-[50%]" href="/">
            <img src={split} alt="split" />
          </a>
          <a className="hover:opacity-[50%]" href="/">
            <img src={wallet} alt="wallet" />
          </a>
          <a
            onClick={() => {
              window.localStorage.removeItem("user");
            }}
            className="hover:opacity-[50%]"
            href="/"
          >
            <img src={logout} className="h-7" alt="wallet" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
