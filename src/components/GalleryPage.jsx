import pb from "../services/pocketbase";
import Sidebar from '../components/SideBar';
import Navbar from '../components/NavBar';
import { useState, useEffect } from "react";
import GalleryList from "./GalleryList";


function GalleryPage() {

  useEffect(() => {document.title = "Gallery | Pentacontests"}, []);
  const [selectedTab, setSelectedTab] = useState("1");
  const now = new Date().toISOString();

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
        <div className="tabs tabs-box tabs-border">
          <input type="radio" name="gallery-filters" value={"1"} className="tab" aria-label="Ongoing" checked={selectedTab === "1"} onChange={(e) => setSelectedTab(e.target.value)}/>
          <input type="radio" name="gallery-filters" value={"2"} className="tab" aria-label="All" checked={selectedTab === "2"} onChange={(e) => setSelectedTab(e.target.value)}/>
        </div>
        {selectedTab === "1" ? <GalleryList key={selectedTab} filters={`contest.start <= "${now}" && contest.deadline >= "${now}"`} /> : <GalleryList key={selectedTab} />}
        </div>
      </div>
    </div>
  );
}

export default GalleryPage;
