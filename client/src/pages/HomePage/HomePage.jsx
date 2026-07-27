import usePage
  from "../../hooks/usePage";

import MainLayout
  from "../../layouts/MainLayout";

import HomePageRenderer
  from "./HomePageRenderer";

const HomePage = () => {
  const {
    page,
    loading,
    error,
  } = usePage("home");

  return (
    <>
    <MainLayout>
    {error ? (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-2xl font-bold text-slate-900">
          {error}
        </h1>
      </section>
    ) : (
    <HomePageRenderer
      loading={loading}
      sections={
        page?.sections || []
      }
    />
    )}
    </MainLayout>
    </>
  );
};

export default HomePage;
