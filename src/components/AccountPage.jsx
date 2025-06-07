import pb from "../services/pocketbase";
import Sidebar from "./SideBar";
import Navbar from "./NavBar";
import AccountCard from "./AccountCard";

export default function AccountPage(){

    return (
    <div className="flex min-h-screen">
        <Sidebar/>
        <div className="flex-1 w-full md:ml-16 flex-col">
            <Navbar>
                <span className="text-xl sm:text-xl">
                    <strong>Account Settings</strong>
                </span>
            </Navbar>
            <div className="content flex-1 m-3 mb-20 justify-center items-center flex">
                <AccountCard/>
            </div>
        </div>
        </div>
    );
}