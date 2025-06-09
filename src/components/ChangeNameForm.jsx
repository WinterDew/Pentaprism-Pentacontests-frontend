import pb from "../services/pocketbase";
import { useEffect, useState } from "react";
import useToast from "../hooks/useToast";

export default function ChangeNameCard({onNameChange = null}){
    const showToast = useToast();
    const [currentName, setCurrentName] = useState(pb.authStore.record.name);

    async function handleSubmit() {
        try {
          const updatedRecord = await pb.collection("users").update(pb.authStore.record.id, {
            name: currentName.trim(),
          });
    
          await pb.collection("users").authRefresh();
    
          showToast("Name updated successfully!", "success");
          onNameChange?.();
        } catch (error) {
          console.error("Update failed:", error);
          showToast("Failed to update name.", "error");
        }
      }

    return (
        <fieldset className="fieldset bg-base-200 rounded-box w-full p-1">
            <label className="input">
              <div className={`status ${pb.authStore.record.name === currentName.trim() ? "status-warning animate-pulse" : currentName.trim().length < 4 ? "status-error animate-bounce" : "status-success animate-none" }`} />
              <input type="text" placeholder="John Doe" value={currentName} onChange={(event) => {setCurrentName(event.target.value)}}/>
            </label>
            <p className="label max-w-xs text-wrap">Full name is shown if no spaces present, else only first part is shown on homepage.</p>

            <div className="join">
                <button className="btn join-item btn-soft mt-4" onClick={() => setCurrentName(pb.authStore.record.name)}>Cancel</button>
                <button className="btn join-item btn-info mt-4" onClick={handleSubmit} disabled={pb.authStore.record.name === currentName.trim() || currentName.trim().length < 4}>Save</button>
            </div>
        </fieldset>
    );
}