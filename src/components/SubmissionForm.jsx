import pb from "../services/pocketbase";
import useToast from "../hooks/useToast";
import { useEffect, useRef, useState } from "react";

export default function SubmissionForm({onSubmit = null}) {
  const [contests, setContests] = useState([]);
  const showToast = useToast();
  const [maxSubmissionSize, setMaxSubmissionSize] = useState(0);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [contest, setContest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputElementRef = useRef(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const now = new Date().toISOString();
        const records = await pb.collection("contests").getFullList({
          sort: "+deadline",
          filter: `deadline > "${now}" && start < "${now}"`,
        });
        setContests(records);
        // console.log(records);
      } catch (error) {
        showToast("Failed to load contest list", "error");
      }
    };
    fetchContests();
  }, []);

  async function handleSubmit() {
    if (!contest || title.trim() === "" || !file) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
  
    if (file.size / (1024 * 1024) > maxSubmissionSize) {
      showToast("File size exceeds the maximum allowed.", "error");
      return;
    }
    if(file.type != "image/png" && file.type != "image/jpeg"){
      showToast("File should be a JPEG or a PNG only.", "error");
      return;
    }

    const result = await pb.collection("submissions").getList(1, 1, {
      filter: `user="${pb.authStore.record.id}" && contest="${contest}"`,
    });
    
    const count = result.totalItems;
    const matchedContest = contests.find(c => c.id === contest);
    
    if(count >= matchedContest.maxSubmissions && matchedContest.maxSubmissions != 0){
      showToast(`Sorry, Maximum submissions limits for ${matchedContest.name} by you is reached.`, "error");
      return;
    }
  
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("contest", contest);
      formData.append("image", file);
      formData.append("user", pb.authStore.record.id);
  
      const record = await pb.collection("submissions").create(formData);
      showToast("Submission successful!", "success");
  
      setTitle("");
      setCaption("");
      setFile(null);
      setContest("");
      fileInputElementRef.current.value = "";
      onSubmit?.();
      
    } catch (err) {
      console.error(err);
      showToast("Submission failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }
  

  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-4 max-w-[90%]">
      <legend className="fieldset-legend">New Submission:</legend>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Contests:
          <div
            className={`status ${
              contest == "" ? "status-error animate-bounce" : "status-success"
            }`}
          />
        </legend>
        <select
          className="select"
          value={contest}
          onChange={async (event) => {
            setContest(`${event.target.value}`);
            var contest = await pb
              .collection("contests")
              .getOne(`${event.target.value}`);
            setMaxSubmissionSize(contest.maxSize);
          }}
        >
          <option disabled={true} value="">
            Select a Contest
          </option>
          {contests.map((contest, index) => {
            return (
              <option key={contest.id} value={contest.id}>
                {contest.name}
              </option>
            );
          })}
        </select>
        <span className="label">Only contests you can submit to are shown</span>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Title
          <div
            className={`status ${
              title == "" ? "status-error animate-bounce" : "status-success"
            }`}
          />
        </legend>
        <input
          type="text"
          value={title}
          className="input"
          placeholder="Type title here..."
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </fieldset>

      <fieldset>
        <legend className="fieldset-legend">Caption</legend>
        <textarea
          value={caption}
          className="textarea"
          placeholder="Type your caption/description here..."
          onChange={(event) => {
            setCaption(event.target.value);
          }}
        ></textarea>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Upload an Image
          <div
            className={`status ${
              file == null ? "status-error animate-bounce" : "status-success"
            }`}
          />
        </legend>
        <div className="join">
          <input
            type="file"
            ref={fileInputElementRef}
            className="file-input rounded-md"
            accept="image/jpeg, image/png"
            onChange={(event) => {
              setFile(event.target.files[0]);
              console.log(event.target.files[0]);
            }}
          />
          {file == null ? (
            ""
          ) : (
            <div className="btn opacity-60">
              {Math.trunc((file.size / (1024 * 1024)) * 100) / 100} /{" "}
              {maxSubmissionSize} MB{" "}
              <div
                className={
                  file.size / (1024 * 1024) < maxSubmissionSize
                    ? "status status-success"
                    : "status status-error"
                }
              />
            </div>
          )}
        </div>
        <label className="label">
          JPEG and PNG supported. Max{" "}
          {maxSubmissionSize == 0 ? (
            <div className="loading loading-ring loading-xs" />
          ) : (
            maxSubmissionSize
          )}{" "}
          MB
        </label>
      </fieldset>

      <button className="btn btn-neutral mt-4"
              disabled={submitting}
              onClick={handleSubmit}
            >
            {submitting == false ? "Submit" : <div className="loading loading-dots"/>}
      </button>
    </fieldset>
  );
}
