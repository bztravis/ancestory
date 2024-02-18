// @ts-nocheck

import React from 'react';
import dynamic from 'next/dynamic';
import { useRef, useCallback, useState, useMemo } from 'react';
import SpriteText from "three-spritetext"
import ForceGraph3D, { GraphData, ForceGraphMethods } from "react-force-graph-3d";


// TODO: add type for node maybe?

const myData={
  "nodes": [ 
      { 
        "id": 1,
        "name": "Grandma fights in WWII",
        "val": 10 ,
        "neighbors": [],
        "links": []
      },
      { 
        "id": 2,
        "name": "Grandma participates in D-Day",
        "val": 10 ,
        "neighbors": [],
        "links": []
      },
      { 
        "id": 3,
        "name": "Grandma meets Grandpa in Paris",
        "val": 10 ,
        "neighbors": [],
        "links": []
      },
      { 
        "id": 4,
        "name": "Grandma goes home",
        "val": 10 ,
        "neighbors": [],
        "links": []
      },
      {
        "id": 5,
        "name": "Grandma has a baby",
        "val": 10 ,
        "neighbors": [],
        "links": []
      }
  ],
  "links": [
      {
        "source": 1,
        "target": 2
      },
      {
        "source": 2,
        "target": 3
      },
      {
        "source": 3,
        "target": 4
      },
      {
        "source": 2,
        "target": 5
      },
      {
        "source": 5,
        "target": 4
      },
      {
        "source": 4,
        "target": 1
      }
  ]
}

const Graph = () => {
  const NODE_R = 8;

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  const data = useMemo(() => {
    const gData = myData;

    console.log(gData.links)
    // cross-link node objects
    gData.links.forEach((link : any) => {
      console.log(link)
      const a = gData.nodes[link.source-1];
      const b = gData.nodes[link.target-1];
      if(a!==undefined && b!==undefined){
        a.neighbors.push(b);
        b.neighbors.push(a);
        a.links.push(link);
        b.links.push(link);
        console.log(`${a.id}'s neighbors`, a.neighbors)
        console.log(`${b.id}'s neighbors`, b.neighbors)
        console.log(`${a.id}'s links", ${a.links}`)
        console.log(`${b.id}'s links", ${b.links}`)
      }
    });

    console.log("gData", gData)
    return gData;
  }, []);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node : any) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if(node){
      highlightNodes.add(node);
      node.neighbors.forEach((neighbor : any) => highlightNodes.add(neighbor));
      node.links.forEach((link : any) => highlightLinks.add(link));
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const handleLinkHover = (link : any) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  const paintRing = useCallback((node : any, ctx : any) => {
    // add ring just for highlighted nodes
    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
    ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
    ctx.fill();
  }, [hoverNode]);
  
  const fgRef = useRef<any>();
  console.log(fgRef)

  const handleClick = useCallback((node:any) => {
    // Aim at node from outside it
    const distance = 60;
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
          nodeRelSize={NODE_R}
          linkWidth={link => highlightLinks.has(link) ? 5 : 2}
          linkDirectionalParticles={4}
          linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
          onNodeHover={handleNodeHover}
          onLinkHover={handleLinkHover}
          nodeLabel="id"
          nodeAutoColorBy="group"
          onNodeClick={handleClick}
          nodeThreeObject={node => {
            const sprite = new SpriteText(node.name?.toString() || "");
            sprite.color = node.color;
            sprite.textHeight = 4;
            return sprite;
          }}
        />
      </div>
    </>
  );
};

export default Graph;