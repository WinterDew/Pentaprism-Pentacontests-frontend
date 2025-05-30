import { useEffect, useState, useRef } from "react";
import pb from "../services/pocketbase";
import useToast from '../hooks/useToast.js';
import Sidebar from "../components/SideBar";
import Navbar from "./NavBar.jsx";

function SubmissionsPage() {

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 w-full md:ml-16 flex-col">
        <Navbar>
            <span className="text-xl sm:text-xl">
                <strong>Your Submissions</strong>!
            </span>
        </Navbar>
        <div className="content flex-1 flex items-center justify-center m-5">
            {/* Content here */}
        </div>
      </div>
    </div>
  );
}

export default SubmissionsPage;
