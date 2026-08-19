import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useNavigate } from "react-router-dom";

import AnnouncementForm from "../components/announcements/AnnouncementForm";

import {
  createAnnouncement,
} from "../services/announcement.service";

const CreateAnnouncementPage = () => {
  const navigate =
    useNavigate();

  const handleSubmit =
    async (data) => {
      try {
        await createAnnouncement(
          data
        );

        alert(
          "Announcement created successfully"
        );

        navigate(
          "/admin/announcements"
        );
      } catch (error) {
        console.error(
          error
        );

        alert(
          getUserFriendlyError(error, "Unable to create the announcement. Please try again.")
        );
      }
    };

  return (
    <div className="p-6">

      <h1
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        Create Announcement
      </h1>

      <AnnouncementForm
        onSubmit={
          handleSubmit
        }
      />

    </div>
  );
};

export default CreateAnnouncementPage;
