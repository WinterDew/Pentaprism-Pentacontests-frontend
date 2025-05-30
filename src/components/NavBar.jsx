import React from "react";

const Navbar = ({ children }) => {
  return (
    <nav className="navbar px-4 py-3 items-around justify-center">
      <div className="flex-none">
        {children}
      </div>
    </nav>
  );
};

export default Navbar;
