import ApiError from "../../utils/ApiError.js";
import MonitoringCommitteeMember, {
  MONITORING_COMMITTEE_ROLES,
} from "./MonitoringCommitteeMember.model.js";
import MonitoringCommitteeSettings, {
  DEFAULT_MONITORING_COMMITTEE_SUBTITLE,
  DEFAULT_COMMITTEE_HEADINGS,
} from "./MonitoringCommitteeSettings.model.js";

const ROLE_ORDER = new Map(
  MONITORING_COMMITTEE_ROLES.map((role, index) => [role, index])
);

const hasOwn = (value, key) =>
  Object.prototype.hasOwnProperty.call(value, key);

const cleanText = (value) => String(value || "").trim();

const sortMembers = (members) =>
  [...members].sort((a, b) => {
    const roleDifference =
      (ROLE_ORDER.get(a.role) ?? 99) -
      (ROLE_ORDER.get(b.role) ?? 99);

    if (roleDifference !== 0) return roleDifference;

    const orderDifference =
      Number(a.displayOrder || 0) - Number(b.displayOrder || 0);

    if (orderDifference !== 0) return orderDifference;

    return new Date(a.createdAt) - new Date(b.createdAt);
  });

const memberOrThrow = async (id) => {
  const member = await MonitoringCommitteeMember.findById(id)
    .populate("photo")
    .populate("createdBy", "username email")
    .populate("updatedBy", "username email");

  if (!member) {
    throw new ApiError(404, "Monitoring Committee member not found.");
  }

  return member;
};

const assertChairmanAvailable = async (excludedId = null) => {
  const query = { role: "CHAIRMAN" };

  if (excludedId) {
    query._id = { $ne: excludedId };
  }

  if (await MonitoringCommitteeMember.exists(query)) {
    throw new ApiError(
      409,
      "A Chairman already exists. Edit or change the existing Chairman first."
    );
  }
};

const nextDisplayOrder = async (role) => {
  const lastMember = await MonitoringCommitteeMember.findOne({ role: roleFilter(role) })
    .sort({ displayOrder: -1, createdAt: -1 })
    .select("displayOrder")
    .lean();

  return Number(lastMember?.displayOrder || 0) + 1;
};

const toPublicMember = (member) => ({
  _id: member._id,
  photo: member.photo || null,
  name: member.name || "",
  designation: member.designation || "",
  roleLabel: member.roleLabel || "",
  phone: member.phone || "",
  email: member.email || "",
  role: member.role,
  displayOrder: member.displayOrder || 0,
});

export const getPublicMonitoringCommittee = async () => {
  const members = await MonitoringCommitteeMember.find()
    .populate("photo")
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean();

  return sortMembers(await normalizeMembers(members)).map(toPublicMember);
};

export const getMonitoringCommitteeSettings = async () => {
  const settings = await MonitoringCommitteeSettings.findOne({
    singletonKey: "monitoring-committee",
  })
    .select(["subtitle", "rows", ...Object.keys(DEFAULT_COMMITTEE_HEADINGS)].join(" "))
    .lean();

  return {
    ...Object.fromEntries(
      Object.entries(DEFAULT_COMMITTEE_HEADINGS).map(([key, value]) => [
        key, settings?.[key] ?? value,
      ])
    ),
    subtitle:
      settings?.subtitle ??
      DEFAULT_MONITORING_COMMITTEE_SUBTITLE,
  };
};

