import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardImg, getEmptyCardMessage } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  // Define resetFilter function
  const resetFilter = () => {
    setSearchQuery("");
    setFilterType("");
    setDateRange({ from: null, to: null });
    getAllTravelStories();
  };

  // Fetch User Info
  const getUserInfo = async () => {
    try {
      const { data } = await axiosInstance.get("/user");
      if (data?.user) setUserInfo(data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Fetch All Travel Stories
  const getAllTravelStories = async () => {
    try {
      const { data } = await axiosInstance.get("/stories");
      if (data?.stories) setAllStories(data.stories);
    } catch (error) {
      console.error("Failed to fetch stories. Please try again.");
    }
  };

  // Toggle Favourite Status
  const updateIsFavourite = async (storyData) => {
    try {
      const { data } = await axiosInstance.put(
        `/stories/${storyData._id}/favourite`,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (data?.story) {
        toast.success("Story updated successfully.");
        refreshStories();
      }
    } catch (error) {
      console.error("Failed to update favourite status. Please try again.");
    }
  };

  // Delete Story
  const deleteTravelStory = async (data) => {
    try {
      const { data: response } = await axiosInstance.delete(
        `/stories/${data._id}`
      );
      if (response?.success) {
        toast.success("Story deleted successfully.");
        setOpenViewModal({ isShown: false });
        getAllTravelStories();
      }
    } catch (error) {
      console.error("Failed to delete story. Please try again.");
    }
  };

  // Search Story
  const onSearchNote = async (query) => {
    try {
      const { data } = await axiosInstance.get("/stories/search", {
        params: { query },
      });
      if (data?.stories) {
        setFilterType("search");
        setAllStories(data.stories);
      }
    } catch (error) {
      console.error("Failed to search stories. Please try again.");
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  // Filter Stories by Date
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const { data } = await axiosInstance.get("/stories/filter", {
          params: { startDate, endDate },
        });
        if (data?.stories) {
          setFilterType("date");
          setAllStories(data.stories);
        }
      }
    } catch (error) {
      console.error("Failed to filter stories by date. Please try again.");
    }
  };

  // Handle Day Click for Date Picker
  const handleDayClick = (day) => {
    setDateRange({ from: day.from, to: day.to });
    filterStoriesByDate({ from: day.from, to: day.to });
  };

  // Refresh Stories based on Filters
  const refreshStories = () => {
    if (filterType === "search" && searchQuery) {
      onSearchNote(searchQuery);
    } else if (filterType === "date") {
      filterStoriesByDate(dateRange);
    } else {
      getAllTravelStories();
    }
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={resetFilter} // Use the resetFilter function
        />

        <div className="flex gap-7">
          <div className="flex-1">
            {allStories?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={getEmptyCardImg(filterType)}
                message={getEmptyCardMessage(filterType)}
              />
            )}
          </div>

          <div className="w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick} // Set the onSelect prop
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add & Edit Travel Story Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View Travel Story Modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal({ isShown: false });
          }}
          onEditClick={() => {
            setOpenViewModal({ isShown: false });
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />

      {/* Display User Initials */}
      {userInfo && (
        <div className="absolute top-4 right-4 text-xl">
          {userInfo.firstName.charAt(0)}
          {userInfo.lastName.charAt(0)}
        </div>
      )}
    </>
  );
};

export default Home;
