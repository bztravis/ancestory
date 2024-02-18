// pages/MyForceGraphPage.tsx
//@ts-nocheck

import React, { useRef, useEffect, useState, FC } from 'react';
import dynamic from 'next/dynamic';
import { GraphData, ForceGraphProps, ForceGraphMethods, NodeObject } from 'react-force-graph-3d'; // Adjust the import path according to your project structure

// Dynamically import the ForceGraph3D component with SSR disabled
const ForceGraph3D = dynamic<ForceGraphProps>(() => import('react-force-graph-3d'), {
  ssr: false,
}) as React.FC<ForceGraphProps & { ref?: React.MutableRefObject<ForceGraphMethods | undefined> }>;

const MyForceGraphPage: FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const fgRef = useRef<ForceGraphMethods>();

  useEffect(() => {
    // Fetch the graph data
    fetch('/test.json') // Adjust the dataset path according to your project structure
      .then(res => res.json())
      .then(data => {
        setGraphData(data);
      });
  }, []);

  // Define the handleClick method
  const handleClick = (node: NodeObject) => {
    console.log('Node clicked:', node);
    // Example of adjusting the camera position to focus on the clicked node
    // Check if the cameraPosition method is available and call it
    console.log(fgRef.current)
    if (fgRef.current?.cameraPosition) {
      const distance = 40; // Example distance
      const distRatio = 1 + distance / Math.hypot(node.x ?? 0, node.y ?? 0, node.z ?? 0);
      fgRef.current.cameraPosition(
        { x: (node.x ?? 0) * distRatio, y: (node.y ?? 0) * distRatio, z: (node.z ?? 0) * distRatio }, // new position
        { x: node.x, y: node.y, z: node.z }, // lookAt ({ x, y, z })
        3000  // ms transition duration
      );
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        linkWidth={2}
        nodeLabel="id"
        nodeAutoColorBy={"group"}
        onNodeClick={handleClick} // Attach the handleClick method to the onNodeClick event
        // Add more props and event handlers as needed
      />
    </div>
  );
};

export default MyForceGraphPage;
