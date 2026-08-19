import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import MainLayout
  from "../../layouts/MainLayout";

import {
  getNewsBySlug,
} from "../../services/news.service";
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";
import ResourceErrorState
  from "../../components/common/ResourceErrorState";
import {
  getUserFriendlyError,
  isNotFoundError,
} from "../../utils/userFriendlyError";

const NewsDetailPage =
  () => {
    const { slug } =
      useParams();

    const [
      article,
      setArticle,
    ] = useState(null);

    const [
      loading,
      setLoading,
    ] = useState(true);

    const [
      loadError,
      setLoadError,
    ] = useState(null);

    useEffect(() => {
      const loadArticle =
        async () => {
          try {
            const data =
              await getNewsBySlug(
                slug
              );

            setArticle(data);
          } catch (
            error
          ) {
            console.error(
              error
            );
            setLoadError(error);
          } finally {
            setLoading(
              false
            );
          }
        };

      loadArticle();
    }, [slug]);

    if (loading) {
      return (
        <h1>
          Loading...
        </h1>
      );
    }

    if (loadError || !article) {
      const notFound = !loadError || isNotFoundError(loadError);

      return (
        <MainLayout>
          <ResourceErrorState
            title={notFound ? "Article not found" : "Unable to load article"}
            message={
              notFound
                ? "The article you are looking for may have been removed or the link may be incorrect."
                : getUserFriendlyError(loadError, "Unable to load the article. Please try again.")
            }
            backTo="/news-updates"
            backLabel="Back to News & Updates"
            onRetry={notFound ? undefined : () => window.location.reload()}
          />
        </MainLayout>
      );
    }

    return (
      <>
      <MainLayout>

        <div className="max-w-4xl mx-auto px-6 py-20">

          {article.featuredImage?.url && (
  <img
    src={article.featuredImage.url}
    alt={article.title}
    className="w-full h-[450px] object-cover rounded-xl mb-8"
  />
)}

          <span className="text-blue-600 font-medium">
            {article.category}
          </span>

          <h1 className="text-5xl font-bold mt-4">
            {article.title}
          </h1>

          <p className="text-slate-500 mt-4">
            {new Date(
              article.publishedAt
            ).toLocaleDateString()}
          </p>

          <SmartTextRenderer
            text={article.summary}
            className="mt-8"
          />

          <SmartTextRenderer
            text={article.content}
            className="mt-10"
          />

        </div>

        </MainLayout>
      </>
    );
  };

export default NewsDetailPage;
