import { useState } from "react";
import { MdAdd, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-toastify";
import moment from "moment";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [form, setForm] = useState({
    title: storyInfo?.title || "",
    story: storyInfo?.story || "",
    tags: storyInfo?.tags || [],
    imageUrl: storyInfo?.imageUrl || "",
    visitedLocation: storyInfo?.visitedLocation || "",
    visitedDate: storyInfo?.visitedDate || null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Handle Form Update
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let imageUrl = form.imageUrl;

      if (form.imageUrl instanceof File) {
        imageUrl = await uploadImage(form.imageUrl);
      }

      const requestData = {
        title: form.title,
        story: form.story,
        tags: form.tags,
        imageUrl,
        visitedLocation: form.visitedLocation,
        visitedDate: moment(form.visitedDate).valueOf(),
      };

      if (type === "edit") {
        // Update existing story
        const { data } = await axiosInstance.put(
          `/api/stories/${storyInfo._id}`,
          requestData
        );
        if (data?.story) toast.success("Story updated successfully.");
      } else {
        // Create new story
        const { data } = await axiosInstance.post("/api/stories", requestData);
        if (data?.story) toast.success("Story added successfully.");
      }

      getAllTravelStories();
      onClose();
    } catch (error) {
      console.error("Failed to submit the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[600px]">
      <div className="flex justify-between mb-4">
        <h1 className="text-[18px] text-slate-600 font-semibold">
          {type === "edit" ? "Edit Travel Story" : "Add Travel Story"}
        </h1>
        <MdClose
          className="text-[24px] text-slate-600 hover:text-primary cursor-pointer"
          onClick={onClose}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-slate-600">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-slate-600">Story</label>
          <textarea
            name="story"
            value={form.story}
            onChange={handleFormChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows={5}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-slate-600">Visited Location</label>
          <input
            type="text"
            name="visitedLocation"
            value={form.visitedLocation}
            onChange={handleFormChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-slate-600">Visited Date</label>
          <DateSelector
            selectedDate={form.visitedDate}
            onDateChange={(date) =>
              setForm((prevForm) => ({ ...prevForm, visitedDate: date }))
            }
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-slate-600">Image</label>
          <ImageSelector
            selectedImage={form.imageUrl}
            onImageChange={(image) =>
              setForm((prevForm) => ({ ...prevForm, imageUrl: image }))
            }
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-slate-600">Tags</label>
          <TagInput
            tags={form.tags}
            onTagsChange={(tags) =>
              setForm((prevForm) => ({ ...prevForm, tags }))
            }
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-lg hover:bg-cyan-400 focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Loading...</span>
            ) : type === "edit" ? (
              <>
                <MdUpdate className="text-[18px]" />
                Update
              </>
            ) : (
              <>
                <MdAdd className="text-[18px]" />
                Add
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditTravelStory;
