import React from 'react';
import dynamic from 'next/dynamic';
import { useRef, useCallback } from 'react';
import SpriteText from "three-spritetext"

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

const myData={
  "nodes": [ 
      { 
        "id": "id1",
        "name": "Grandma fights in WWII",
        "val": "" 
      },
      { 
        "id": "id2",
        "name": "Grandma participates in D-Day",
        "val": 10 
      },
      { 
        "id": "id3",
        "name": "Grandma meets Grandpa in Paris",
        "val": 10 
      },
      { 
        "id": "id4",
        "name": "Grandma goes home",
        "val": 10 
      }
  ],
  "links": [
      {
        "source": "id1",
        "target": "id2"
      },
      {
        "source": "id2",
        "target": "id4"
      },
      {
        "source": "id2",
        "target": "id3"
      }
  ]
}

const Graph = () => {
  const fgRef = useRef<any>();
  console.log(fgRef)

  const handleClick = useCallback((node:any) => {
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    fgRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      3000  // ms transition duration
    );
  }, [fgRef]);

  return (
    <>
      <div id="graph" className="w-full h-screen">
        <ForceGraph3D
          ref={fgRef}
          graphData={myData}
          nodeLabel="id"
          nodeAutoColorBy="group"
          onNodeClick={handleClick}
          nodeThreeObject={node => {
            const sprite = new SpriteText(node.name?.toString() || "");
            sprite.color = node.color;
            sprite.textHeight = 6;
            return sprite;
          }}
        />
      </div>
    </>
  );
};

export default Graph;