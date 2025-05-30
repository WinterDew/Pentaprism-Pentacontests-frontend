import pb from "../services/pocketbase";
import { useState, useEffect } from "react";
import useToast from "../hooks/useToast";

const ContestCarousel = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const now = new Date().toISOString();
        const records = await pb.collection("contests").getFullList({
          sort: "+deadline",
          filter: `deadline > "${now}"`,
        });
        setContests(records);
      } catch (error) {
        showToast("Failed to load contests", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const baseCardClass =
  "carousel-item flex flex-col justify-center items-center bg-base-200 p-8 rounded-2xl min-h-[220px] transition-all duration-300 ease-in-out";
  const loadedWidth = "w-1/2 md:w-1/3";
  const loadingWidth = "w-[250px]";

  return (
    <div className="flex flex-col gap-2 max-w-[90%]">
      <div className="text-3xl font-medium">Available Contests: </div>
      <div className="carousel carousel-center bg-base-300 rounded-box w-full space-x-4 p-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`${baseCardClass} ${loadingWidth}`}>
                <div className="skeleton h-6 w-2/3 mb-4" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-4/5 mb-2" />
                <div className="skeleton h-4 w-3/5" />
              </div>
            ))
          : contests.length === 0
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`${baseCardClass} ${loadedWidth}`}>
                <h2 className="text-2xl font-bold text-gray-500">
                  No contests
                </h2>
                <p className="mt-2 text-sm text-gray-400 text-center">
                  No contests are currently available.
                </p>
              </div>
            ))
          : contests.map((contest, index) => (
              <div
                key={contest.id}
                id={`item${index}`}
                className={`${baseCardClass} ${loadedWidth}`}
              >
                <h2 className="text-2xl font-bold">{contest.name}</h2>
                <p className="mt-2 text-center">{contest.description}</p>
                <div className="flex flex-col items-center justify-center text-left">
                  <p className="mt-2 text-sm text-gray-500">
                    Max Submissions: {contest.maxSubmissions} per person
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Deadline: {new Date(contest.deadline).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ContestCarousel;
