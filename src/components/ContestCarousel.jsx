import pb from "../services/pocketbase";
import { useState, useEffect } from "react";

const ContestCarousel = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const records = await pb.collection("contests").getFullList({
          sort: "+deadline",
        });
        setContests(records);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false); // Stop loading after fetch attempt
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="flex flex-col gap-2 max-w-[90%]">
      <div className="text-3xl font-medium">Available Contests: </div>
      <div className="carousel carousel-center bg-base-300 rounded-box max-w-4xl space-x-4 p-4">
        {loading
          ? // Skeleton placeholder cards (3 shown as an example)
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="carousel-item w-1/2 flex flex-col justify-center items-center bg-base-200 p-8 rounded-2xl"
              >
                <div className="skeleton h-6 w-2/3 mb-4" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-4/5 mb-2" />
                <div className="skeleton h-4 w-3/5" />
              </div>
            ))
          : // Actual contest data
            contests.map((contest, index) => (
              <div
                key={contest.id}
                id={`item${index}`}
                className="carousel-item max-w-1/2 flex flex-col justify-center items-center bg-base-200 p-8 rounded-2xl"
              >
                <h2 className="text-2xl font-bold">{contest.name}</h2>
                <p className="mt-2">{contest.description}</p>
                <div className="flex flex-col items-end justify-center text-right">
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
