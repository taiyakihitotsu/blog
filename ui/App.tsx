import Header from "@/components/UI/Header.js";
import DocViewer from "@/pages/docs/DocViewer.js";
import Profile from "@/pages/root/Profile.js";

interface AppProps {
  path: string;
}

export const App = ({ path }: AppProps) => {
  const getElement = () => {
    if (path === "/" || path === "/profile") {
      return <Profile />;
    }
    if (path.startsWith("/docs/")) {
      const docId = path.split("/").pop() || "";
      return <DocViewer docId={docId} />;
    }
    return <div>404 Not Found</div>;
  };

  return (
    <>
      <Header />
      <main>{getElement()}</main>
    </>
  );
};

export default App;