export const updateMonitoringCommitteeSettings = async (
  payload,
  adminId
) => {
  return MonitoringCommitteeSettings.findOneAndUpdate(
    { singletonKey: "monitoring-committee" },
    {
      $set: {
        ...Object.fromEntries(
          ["subtitle", "chairmanHeading"]
            .filter((key) => hasOwn(payload, key))
            .map((key) => [key, cleanText(payload[key])])
        ),
        updatedBy: adminId,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  );
};

export const getAdminMonitoringCommittee = async () => {
  const members = await MonitoringCommitteeMember.find()
    .populate("photo")
    .populate("createdBy", "username email")
    .populate("updatedBy", "username email")
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean();

  return sortMembers(await normalizeMembers(members));
};

const assertFixedRole = (role) => {
  if (!MONITORING_COMMITTEE_ROLES.includes(role)) throw new ApiError(400, "Select Chairman, Committee Members, or Other Members.");
};

// Read legacy roles and saved dynamic row titles without losing existing people.
const normalizeMembers = async (members) => {
  const settings = await MonitoringCommitteeSettings.findOne({ singletonKey: "monitoring-committee" }).lean();
  const legacyKeys = { CONVENER: "conveyersHeading", HEAD: "headHeading", OTHER: "otherHeading" };
  return members.map(member => ({
    ...member,
    role: ["CHAIRMAN", "MEMBER"].includes(member.role) ? member.role : "OTHER",
    roleLabel: member.roleLabel || settings?.rows?.find(row => row.id === member.role)?.title || settings?.[legacyKeys[member.role]] || DEFAULT_COMMITTEE_HEADINGS[legacyKeys[member.role]] || "",
  }));
};
const roleFilter = role => role === "OTHER" ? { $nin: ["CHAIRMAN", "MEMBER"] } : role;

export const createMonitoringCommitteeMember = async (
  payload,
  adminId
) => {
  assertFixedRole(payload.role);
  if (payload.role === "CHAIRMAN") {
    await assertChairmanAvailable();
  }

  const displayOrder = hasOwn(payload, "displayOrder")
    ? Number(payload.displayOrder)
    : await nextDisplayOrder(payload.role);

  const member = await MonitoringCommitteeMember.create({
    photo: payload.photo || null,
    name: cleanText(payload.name),
    designation: cleanText(payload.designation),
    roleLabel: cleanText(payload.roleLabel),
    phone: cleanText(payload.phone),
    email: cleanText(payload.email),
    role: payload.role,
    displayOrder,
    createdBy: adminId,
    updatedBy: adminId,
  });

  return memberOrThrow(member._id);
};

export const updateMonitoringCommitteeMember = async (
  id,
  payload,
  adminId
) => {
  const member = await MonitoringCommitteeMember.findById(id);

  if (!member) {
    throw new ApiError(404, "Monitoring Committee member not found.");
  }

  const nextRole = payload.role || (["CHAIRMAN", "MEMBER"].includes(member.role) ? member.role : "OTHER");
  assertFixedRole(nextRole);

  if (nextRole === "CHAIRMAN" && member.role !== "CHAIRMAN") {
    await assertChairmanAvailable(member._id);
  }

  if (hasOwn(payload, "photo")) member.photo = payload.photo || null;
  if (hasOwn(payload, "name")) member.name = cleanText(payload.name);
  if (hasOwn(payload, "designation")) {
    member.designation = cleanText(payload.designation);
  }
  if (hasOwn(payload, "phone")) member.phone = cleanText(payload.phone);
  if (hasOwn(payload, "roleLabel")) member.roleLabel = cleanText(payload.roleLabel);
  if (hasOwn(payload, "email")) member.email = cleanText(payload.email);

  if (nextRole !== member.role) {
    member.role = nextRole;
    member.displayOrder = hasOwn(payload, "displayOrder")
      ? Number(payload.displayOrder)
      : await nextDisplayOrder(nextRole);
  } else if (hasOwn(payload, "displayOrder")) {
    member.displayOrder = Number(payload.displayOrder);
  }

  member.updatedBy = adminId;
  await member.save();

  return memberOrThrow(member._id);
};

export const deleteMonitoringCommitteeMember = async (id) => {
  const member = await MonitoringCommitteeMember.findById(id);

  if (!member) {
    throw new ApiError(404, "Monitoring Committee member not found.");
  }

  await member.deleteOne();
  return true;
};

export const reorderMonitoringCommitteeMembers = async ({
  role,
  orderedIds,
  adminId,
}) => {
  const members = await MonitoringCommitteeMember.find({
    role: roleFilter(role),
    _id: { $in: orderedIds },
  })
    .select("_id")
    .lean();

  if (members.length !== orderedIds.length) {
    throw new ApiError(
      400,
      "Reorder list contains missing members or members from another role."
    );
  }

  await MonitoringCommitteeMember.bulkWrite(
    orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, role: roleFilter(role) },
        update: {
          $set: {
            displayOrder: index + 1,
            updatedBy: adminId,
          },
        },
      },
    }))
  );

  return getAdminMonitoringCommittee();
};
