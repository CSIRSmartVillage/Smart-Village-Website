import { useNavigate }
  from "react-router-dom";

import SuccessStoryForm
  from "../components/successStories/SuccessStoryForm";

import {
  createStory,
} from "../services/successStory.service";

const CreateSuccessStoryPage =
  () => {
    const navigate =
      useNavigate();

    const handleCreate =
      async (data) => {
        try {
          await createStory(data);

          navigate(
            "/admin/success-stories"
          );
        } catch (error) {
          console.error(error);
        }
      };

    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">
          Create Success Story
        </h1>

        <SuccessStoryForm
          initialValues={{
            title: "",
            village: "",
            featuredImage: null,
            galleryImages: [],
            videoUrl: "",
            summary: "",
            story: "",
            impact: "",
            status: "DRAFT",
          }}
          onSubmit={handleCreate}
        />
      </div>
    );
  };

export default
  CreateSuccessStoryPage;