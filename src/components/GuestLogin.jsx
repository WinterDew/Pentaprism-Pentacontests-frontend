import pb from "../services/pocketbase";
import useToast from "../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function GuestLogin(){
    const showToast = useToast();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    async function handleLogin(){
        try{
            const authData = await pb.collection('users').authWithPassword(username, password);
            console.log(authData);
        } catch(err){
            showToast("Login Failed, Please try again, Contact Administrator if error persists", "error");
            console.log(error);
        }

        showToast("Logged in successfully", "success");
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-screen bg-base-200">
            <div className="card card-border w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body items-center text-center">
                <h1 className="text-3xl font-bold">Pentacontests</h1>
                <p className="py-2 text-sm text-gray-500">
                    External login requires credentials from Administrator.
                </p>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <p className="label">Username</p>
                    <input type="text" className="input" placeholder="abc@example.com" onChange={(event) => {setUsername(event.target.value)}}/>
                    <p className="label">Password</p>
                    <input type="password" className="input" placeholder="*********" onChange={(event) => {setPassword(event.target.value)}}/>
                </fieldset>
                <div className="card-actions w-full mt-4">
                    <button className="btn btn-neutral w-full" onClick={handleLogin}>Login</button>
                    <div className="divider w-full"> ☉ </div>
                    <button className="btn btn-outline w-full" onClick={() => {navigate("/login")}}>Have a IIIT Account</button>
                </div>
                </div>
            </div>
        </div>

    )
}