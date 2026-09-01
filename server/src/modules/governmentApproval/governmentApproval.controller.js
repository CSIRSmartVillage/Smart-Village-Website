import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  createGovernmentApproval,
  deleteGovernmentApproval,
  getGovernmentApprovalById,
  getGovernmentApprovals,
  getPublicGovernmentApprovals,
  updateGovernmentApproval,
} from "./governmentApproval.service.js";

export const create = asyncHandler(async (req, res) => {
  const approval = await createGovernmentApproval({
    payload: req.body,
    file: req.file,
    adminId: req.admin._id,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      approval,
      "Government approval uploaded successfully."
    )
  );
});

export const update = asyncHandler(async (req, res) => {
  const approval = await updateGovernmentApproval({
    id: req.params.id,
    payload: req.body,
    file: req.file,
    adminId: req.admin._id,
  });

  return res.json(
    new ApiResponse(
      200,
      approval,
      "Government approval updated successfully."
    )
  );
});

export const remove = asyncHandler(async (req, res) => {
  await deleteGovernmentApproval(req.params.id);

  return res.json(
    new ApiResponse(
      200,
      null,
      "Government approval deleted successfully."
    )
  );
});

export const getById = asyncHandler(async (req, res) => {
  const approval = await getGovernmentApprovalById(
    req.params.id
  );

  return res.json(
    new ApiResponse(
      200,
      approval,
      "Government approval fetched successfully."
    )
  );
});

export const getAll = asyncHandler(async (req, res) => {
  const approvals = await getGovernmentApprovals(
    req.query
  );

  return res.json(
    new ApiResponse(
      200,
      approvals,
      "Government approvals fetched successfully."
    )
  );
});

export const getByVillage = asyncHandler(
  async (req, res) => {
    const approvals =
      await getPublicGovernmentApprovals(
        req.params.villageSlug
      );

    res.set("Cache-Control", "no-store");

    return res.json(
      new ApiResponse(
        200,
        approvals,
        "Government approvals fetched successfully."
      )
    );
  }
);
