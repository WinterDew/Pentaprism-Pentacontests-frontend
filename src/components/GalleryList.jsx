import React, { useEffect, useState, useRef, useCallback } from "react";
import pb from "../services/pocketbase";
import GalleryHero from "./GalleryHero";
import LikeButton from "../components/LikeButton";

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
  const isFetchingRef = useRef(false);

  const [selectedSubmissionId, setSelectedSubmissionId] = useState("");
  const [heroOpen, setHeroOpen] = useState(false);

  // New states for batched like info
  const [likeCounts, setLikeCounts] = useState({});
  const [likedMap, setLikedMap] = useState({}); // submissionId -> likeRecordId if liked by user

  const userId = pb.authStore.record?.id;

  // Fetch submissions (paging)
  const fetchSubmissions = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || error) return;

    isFetchingRef.current = true;
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
      isFetchingRef.current = false;
    }
  }, [page, hasMore, error]);

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

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchSubmissions, hasMore, loading, error]);

  // Batch fetch like counts and user likes for currently loaded submissions
  useEffect(() => {
    if (!submissions.length || !userId) return;

    const fetchLikesForSubmissions = async () => {
      const submissionIds = submissions.map((s) => s.id);

      // Fetch like counts
      const filterCounts = submissionIds
        .map((id) => `submission="${id}"`)
        .join(" || ");

      const countsRes = await pb.collection("likes").getList(1, 1000, {
        filter: filterCounts,
        perPage: 1000,
      });

      // Initialize counts map
      const counts = {};
      submissionIds.forEach((id) => (counts[id] = 0));
      countsRes.items.forEach((like) => {
        counts[like.submission] = (counts[like.submission] || 0) + 1;
      });

      // Fetch user likes
      const filterUserLikes = `user="${userId}" && (${submissionIds
        .map((id) => `submission="${id}"`)
        .join(" || ")})`;

      const userLikesRes = await pb.collection("likes").getList(1, 1000, {
        filter: filterUserLikes,
        perPage: 1000,
      });

      // Map submissionId -> likeRecordId (if liked)
      const likedMapNew = {};
      userLikesRes.items.forEach((like) => {
        likedMapNew[like.submission] = like.id;
      });

      setLikeCounts(counts);
      setLikedMap(likedMapNew);
    };

    fetchLikesForSubmissions().catch((err) =>
      console.error("Error fetching likes:", err)
    );
  }, [submissions, userId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {submissions.map((sub) => (
        <div key={sub.id} className="card bg-base-100 shadow-xl">
          <figure>
            <img
              onClick={() => {
                setHeroOpen(false);
                setSelectedSubmissionId(sub.id);
                setHeroOpen(true);
              }}
              src={pb.files.getURL(sub, sub.image, { thumb: "400x320" })}
              alt={sub.title}
              className="max-w-full max-h-80 object-contain"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title flex items-center justify-between">
              {sub.title}{" "}
              <LikeButton
                submissionId={sub.id}
                liked={!!likedMap[sub.id]}
                likeRecordId={likedMap[sub.id] || null}
                likeCount={likeCounts[sub.id] || 0}
                onLikeChange={({ liked, likeRecordId, likeCount }) => {
                  // Update maps on like/unlike for instant UI update
                  setLikedMap((prev) => {
                    const copy = { ...prev };
                    if (liked) copy[sub.id] = likeRecordId;
                    else delete copy[sub.id];
                    return copy;
                  });
                  setLikeCounts((prev) => ({
                    ...prev,
                    [sub.id]: likeCount,
                  }));
                }}
              />
            </h2>
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
        onClose={() => setHeroOpen(false)}
      />
    </div>
  );
}
