import ImageUploadBox from "../components/AddImage";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { addPost, updatePost } from "../utils/postStorage";

interface editProps {
  type?: string;
  editImg?: string;
  editTitle?: string;
  editDes?: string;
  editsteps?: string[];
  editID?: number;
}

export default function AddPost({
  type,
  editImg,
  editTitle,
  editDes,
  editsteps,
  editID,
}: editProps) {
  const navigate = useNavigate();
  const [image, setImage] = useState(editImg ?? "");
  const [title, setTitle] = useState(editTitle ?? "");
  const [description, setDescription] = useState(editDes ?? "");
  const [stepCount, setStepCount] = useState(type === "edit" ? (editsteps?.length ?? 1) : 1);
  const [steps, setSteps] = useState<string[]>([""]);
  const [editSteps, setEditSteps] = useState<string[]>(editsteps?.length ? editsteps : [""]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSteps = type === "edit" ? editSteps : steps;
  const setActiveSteps = type === "edit" ? setEditSteps : setSteps;

  const handleStepChange = (index: number, value: string) => {
    const updated = [...activeSteps];
    updated[index] = value;
    setActiveSteps(updated);
  };

  const handleStepCountChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const count = Number(e.target.value);
    setStepCount(count);

    setActiveSteps((prev) => {
      const updated = [...prev];
      if (count > updated.length) {
        while (updated.length < count) {
          updated.push("");
        }
      } else {
        updated.length = count;
      }
      return updated;
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStepCount(1);
    setSteps([""]);
    setEditSteps([""]);
    setImage("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      activeSteps.some((step) => !step.trim()) ||
      !image
    ) {
      setStatusMessage("Please complete all recipe steps and add an image.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      let postStatus;
      if (type === "edit" && editID !== undefined){
        postStatus = updatePost(editID, {
          title: title.trim(),
          description: description.trim(),
          steps: activeSteps.map((step) => step.trim()).filter(Boolean),
          image: image || editImg || "",
        });

      } else {
        postStatus = addPost({
          title: title.trim(),
          description: description.trim(),
          steps: activeSteps.map((step) => step.trim()),
          image,
        });
      }

      if (postStatus) {
        resetForm();
        setStatusMessage("Post published successfully!");
        navigate(`/recipes/${postStatus.id}?type=post`);
      } else {
        setStatusMessage("Please sign in before publishing a post.");
      }
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Could not publish post. The image may be too large.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-white/50 bg-white/70 p-6 shadow-[0_25px_80px_rgba(139,90,60,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="rounded-[30px] border border-[#C47A2C]/15 bg-[#FFF8EA]/70 p-4 sm:p-6">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8B5A3C]/70">
                {type === "edit" ? "Edit Post" : "Create Post"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[#3A2419] sm:text-4xl">
                Share your next favorite recipe
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-[#6D4C41]/90">
                Add a warm, appetizing image and describe the dish in a way that
                feels polished and inviting.
              </p>
            </div>

            <ImageUploadBox
              image={image}
              onImageSelect={setImage}
              editImg={editImg}
              type={type}
            />
          </div>

          <div className="flex flex-col justify-center rounded-[30px] border border-[#C47A2C]/15 bg-white/70 p-6 shadow-sm sm:p-8">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-[#8B5A3C]">
                  Title
                </label>
                <input
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title..."
                  required
                  className="w-full rounded-full border border-[#C47A2C]/20 bg-white/60 px-4 py-3 text-[#3A2419] placeholder:text-[#8B5A3C]/50 outline-none transition-all duration-300 focus:border-[#C47A2C] focus:ring-4 focus:ring-[#E59B1E]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-[#8B5A3C]">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell people what makes this dish special..."
                  required
                  className="w-full resize-none rounded-[20px] border border-[#C47A2C]/20 bg-white/60 px-4 py-3 text-[#3A2419] placeholder:text-[#8B5A3C]/50 outline-none transition-all duration-300 focus:border-[#C47A2C] focus:ring-4 focus:ring-[#E59B1E]/20"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-[#8B5A3C]">
                  Recipe Steps
                </label>

                <select
                  value={stepCount}
                  onChange={handleStepCountChange}
                  className="w-full rounded-full border border-[#C47A2C]/20 bg-white/60 px-4 py-3 text-[#3A2419] outline-none transition-all duration-300 focus:border-[#C47A2C] focus:ring-4 focus:ring-[#E59B1E]/20"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Step{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>

                <div className="space-y-4">
                  {activeSteps.map((_ , index) => (
                    <div key={index}>
                      <label className="mb-2 block text-sm font-medium text-[#8B5A3C]">
                        Step {index + 1}
                      </label>

                      <textarea
                        value={activeSteps[index] ?? ""}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        rows={3}
                        placeholder={`Write step ${index + 1}...`}
                        className="w-full resize-none rounded-[20px] border border-[#C47A2C]/20 bg-white/60 px-4 py-3 text-[#3A2419] placeholder:text-[#8B5A3C]/50 outline-none transition-all duration-300 focus:border-[#C47A2C] focus:ring-4 focus:ring-[#E59B1E]/20"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {statusMessage ? (
                <p className="text-sm text-[#8B5A3C]">{statusMessage}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#C47A2C] px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8B5A3C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? type === "edit"
                    ? "Editing..."
                    : "Publishing..."
                  : type === "edit"
                    ? "Save Changes"
                    : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}