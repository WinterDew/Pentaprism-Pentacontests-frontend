import pb from "../services/pocketbase";
import Sidebar from '../components/SideBar';
import Navbar from '../components/NavBar';
import { useState, useEffect } from "react";
import GalleryList from "./GalleryList";


function GalleryPage() {

  useEffect(() => {document.title = "Gallery | Pentacontests"}, []);


  return (
    <div className="flex min-h-screen">
      <Sidebar/>
      <div className="flex-1 w-full md:ml-16 flex-col">
        <Navbar>
            <span className="text-xl sm:text-xl">
                <strong>Gallery</strong>
            </span>
        </Navbar>
        <div className="content flex-1 m-5 mb-20">
          <GalleryList></GalleryList>
        </div>
      </div>
    </div>
  );
}

export default GalleryPage;
