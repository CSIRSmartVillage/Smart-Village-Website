import Laboratory from "../../models/Laboratory.model.js";

export const createLaboratory =
  async (payload) => {
    return Laboratory.create(payload);
  };

export const getAllLaboratories =
  async () => {
    return Laboratory.find()
      .populate("heroImage")
      .populate("members.photo")
      .sort({ createdAt: -1 });
  };

export const getLaboratoryById =
  async (id) => {
    return Laboratory.findById(id)
      .populate("heroImage")
      .populate("members.photo");
  };

export const getLaboratoryBySlug =
  async (slug) => {
    return Laboratory.findOne({
      slug,
    })
      .populate("heroImage")
      .populate("members.photo");
  };


  export const getNodalLaboratory =
  async () => {
    return Laboratory.findOne({
      type: "NODAL",
      isPublished: true,
    })
      .populate("heroImage")
      .populate("members.photo");
  };

export const updateLaboratory =
  async (id, payload) => {
    return Laboratory.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
      }
    )
      .populate("heroImage")
      .populate("members.photo");
  };

export const deleteLaboratory =
  async (id) => {
    return Laboratory.findByIdAndDelete(
      id
    );
  };
