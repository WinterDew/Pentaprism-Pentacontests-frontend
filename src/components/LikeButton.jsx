import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import pb from "../services/pocketbase";
import useToast from "../hooks/useToast";

export default function LikeButton({
  submissionId,
  liked: likedProp = false,
  likeRecordId: likeRecordIdProp = null,
  likeCount: likeCountProp = 0,
  onLikeChange = () => {},
}) {
  const [liked, setLiked] = useState(likedProp);
  const [likeRecordId, setLikeRecordId] = useState(likeRecordIdProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [animate, setAnimate] = useState(false);
  const showToast = useToast();

  // Sync local state if props change (e.g. after page load)
  // Optional: only if you expect props to change after mount
  useEffect(() => {
    setLiked(likedProp);
  }, [likedProp]);

  useEffect(() => {
    setLikeRecordId(likeRecordIdProp);
  }, [likeRecordIdProp]);

  useEffect(() => {
    setLikeCount(likeCountProp);
  }, [likeCountProp]);

  const userId = pb.authStore.record?.id;

  const toggleLike = async () => {
    if (!submissionId || !userId) {
      showToast("Cannot like: Missing submission or user ID.", "error");
      return;
    }
  
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  
    try {
      if (liked) {
        // Before deleting, check if the like record exists on server
        try {
          await pb.collection("likes").getOne(likeRecordId);
          // If found, delete it
          await pb.collection("likes").delete(likeRecordId);
          setLiked(false);
          setLikeRecordId(null);
          setLikeCount((prev) => prev - 1);
          showToast("Unliked", "info");
        } catch (err) {
          // If record doesn't exist, notify user or sync state
          console.warn("Like record not found on server, syncing state.");
          setLiked(false);
          setLikeRecordId(null);
          // Optionally refetch like count from server here
          showToast("Like record not found, updated state.", "info");
        }
      } else {
        // Before creating, check if like already exists for this user and submission
        const existingLikes = await pb
          .collection("likes")
          .getFullList(1, {
            filter: `submission="${submissionId}" && user="${userId}"`,
          });
  
        if (existingLikes.length > 0) {
          const existingLike = existingLikes[0];
          setLiked(true);
          setLikeRecordId(existingLike.id);
          showToast("Already liked.", "info");
        } else {
          const res = await pb.collection("likes").create({
            submission: submissionId,
            user: userId,
          });
          setLiked(true);
          setLikeRecordId(res.id);
          setLikeCount((prev) => prev + 1);
          showToast("Liked!", "success");
        }
      }
    } catch (err) {
      console.error("Like toggle error:", err);
      showToast("Something went wrong. Please try again.", "error");
    }
  };
  

  return (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-1 text-2xl transition-transform duration-300 ${
        animate ? "scale-125" : "scale-100"
      } ${liked ? "text-red-500" : "text-gray-400"}`}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
      <span className="text-base">{likeCount}</span>
    </button>
  );
}
