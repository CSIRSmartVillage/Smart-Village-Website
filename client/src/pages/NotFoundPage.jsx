import MainLayout from "../layouts/MainLayout";
import ResourceErrorState from "../components/common/ResourceErrorState";

const NotFoundPage = () => (
  <MainLayout>
    <ResourceErrorState
      title="Page not found"
      message="The page you are looking for may have been removed or the link may be incorrect."
      backTo="/"
      backLabel="Back to Home"
    />
  </MainLayout>
);

export default NotFoundPage;