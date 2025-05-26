import { useEffect, useState, useRef } from "react";
import pb from "../services/pocketbase";

function HomePage() {
    const userEmail = pb.authStore.record.email;
    const userId = pb.authStore.record.id;
    const [contests, setContests] = useState([]);
    const [selectedContest, setSelectedContest] = useState("");
    const [caption, setCaption] = useState("");
    const imageRef = useRef(null);

    // Fetch contests on component mount
    useEffect(() => {
        async function fetchContests() {
            try {
                const records = await pb.collection('contests').getFullList();
                setContests(records);
            } catch (error) {
                console.error("Failed to fetch contests:", error);
            }
        }

        fetchContests();
    }, []);

    // Handle logout
    const handleLogout = () => {
        pb.authStore.clear();
        window.location.reload(); // force rerender/redirect if needed
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageFile = imageRef.current.files[0];

        const formData = new FormData();
        formData.append("user", userId);
        formData.append("contest", selectedContest);
        formData.append("caption", caption);
        if (imageFile) {
            formData.append("image", imageFile);
        }
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
          

        try {
            await pb.collection("submissions").create(formData);
            alert("Submission successful!");
            document.getElementById("submission_modal").close();
            setCaption("");
            setSelectedContest("");
        } catch (err) {
            console.error("Submission failed", err);
            if (err.data) {
              alert("Submission failed: " + JSON.stringify(err.data, null, 2));
            } else {
              alert("Submission failed: " + err.message);
            }
          }
          
    };

    return (
        <div className="min-h-screen bg-base-200 relative">
            {/* Navbar */}
            <div className="navbar bg-base-100 shadow pr-4">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Pentacontests</a>
                </div>
                <div className="flex items-center justify-center gap-4">
                    <div className="text-sm font-bold underline">{userEmail}</div>
                    <button onClick={handleLogout} className="btn btn-outline btn-sm">
                        Log Out
                    </button>
                </div>
            </div>

            {/* Contest Cards */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map(contest => (
                    <div key={contest.id} className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">{contest.name}</h2>
                            <p>{contest.description}</p>
                            <div className="mt-2 text-sm text-gray-500">
                                Max Submissions: {contest.maxSubmissions}<br />
                                Deadline: {new Date(contest.deadline).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Action Button */}
            <button
                className="btn btn-primary rounded-full fixed bottom-6 right-6 w-16 h-16 text-2xl"
                onClick={() => document.getElementById("submission_modal").showModal()}
            >
                +
            </button>

            {/* Submission Modal */}
            <dialog id="submission_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Submit to a Contest</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                        <label className="form-control w-full">
                            <span className="label-text">Select Contest</span>
                            <select
                                className="select select-bordered w-full"
                                value={selectedContest}
                                onChange={(e) => setSelectedContest(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a contest</option>
                                {contests.map(contest => (
                                    <option key={contest.id} value={contest.id}>
                                        {contest.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text">Caption</span>
                            <input
                                type="text"
                                placeholder="Your caption..."
                                className="input input-bordered w-full"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                required
                            />
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text">Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                ref={imageRef}
                                className="file-input file-input-bordered w-full"
                                required
                            />
                        </label>

                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button type="button" className="btn" onClick={() => document.getElementById("submission_modal").close()}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
}

export default HomePage;
