import { useEffect, useState } from "react";
import pb from "../services/pocketbase";
import useToast from "../hooks/useToast";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDelete from "./ConfirmDelete";

export default function SubmissionsList({refresh = null}) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletionId, setDeletionId] = useState("");


  const user = pb.authStore?.record;
  const showToast = useToast();

  const PER_PAGE = 5;

  const fetchSubmissions = async (pageNumber = 1) => {
    if(pageNumber == 1) setSubmissions([]);
    try {
      const result = await pb.collection("submissions").getList(pageNumber, PER_PAGE, {
        filter: `user="${user.id}"`,
        expand: "contest",
        sort: "-created",
      });

      const formatted = result.items.map((record) => ({
        id: record.id,
        title: record.title,
        caption: record.caption,
        contestName: record.expand?.contest?.name || "Unknown Contest",
        created: new Date(record.created),
        imageUrl: `${pb.baseURL}/api/files/submissions/${record.id}/${record.image}?thumb=400x320`,
      }));

      setSubmissions((prev) => [...prev, ...formatted]);
      setHasMore(result.page < result.totalPages);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
      setError(true);
      showToast("Failed to fetch your submissions", "error");
    }
  };

  function initLoad(){
    if (!user) return;

    const loadInitial = async () => {
      setLoading(true);
      await fetchSubmissions(1);
      setLoading(false);
    };

    loadInitial();
  }

  useEffect(() => initLoad(), [refresh]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    await fetchSubmissions(nextPage);
    setPage(nextPage);
    setLoadingMore(false);
  };

  async function handleDelete(){
    try{
      await pb.collection("submissions").delete(deletionId);
      showToast("Submission deleted successfully", "success");
      initLoad();
    } catch(err) {
      showToast("An error occured, could not delete submission", "error");
    } finally{
      setDeletionId("");
    }
  }

  return (
    <>
    <ConfirmDelete isOpen={showConfirmDelete} onClose={() => setShowConfirmDelete(false)} handleDelete={handleDelete}/>
    <ul className="list bg-base-200 rounded-box shadow-md md:max-h-[75vh] md:max-w-[40vw] overflow-y-auto">
      <li className="p-4 pb-2 text-xs font-bold tracking-wide">Your Submissions</li>

      {loading ? (
        Array.from({ length: 3 }).map((_, idx) => (
          <li key={idx} className="list-row gap-4 items-start p-4 border-b border-base-200">
            <div className="w-[200px] h-[160px] bg-base-200 rounded-box skeleton"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-base-200 rounded skeleton"></div>
              <div className="h-3 w-1/2 bg-base-200 rounded skeleton"></div>
              <div className="h-3 w-full bg-base-200 rounded skeleton"></div>
            </div>
          </li>
        ))
      ) : error ? (
        <li className="list-row p-4 text-sm alert alert-soft alert-error text-center">
          Something went wrong while fetching your submissions. 
          <button className="btn btn-error btn-outline" onClick={fetchSubmissions}>Retry</button>
        </li>
      ) : submissions.length === 0 ? (
        <li className="list-row p-4 text-sm text-center text-base-content opacity-60 alert alert-soft">
          You haven't submitted anything yet.
          <br />
          Submit something new now!
        </li>
      ) : (
        <>
          {submissions.map((submission) => (
            <li
              key={submission.id}
              className="list-row gap-4 items-start p-4 border-b border-base-200"
            >
              <div>
                <img
                  className="w-[200px] h-auto rounded-box object-cover"
                  src={submission.imageUrl}
                  alt="Submission"
                  width={400}
                  height={320}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">{submission.title} </div>
                  <button onClick={() => {setDeletionId(submission.id); setShowConfirmDelete(true);}} 
                          className="btn btn-square btn-sm hover:btn-warning btn-ghost"
                  ><FontAwesomeIcon icon={faTrash}/></button>
                </div>
                <div className="text-xs uppercase font-medium opacity-60">
                  Contest: {submission.contestName} 
                </div>
                <div className="text-xs uppercase font-medium opacity-60">
                  {submission.created.toLocaleString()}
                </div>
                <div className="text-sm mt-1 break-words">{submission.caption}</div>
              </div>
            </li>
          ))}
          {hasMore && (
            <li className="p-4 text-center">
              <button
                className="btn btn-sm btn-outline"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </li>
          )}
        </>
      )}
    </ul>

    </>
  );
}
