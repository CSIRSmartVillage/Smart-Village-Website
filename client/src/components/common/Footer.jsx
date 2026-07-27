import {
  MapPin,
  Mail,
  Phone,
  Globe,
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
    },
    {
      icon: FaLinkedinIn,
      url: settings?.socialLinks?.linkedin,
      label: "LinkedIn",
    },
    {
     icon: FaYoutube,
      url: settings?.socialLinks?.youtube,
      label: "YouTube",
    },
    {
     icon: FaInstagram,
      url: settings?.socialLinks?.instagram,
      label: "Instagram",
    },
  ];

  return (
   <>
  {/* Top Accent */}
  <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-500" />

  <footer className="bg-slate-50 border-t border-slate-200">

    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

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

          {/* Official Website */}

          <a
            href={settings?.website || "https://cbri.res.in"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 text-blue-700 font-semibold hover:text-blue-900 transition"
          >

            Visit Official Website

            <ArrowUpRight size={18} />

          </a>

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

          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Contact Information
          </h3>

          <div className="space-y-6">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
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

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Mail size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  Email
                </p>

                <a
                  href={`mailto:${settings?.contactEmail}`}
                  className="mt-1 block text-sm text-slate-600 hover:text-blue-700 transition"
                >
                  {settings?.contactEmail ||
                    "smartvillage@cbri.res.in"}
                </a>

              </div>

            </div>

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
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

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Globe size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  Website
                </p>

                <a
                  href={
                    settings?.website ||
                    "https://cbri.res.in"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-slate-600 hover:text-blue-700 transition"
                >
                  {settings?.website ||
                    "https://cbri.res.in"}
                </a>

              </div>

            </div>

          </div>



          {/* Follow Us */}

          <div className="mt-12">

            <h3 className="text-lg font-semibold text-slate-900 mb-5">
              Follow Us
            </h3>

            <div className="flex flex-wrap gap-4">

              {socialLinks.map(
                ({ icon: Icon, url, label }) => (

                  <a
                    key={label}
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-700 hover:bg-blue-700 hover:text-white hover:shadow-lg"
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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">

          {/* Copyright */}

          <div className="text-center lg:text-left">

            <p className="text-sm text-slate-600">

              {settings?.copyrightText ||
                `© ${new Date().getFullYear()} Smart Village Management Portal. All Rights Reserved.`}

            </p>

            <p className="mt-1 text-xs text-slate-500">

              Developed under the{" "}

              <span className="font-semibold text-blue-700">
                CSIR Smart Village Initiative
              </span>

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

            <a
              href={
                settings?.website ||
                "https://cbri.res.in"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              Official Website
            </a>

          </div>

        </div>

      </div>

    </div>

  </footer>

</>
  );
};

export default Footer;
