// import dynamic from "next/dynamic";
import React, { useCallback, useState, useEffect, useRef } from "react";
import ForceGraph3D, { GraphData, ForceGraphMethods } from "react-force-graph-3d";

// const _ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
// ssr: false
// });
/*
const ForwardGraph3D = forwardRef(
  (props: ForceGraphProps, ref: MutableRefObject<ForceGraphMethods>) => (
    <ForceGraph3D {...props} ref={ref} />
  )
);
*/



const FocusGraph = () => {
  const fgRef = useRef<ForceGraphMethods>();

  const [graphData, setGraphData] = useState<any>();
  useEffect(() => {
    // Fetch the graph data
    fetch('/test.json') // Adjust the dataset path according to your project structure
      .then(res => res.json())
      .then(data => {
        setGraphData(data);
      });
  }, []);

  const handleClick = useCallback(
    (node : any) => {
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      if (fgRef.current) {
        console.log(fgRef.current);
        fgRef.current.cameraPosition(
          {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio
          },
          node,
          3000
        );
      }
    },
    [fgRef]
  );

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={graphData}
      nodeLabel="id"
      nodeAutoColorBy="group"
      onNodeClick={handleClick}
    />
  );
};

export default FocusGraph;
