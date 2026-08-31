import { useNavigate }
  from "react-router-dom";

import LaboratoryForm
  from "../components/laboratories/LaboratoryForm";

import {
  createLaboratory,
} from "../services/laboratory.service";

const CreateLaboratoryPage =
  () => {

    const navigate =
      useNavigate();

    const handleCreate =
      async (data) => {

        await createLaboratory(data);

        navigate(
          "/admin/laboratories"
        );
      };

    return (
      <div>

        <h1 className="text-4xl font-bold mb-8">
          Create Laboratory
        </h1>

        <LaboratoryForm
          initialValues={{
            name: "",
            slug: "",
            type: "",
            heroImage: "",
            directorName: "",
            overview: "",
            researchAreas: [""],
            contributions: [""],
            address: "",
            phone: "",
            email: "",
            website: "",
            members: [],
            isPublished: true,
          }}
          onSubmit={
            handleCreate
          }
        />

      </div>
    );
  };

export default
  CreateLaboratoryPage;
