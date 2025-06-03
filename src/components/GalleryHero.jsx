import { useEffect, useState } from "react";
import pb from "../services/pocketbase";

export default function GalleryHero({ submissionId, isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !submissionId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const record = await pb.collection("submissions").getOne(submissionId, {
          expand: "user,contest"
        });
        setData(record);
      } catch (err) {
        console.error("Error fetching submission:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [submissionId, isOpen]);

  return (
    <>
      <input type="checkbox" checked={isOpen} readOnly className="modal-toggle" />
      <div className="modal" onClick={onClose}>
        <div className="modal-box max-w-3xl" onClick={(e) => {e.stopPropagation();}}>
          <button onClick={(e) => {e.stopPropagation(); onClose();}} className="btn btn-md btn-neutral btn-circle absolute right-5 top-5">✕</button>

          {loading ? (
            <div className="flex justify-center items-center h-40 font-bold uppercase">Loading...</div>
          ) : data ? (
            <div>
              <img
                src={`${pb.baseURL}/api/files/submissions/${data.id}/${data.image}`}
                alt={data.title}
                className="rounded-lg w-full object-cover mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{data.title}</h3>
              <p className="mb-2">{data.caption}</p>
              <p className="text-sm text-gray-500">By: {data.expand?.user?.name}</p>
              <p className="text-sm text-gray-500">Contest: {data.expand?.contest?.name}</p>
            </div>
          ) : (
            <div className="text-center text-red-500">Submission not found.</div>
          )}
        </div>
      </div>
    </>
  );
}
