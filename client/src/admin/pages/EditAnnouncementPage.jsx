import { getUserFriendlyError } from "../../utils/userFriendlyError";
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import AnnouncementForm from "../components/announcements/AnnouncementForm";

import {
  getAnnouncementById,
  updateAnnouncement,
} from "../services/announcement.service";

const EditAnnouncementPage = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [
    announcement,
    setAnnouncement,
  ] = useState(null);

  useEffect(() => {
    loadAnnouncement();
  }, []);

  const loadAnnouncement =
    async () => {
      try {
        const data =
          await getAnnouncementById(
            id
          );

        setAnnouncement(
          data
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  const handleSubmit =
    async (data) => {
      try {
        await updateAnnouncement(
          id,
          data
        );

        alert(
          "Announcement updated successfully"
        );

        navigate(
          "/admin/announcements"
        );
      } catch (error) {
        console.error(
          error
        );

        alert(
          getUserFriendlyError(error, "Unable to update the announcement. Please try again.")
        );
      }
    };

  if (!announcement) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        Edit Announcement
      </h1>

      <AnnouncementForm
        initialData={
          announcement
        }
        onSubmit={
          handleSubmit
        }
      />

    </div>
  );
};

export default EditAnnouncementPage;
