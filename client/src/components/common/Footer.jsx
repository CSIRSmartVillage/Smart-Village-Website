import { useState } from "react";

import {
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import useSiteSettings from "../../hooks/useSiteSettings";
import SmartTextRenderer from "./SmartTextRenderer";

// Official Logos
import CBRILogo from "../../assets/logos/CSIRCBRI-Logo.jpg";
import SmartVillageLogo from "../../assets/logos/SmartVillage.jpeg";

const Footer = () => {
  const { settings } = useSiteSettings();
  const [developerIndex, setDeveloperIndex] =
    useState(null);

  const developerNames = [
    "Sagar Tomar",
    "Milan Chauhan",
    "Shagun Tyagi",
    "Jha Aman Prem",
  ];

  const handleTeamClick = () => {
    setDeveloperIndex((current) =>
      current === null
        ? 0
        : (current + 1) % developerNames.length
    );
  };

  const quickLinks = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "About",
      path: "/about",
    },
    {
      title: "CSIR Laboratories",
      path: "/csir-laboratories/nodal-lab",
    },
    {
      title: "CSIR Smart Village",
      path: "/smart-village",
    },
    {
      title: "News & Updates",
      path: "/news",
    },
    {
      title: "Success Stories",
      path: "/success-stories",
    },
    {
      title: "Contact Us",
      path: "/contact",
    },
  ];

  const socialLinks = [
    {
      icon: FaFacebookF,
      url: settings?.socialLinks?.facebook,
      label: "Facebook",
      colorClass: "text-[#1877F2]",
    },
    {
      icon: FaLinkedinIn,
      url: settings?.socialLinks?.linkedin,
      label: "LinkedIn",
      colorClass: "text-[#0A66C2]",
    },
    {
      icon: FaYoutube,
      url: settings?.socialLinks?.youtube,
      label: "YouTube",
      colorClass: "text-[#FF0000]",
    },
    {
      icon: FaInstagram,
      url: settings?.socialLinks?.instagram,
      label: "Instagram",
      colorClass: "text-[#E4405F]",
    },
  ];

  const labLogos = [
    {
      name: "CSIR-AMPRI",
      src: "/lab-logos/csir-ampri.jpeg",
      url: "https://ampri.res.in/hi/",
    },
    {
      name: "CSIR-CBRI",
      src: "/lab-logos/csir-cbri.jpeg",
      url: "https://cbri.res.in/",
    },
    {
      name: "CSIR-CEERI",
      src: "/lab-logos/csir-ceeri.jpeg",
      url: "https://www.ceeri.res.in/",
    },
    {
      name: "CSIR-CFTRI",
      src: "/lab-logos/csir-cftri.jpeg",
      url: "https://cftri.res.in/",
    },
    {
      name: "CSIR-CIMAP",
      src: "/lab-logos/csir-cimap.jpeg",
      url: "https://www.cimap.res.in/",
    },
    {
      name: "CSIR-CLRI",
      src: "/lab-logos/csir-clri.jpeg",
      url: "https://www.clri.org/",
    },
    {
      name: "CSIR-CMERI",
      src: "/lab-logos/csir-cmeri.jpeg",
      url: "https://www.cmeri.res.in/",
    },
    {
      name: "CSIR-CRRI",
      src: "/lab-logos/csir-crri.jpeg",
      url: "https://crridom.gov.in/en",
    },
    {
      name: "CSIR-CSIO",
      src: "/lab-logos/csir-csio.jpeg",
      url: "https://www.csio.res.in/",
    },
    {
      name: "CSIR-IHBT",
      src: "/lab-logos/csir-ihbt.jpeg",
      url: "https://www.ihbt.res.in/en/",
    },
    {
      name: "CSIR-IICT",
      src: "/lab-logos/csir-iict.jpeg",
      url: "https://www.iict.res.in/",
    },
    {
      name: "CSIR-IMMT",
      src: "/lab-logos/csir-immt.jpeg",
      url: "https://www.immt.res.in/",
    },
    {
      name: "CSIR-NEERI",
      src: "/lab-logos/csir-neeri.jpeg",
      url: "https://www.neeri.res.in/",
    },
    {
      name: "CSIR-NEIST",
      src: "/lab-logos/csir-neist.jpeg",
      url: "https://www.neist.res.in/",
    },
    {
      name: "CSIR-NGRI",
      src: "/lab-logos/csir-ngri.jpeg",
      url: "https://www.ngri.res.in/",
    },
    {
      name: "CSIR-NIIST",
      src: "/lab-logos/csir-niist.jpeg",
      url: "https://www.niist.res.in/",
    },
    {
      name: "CSIR-SERC",
      src: "/lab-logos/csir-serc.jpeg",
      url: "https://serc.res.in/",
    },
  ];

  return (
   <>
  {/* Top Accent */}
  <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-500" />

  <footer className="bg-slate-50 border-t border-slate-200">

    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* ================================================= */}
        {/* Brand */}
        {/* ================================================= */}

        <div className="lg:col-span-5">

          {/* Logos */}

          <div className="flex items-center gap-5">

            <img
              src={CBRILogo}
              alt="CSIR-CBRI"
              decoding="async"
              fetchPriority="low"
              loading="lazy"
              className="h-20 object-contain"
            />

            <div className="h-12 w-px bg-slate-300" />

            <img
              src={SmartVillageLogo}
              alt="Smart Village"
              decoding="async"
              fetchPriority="low"
              loading="lazy"
              className="h-20 object-contain"
            />

          </div>

          {/* Heading */}

          <div className="mt-7">

            <h2 className="text-2xl font-bold tracking-wide text-slate-900">

              {settings?.siteName ||
                "Smart Village Management Portal"}

            </h2>

            <p className="mt-2 text-blue-700 font-semibold">

              {settings?.organizationName ||
                "CSIR – Central Building Research Institute"}

            </p>

          </div>

          {/* Description */}

          <SmartTextRenderer
            text={
              settings?.footerDescription ||
              "Empowering rural communities through sustainable technologies, scientific research, digital innovation and collaborative development under the CSIR Smart Village Initiative."
            }
            className="mt-6 max-w-lg"
          />

        </div>



        {/* ================================================= */}
        {/* Quick Links */}
        {/* ================================================= */}

        <div className="lg:col-span-3">

          <h3 className="text-lg font-semibold text-slate-900 mb-6">

            Quick Links

          </h3>

          <div className="space-y-4">

            {quickLinks.map((item) => (

              <Link
                key={item.title}
                to={item.path}
                className="group flex items-center justify-between text-slate-600 hover:text-blue-700 transition"
              >

                <span>

                  {item.title}

                </span>

                <ArrowUpRight
                  size={16}
                  className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                />

              </Link>

            ))}

          </div>

        </div>

                {/* ================================================= */}
        {/* Contact Information */}
        {/* ================================================= */}

        <div className="lg:col-span-4">

          <h3 className="text-lg font-semibold text-slate-900 mb-5">
            Contact Information
          </h3>

          <div className="space-y-4">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <MapPin size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  Address
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {settings?.address ||
                    "CSIR-CBRI, Roorkee, Uttarakhand, India"}
                </p>

              </div>

            </div>

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Mail size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  Email
                </p>

                <a
                  href="mailto:csirsmartvillage@gmail.com"
                  className="mt-1 block text-sm text-slate-600 hover:text-blue-700 transition"
                >
                  csirsmartvillage@gmail.com
                </a>

              </div>

            </div>

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Phone size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  Phone
                </p>

                <a
                  href={`tel:${settings?.contactPhone}`}
                  className="mt-1 block text-sm text-slate-600 hover:text-blue-700 transition"
                >
                  {settings?.contactPhone ||
                    "+91 96635 30674"}
                </a>

              </div>

            </div>

          </div>



          {/* Follow Us */}

          <div className="mt-8">

            <h3 className="text-lg font-semibold text-slate-900 mb-5">
              Follow Us
            </h3>

            <div className="flex flex-wrap gap-4">

              {socialLinks.map(
                ({ icon: Icon, url, label, colorClass }) => (

                  <a
                    key={label}
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`group flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white ${colorClass} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg`}
                  >

                    <Icon size={20} />

                  </a>

                )
              )}

            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Stay connected with CSIR-CBRI and follow our latest
              research initiatives, rural development activities,
              and Smart Village updates.
            </p>

          </div>

        </div>

      </div>

    </div>

        {/* ================================================= */}
    {/* Bottom Footer */}
    {/* ================================================= */}

    <div className="border-t border-slate-200 bg-white">

      <div className="overflow-hidden border-b border-slate-200 bg-slate-50 py-5">
        <div className="flex w-max animate-[lab-marquee_36s_linear_infinite] items-center gap-10 hover:[animation-play-state:paused]">
          {[...labLogos, ...labLogos].map((lab, index) => (
            <a
              key={`${lab.name}-${index}`}
              href={lab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative z-0 flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-white/70 transition-all duration-300 ease-out hover:z-10 hover:-translate-y-2 hover:scale-110 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              aria-label={`Open ${lab.name} website`}
              title={lab.name}
            >
              <img
                src={lab.src}
                alt={lab.name}
                className="h-18 w-30 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">

          {/* Copyright */}

          <div className="text-center lg:text-left">

            <p className="text-sm text-slate-600">

              {settings?.copyrightText ||
                `© ${new Date().getFullYear()} SMART Village Management Portal. All Rights Reserved.`}

            </p>

            <p className="mt-1 text-xs text-slate-500">

              Developed under the{" "}

              <span className="font-semibold text-blue-700">
                CSIR SMART Village Initiative
              </span>

            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Developed By{" "}
              <span className="font-semibold text-slate-700">
                Dr. Kishor
              </span>
              {" "}and{" "}
              <button
                type="button"
                onClick={handleTeamClick}
                className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 transition hover:text-blue-900 hover:decoration-blue-500"
              >
                Team
              </button>
              {developerIndex !== null && (
                <span className="ml-2 inline-flex rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
                  {developerNames[developerIndex]}
                </span>
              )}
            </p>

          </div>

          {/* Quick Info */}

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">

            <span className="font-medium">
              {settings?.organizationName || "CSIR-CBRI"}
            </span>

            <span className="hidden md:block text-slate-300">
              |
            </span>

            <span>
              Roorkee, Uttarakhand
            </span>

            <span className="hidden md:block text-slate-300">
              |
            </span>

          </div>

        </div>

      </div>

    </div>

  </footer>

</>
  );
};

export default Footer;
