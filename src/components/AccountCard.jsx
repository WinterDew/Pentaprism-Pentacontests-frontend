import React, { useEffect, useState } from 'react';
import pb from '../services/pocketbase';
import ChangeNameCard from './ChangeNameForm';
import useTheme from '../hooks/useTheme';
import ConfirmLogout from './ConfirmLogout';


const AccountCard = () => {
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [theme, setTheme] = useTheme("nord");
    const [isDark, setIsDark] = useState(theme === "sunset");
    const [userName, setUserName] = useState(pb.authStore.record.name.split(" ")[0]);

    function handleNameChange(){
        setUserName(pb.authStore.record.name.split(" ")[0]);
    }
    function handleThemeChange(){
        setIsDark(!isDark);
        setTheme(!isDark ? "sunset" : "nord");
    }
  return (
    <div className="card bg-base-100 shadow-xl border-base-300 border w-md max-w-full p-2">

      <div className="card-body">
        <h1 className='card-title text-2xl mb-2'>Hello {userName}👋</h1>
        <div className="collapse collapse-arrow bg-base-200 border-base-300 border w-full">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title font-semibold">Change Name</div>
            <div className="collapse-content text-sm w-full">
                <ChangeNameCard onNameChange={handleNameChange}/>
            </div>
        </div>

        <div className="w-full bg-base-200 border-base-300 border rounded-box p-5 font-semibold flex items-center justify-between">
            <span>Dark Mode: </span> 
            <input type="checkbox" value="sunset" checked={isDark} className="toggle toggle-info theme-controller" onChange={handleThemeChange}/>
        </div>

        <div className="card-actions justify-end mt-3">
            <button className='btn btn-error' onClick={() => setShowConfirmLogout(true)}>Logout</button>
        </div>
      </div>
      <ConfirmLogout
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
      />
    </div>
  );
};

export default AccountCard;