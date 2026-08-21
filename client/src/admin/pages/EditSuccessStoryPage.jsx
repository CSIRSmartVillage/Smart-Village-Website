import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import SuccessStoryForm
  from "../components/successStories/SuccessStoryForm";

import {
  getStoryById,
  updateStory,
} from "../services/successStory.service";

const EditSuccessStoryPage =
  () => {
    const { id } =
      useParams();

    const navigate =
      useNavigate();

    const [loading, setLoading] =
      useState(true);

    const [story, setStory] =
      useState(null);

    useEffect(() => {
      const loadStory =
        async () => {
          try {
            const data =
              await getStoryById(id);

            setStory({
              title:
                data.title || "",
              village:
                data.village?._id ||
                "",
              villageName:
                data.village?.name?.en ||
                data.village?.name?.regional ||
                data.village?.name ||
                "",
              featuredImage:
                data.featuredImage ||
                null,
              galleryImages:
                data.galleryImages || [],
              videoUrl:
                data.videoUrl || "",
              summary:
                data.summary || "",
              story:
                data.story || "",
              impact:
                data.impact || "",
              status:
                data.status ||
                "DRAFT",
            });
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };

      loadStory();
    }, [id]);

    const handleUpdate =
      async (data) => {
        try {
          await updateStory(
            id,
            data
          );

          navigate(
            "/admin/success-stories"
          );
        } catch (error) {
          console.error(error);
        }
      };

    if (loading) {
      return <h1>Loading...</h1>;
    }

    if (!story) {
      return (
        <h1>Story not found</h1>
      );
    }

    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">
          Edit Success Story
        </h1>

        <SuccessStoryForm
          initialValues={story}
          onSubmit={handleUpdate}
        />
      </div>
    );
  };

export default
  EditSuccessStoryPage;