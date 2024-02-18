import dynamic from "next/dynamic";

const FocusGraph = dynamic(() => import("./ancestree3D-highlight"), {
  ssr: false
});

export default FocusGraph;