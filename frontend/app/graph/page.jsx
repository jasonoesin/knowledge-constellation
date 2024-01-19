import { DisplayGraph } from "../components/Graph.jsx";
import Header from "../components/Header.jsx";

export default function GraphPage() {
  return (
    <div className="w-full h-full">
      <DisplayGraph />
      <Header />
    </div>
  );
}
