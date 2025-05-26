import { useEffect, useState } from "react";
import pb from "../services/pocketbase";

function HomePage() {
    const userEmail = pb.authStore.record.email;
    const [contests, setContests] = useState([]);

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

    // Logout handler
    const handleLogout = () => {
        pb.authStore.clear();
    };

    return (
        <div className="min-h-screen bg-base-200">
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
        </div>
    );
}

export default HomePage;
