import React from "react";

const Navbar = ({ appName = "Pentacontests", userName = null }) => {
  return (
    <nav className="navbar px-4 py-3 items-around justify-center">
      <div className="flex-none">
        {userName ? (
          <span className="text-xl sm:text-xl">
            Hello, <strong>{userName}</strong>!
          </span>
        ) : (
          <a href="/login" className="btn btn-sm btn-primary">
            Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
