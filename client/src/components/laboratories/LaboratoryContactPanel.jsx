import { useState } from "react";
import { Mail, Phone } from "lucide-react";

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : "";

const getEmailAddress = (value) =>
  normalizeText(value).match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  )?.[0] || "";

const getDialablePhone = (value) => {
  const match = normalizeText(value).match(
    /\+?\d[\d\s().-]{4,}\d/
  );

  if (!match) {
    return "";
  }

  return match[0]
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "");
};

const getPhotoUrl = (photo) => {
  if (!photo) {
    return "";
  }

  if (typeof photo === "string") {
    return /^https?:\/\//i.test(photo)
      ? photo
      : "";
  }

  return photo.url || photo.secureUrl || "";
};

const getExternalWebsiteUrl = (website) => {
  const normalizedWebsite = normalizeText(website);

  if (!normalizedWebsite) {
    return "";
  }

  if (/^https?:\/\//i.test(normalizedWebsite)) {
    return normalizedWebsite;
  }

  if (normalizedWebsite.startsWith("//")) {
    return `https:${normalizedWebsite}`;
  }

  return `https://${normalizedWebsite.replace(/^\/+/, "")}`;
};

const LaboratoryContactPanel = ({ laboratory }) => {
  const [failedPhotoUrl, setFailedPhotoUrl] =
    useState("");
  const directorName = normalizeText(
    laboratory?.directorName
  );
  const instituteName = normalizeText(
    laboratory?.name
  );
  const address = normalizeText(
    laboratory?.address
  );
  const phone = normalizeText(
    laboratory?.phone
  );
  const email = normalizeText(
    laboratory?.email
  );
  const websiteUrl = getExternalWebsiteUrl(
    laboratory?.website
  );
  const directorPhotoUrl = getPhotoUrl(
    laboratory?.directorPhoto
  );
  const emailAddress = getEmailAddress(email);
  const dialablePhone = getDialablePhone(phone);
  const showDirectorPhoto =
    Boolean(directorPhotoUrl) &&
    failedPhotoUrl !== directorPhotoUrl;

  const hasContactInformation = Boolean(
    showDirectorPhoto ||
      directorName ||
      instituteName ||
      address ||
      phone ||
      email ||
      websiteUrl
  );

  if (!hasContactInformation) {
    return null;
  }

  return (
    <section className="mb-12 pb-4">
      <h2 className="mb-4 text-3xl font-bold">
        Contact Information
      </h2>

      <div
        className={`grid gap-6 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6 ${
          showDirectorPhoto
            ? "md:grid-cols-[190px_minmax(0,1fr)] md:gap-8"
            : ""
        }`}
      >
        {showDirectorPhoto && (
          <div className="mx-auto w-full max-w-[220px] md:mx-0 md:max-w-none">
            <img
              src={directorPhotoUrl}
              alt={
                directorName
                  ? `${directorName}, Director`
                  : "Laboratory Director"
              }
              className="aspect-[4/5] w-full rounded-lg border border-slate-200 bg-white object-cover"
              onError={() =>
                setFailedPhotoUrl(directorPhotoUrl)
              }
            />
          </div>
        )}

        <div className="min-w-0">
          <dl className="space-y-4 text-slate-700">
            {directorName && (
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                <dt className="shrink-0 font-medium text-slate-600">
                  Director:
                </dt>
                <dd className="text-lg font-semibold text-slate-900">
                  {directorName}
                </dd>
              </div>
            )}

            {instituteName && (
              <div>
                <dt className="text-sm font-medium text-slate-600">
                  Institute
                </dt>
                <dd className="mt-1 break-words font-semibold text-slate-900">
                  {instituteName}
                </dd>
              </div>
            )}

            {address && (
              <div>
                <dt className="text-sm font-medium text-slate-600">
                  Address
                </dt>
                <dd className="mt-1 whitespace-pre-wrap break-words leading-7">
                  {address}
                </dd>
              </div>
            )}

            {phone && (
              <div className="flex items-start gap-2">
                <dt className="sr-only">Phone</dt>
                <Phone
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-slate-500"
                  size={17}
                  strokeWidth={1.8}
                />
                <dd className="min-w-0 break-words">
                  {dialablePhone ? (
                    <a
                      href={"tel:" + dialablePhone}
                      className="text-blue-700 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      {phone}
                    </a>
                  ) : (
                    phone
                  )}
                </dd>
              </div>
            )}

            {email && (
              <div className="flex items-start gap-2">
                <dt className="sr-only">Email</dt>
                <Mail
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-slate-500"
                  size={17}
                  strokeWidth={1.8}
                />
                <dd className="min-w-0 break-all">
                  {emailAddress ? (
                    <a
                      href={"mailto:" + emailAddress}
                      className="text-blue-700 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      {email}
                    </a>
                  ) : (
                    email
                  )}
                </dd>
              </div>
            )}
          </dl>

          {websiteUrl && (
            <div className="mt-6 flex sm:justify-end">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
              >
                Visit Official Website
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LaboratoryContactPanel;
