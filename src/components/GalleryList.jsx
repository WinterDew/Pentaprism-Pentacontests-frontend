import React, { useEffect, useState, useRef, useCallback } from "react";
import pb from "../services/pocketbase";
import GalleryHero from "./GalleryHero";

const PAGE_SIZE = 5;
const DELAY_MS = 500;

export default function GalleryList() {
  const [submissions, setSubmissions] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const loaderRef = useRef();
  const timeoutRef = useRef(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState("");
  const [heroOpen, setHeroOpen] = useState(false);


  const fetchSubmissions = useCallback(async () => {
    if (loading || !hasMore || error) return;
    setLoading(true);
    setError(false);
    try {
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, DELAY_MS);
      });

      const res = await pb.collection("submissions").getList(page, PAGE_SIZE, {
        expand: "user,contest",
        sort: "-created",
      });

      const newSubmissions = res.items;
      setSubmissions((prev) => [...prev, ...newSubmissions]);
      setHasMore(newSubmissions.length === PAGE_SIZE);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, error]);

  useEffect(() => {
    fetchSubmissions();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (error) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchSubmissions();
        }
      },
      { threshold: 1.0 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchSubmissions, hasMore, loading, error]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {submissions.map((sub) => (
        <div key={sub.id} className="card bg-base-100 shadow-xl">
          <figure>
            <img
              onClick={() => {setHeroOpen(false); setSelectedSubmissionId(sub.id); setHeroOpen(true);}}
              src={pb.files.getURL(sub, sub.image, { thumb: "400x320" })}
              alt={sub.title}
              className="max-w-full max-h-80 object-contain"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{sub.title}</h2>
            <p>
              {sub.expand.user.name} -{" "}
              <span className="uppercase font-bold opacity-60">
                {sub.expand.contest.name}
              </span>
            </p>
          </div>
        </div>
      ))}
      <div ref={loaderRef} className="flex justify-center col-span-full p-4">
        {loading && <span className="loading loading-spinner loading-lg"></span>}
        {error && (
          <div className="alert alert-error text-error-content alert-soft">
            Failed to load more submissions.{" "}
            <button
              className="btn btn-sm btn-outline mt-2"
              onClick={() => setError(false)}
            >
              Retry
            </button>
          </div>
        )}
      </div>
      <GalleryHero
        submissionId={selectedSubmissionId}
        isOpen={heroOpen}
        onClose={() => {setHeroOpen(false)}}
      />
    </div>
  );
}
