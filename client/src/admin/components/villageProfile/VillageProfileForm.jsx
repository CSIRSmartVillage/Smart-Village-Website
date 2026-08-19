import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAllMedia } from "../../services/media.service";

import HeroSection from "./HeroSection";
import InformationSection from "./InformationSection";
import GallerySection from "./GallerySection";
import ContactSection from "./ContactSection";
import AdministrativeDetailsSection from "./AdministrativeDetailsSection";

const initialForm = {
  village: "",

  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",

  aboutHeading: "About Village",
  aboutSubtitle: "",
  overview: "",

  galleryImages: [],

  contactPersons: [],

  sortOrder: 0,

  isPublished: true,
};

const createContactKey = () =>
  `contact-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

const normalizeFormData = (data) => {
  data = data ?? {};

  return {
    ...initialForm,
    ...data,

    ...(data.village && typeof data.village === "object"
      ? {
          administrativeDetails: {
            state:
              data.village.state?._id || data.village.state || "",
            district: data.village.district || "",
            block: data.village.block || "",
            gramPanchayat: data.village.gramPanchayat || "",
          },
        }
      : {}),

    village: data.village?._id || data.village || "",

    heroImage:
      data.heroImage?._id ||
      data.heroImage ||
      "",

    galleryImages: Array.isArray(data.galleryImages)
      ? data.galleryImages.map((item, index) => {
          if (typeof item === "string") {
            return {
              image: item,
              caption: "",
              sortOrder: index,
            };
          }

          return {
            image:
              item.image?._id ||
              item.image ||
              item._id ||
              "",
            caption: item.caption || "",
            sortOrder:
              item.sortOrder ?? index,
          };
        })
      : [],

    contactPersons:
      Array.isArray(data.contactPersons) &&
      data.contactPersons.length > 0
        ? data.contactPersons.map((contact, index) => ({
            _clientKey:
              contact._id ||
              createContactKey(),
            name: contact.name || "",
            designation: contact.designation || "",
            phone: contact.phone || "",
            email: contact.email || "",
            officeAddress: contact.officeAddress || "",
            displayOrder:
              contact.displayOrder ?? index,
          }))
        : data.contactPerson ||
          data.designation ||
          data.phone ||
          data.email ||
          data.officeAddress
        ? [
            {
              _clientKey: createContactKey(),
              name: data.contactPerson || "",
              designation: data.designation || "",
              phone: data.phone || "",
              email: data.email || "",
              officeAddress:
                data.officeAddress || "",
              displayOrder: 0,
            },
          ]
        : [],
  };
};

export default function VillageProfileForm({
  initialData = null,
  villages = [],
  states = [],
  onSubmit,
  onCoordinateSave,
  loading = false,
}) {
  const [formData, setFormData] = useState(() =>
    normalizeFormData(initialData)
  );

  const { data: media = [] } = useQuery({
    queryKey: ["admin-media"],
    queryFn: getAllMedia,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleAdministrativeChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      administrativeDetails: {
        ...prev.administrativeDetails,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,

      galleryImages: formData.galleryImages
        .filter((item) => item.image)
        .map((item, index) => ({
          image: item.image,
          caption: item.caption || "",
          sortOrder:
            item.sortOrder === "" ||
            item.sortOrder === null ||
            item.sortOrder === undefined
              ? index
              : Number(item.sortOrder),
        })),

      contactPersons: formData.contactPersons
        .filter((contact) =>
          [
            contact.name,
            contact.designation,
            contact.phone,
            contact.email,
            contact.officeAddress,
          ].some(Boolean)
        )
        .map((contact, index) => ({
          name: contact.name,
          designation: contact.designation,
          phone: contact.phone,
          email: contact.email,
          officeAddress: contact.officeAddress,
          displayOrder:
            contact.displayOrder === "" ||
            contact.displayOrder === null ||
            contact.displayOrder === undefined
              ? index
              : Number(contact.displayOrder),
        })),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {formData.administrativeDetails ? (
        <AdministrativeDetailsSection
          details={formData.administrativeDetails}
          states={states}
          onChange={handleAdministrativeChange}
          coordinates={initialData?.village?.location?.coordinates}
          onCoordinateSave={onCoordinateSave}
        />
      ) : null}

      <HeroSection
        formData={formData}
        media={media}
        villages={villages}
        handleChange={handleChange}
      />

      <InformationSection
        formData={formData}
        handleChange={handleChange}
      />

      <GallerySection
        formData={formData}
        media={media}
        setFormData={setFormData}
      />

      <ContactSection
        formData={formData}
        setFormData={setFormData}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Village Profile"}
        </button>
      </div>
    </form>
  );
}
