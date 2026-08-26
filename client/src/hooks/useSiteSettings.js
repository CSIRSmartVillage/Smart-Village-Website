import { useQuery } from "@tanstack/react-query";

import { getSiteSettings } from "../services/siteSettings.service";

const defaultSettings = {
  siteName: "",
  organizationName: "",
  footerDescription: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  website: "",
  copyrightText: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    instagram: "",
  },
};

export default function useSiteSettings() {
  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettings,

    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  return {
    settings: data || defaultSettings,
    loading: isLoading,
  };
}
