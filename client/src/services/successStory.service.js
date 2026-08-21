import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

/**
 * Public: all published success stories
 */
export const getPublishedSuccessStories =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/success-stories/published`
      );

    return response.data.data;
  };

/**
 * Public: published success story villages
 */
export const getPublishedSuccessStoryVillages =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/success-stories/villages/published`
      );

    return response.data.data;
  };

/**
 * Public: single village by slug
 */
export const getSuccessStoryVillageBySlug =
  async (slug) => {
    const response =
      await axios.get(
        `${API_URL}/success-story-villages/slug/${slug}`
      );

    return response.data.data;
  };

/**
 * Public: all published stories grouped by village slug
 */
export const getStoriesByVillageSlug =
  async (villageSlug) => {
    const response =
      await axios.get(
        `${API_URL}/success-stories/village/${villageSlug}`
      );

    return response.data.data;
  };

/**
 * Public: single story by slug
 */
export const getSuccessStoryBySlug =
  async (slug) => {
    const response =
      await axios.get(
        `${API_URL}/success-stories/slug/${slug}`
      );

    return response.data.data;
  };