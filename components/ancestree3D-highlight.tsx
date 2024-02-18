// @ts-nocheck

import React from 'react';
import dynamic from 'next/dynamic';
import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import SpriteText from 'three-spritetext';
import ForceGraph3D, {
  GraphData,
  ForceGraphMethods,
} from 'react-force-graph-3d';
import StoryDrawer from './story-drawer';
import NodeDrawer from './node-drawer';

// TODO: add type for node maybe?

export const myData = {
  nodes: [
    {
      id: 1,
      name: 'Grandma fights in WWII',
      val: 10,
      neighbors: [],
      links: [],
    },
    {
      id: 2,
      name: 'Grandma participates in D-Day',
      val: 10,
      neighbors: [],
      links: [],
    },
    {
      id: 3,
      name: 'Grandma meets Grandpa in Paris',
      val: 10,
      neighbors: [],
      links: [],
    },
    {
      id: 4,
      name: 'Grandma goes home',
      val: 10,
      neighbors: [],
      links: [],
    },
    {
      id: 5,
      name: 'Grandma has a baby',
      val: 10,
      neighbors: [],
      links: [],
    },
  ],
  links: [
    {
      source: 1,
      target: 2,
    },
    {
      source: 2,
      target: 3,
    },
    {
      source: 3,
      target: 4,
    },
    {
      source: 2,
      target: 5,
    },
    {
      source: 5,
      target: 4,
    },
    {
      source: 4,
      target: 1,
    },
  ],
};

const Graph = () => {
  const NODE_R = 8;

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const [graphData, setGraphData] = useState<any>();
  const [selectedNode, setSelectedNode] = useState(null);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    // Fetch the graph data
    fetch('/test.json') // Adjust the dataset path according to your project structure
      .then((res) => res.json())
      .then((data) => {
        setGraphData(data);
        console.log('dALKSDLAJFLKJASDLKFJASLKFJASLKJF', data);
      });
  }, []);

  const data = useMemo(() => {
    const gData = myData;

    gData.links.forEach((link: any) => {
      console.log(link);
      const a = gData.nodes[link.source - 1];
      const b = gData.nodes[link.target - 1];
      if (a !== undefined && b !== undefined) {
        a.neighbors.push(b);
        b.neighbors.push(a);
        a.links.push(link);
        b.links.push(link);
        console.log(`${a.id}'s neighbors`, a.neighbors);
        console.log(`${b.id}'s neighbors`, b.neighbors);
        console.log(`${a.id}'s links", ${a.links}`);
        console.log(`${b.id}'s links", ${b.links}`);
      }
    });

    console.log('gData', gData);
    return gData;
  }, []);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node: any) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      node.neighbors.forEach((neighbor: any) => highlightNodes.add(neighbor));
      node.links.forEach((link: any) => highlightLinks.add(link));
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const handleLinkHover = (link: any) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      console.log('hovered link: ,', link);
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  const paintRing = useCallback(
    (node: any, ctx: any) => {
      // add ring just for highlighted nodes
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
      ctx.fill();
    },
    [hoverNode]
  );

  const fgRef = useRef<any>();
  console.log(fgRef);

  const handleClick = useCallback(
    (node: any) => {
      // Aim at node from outside it
      const distance = 60;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );

      setSelectedNode(node.id);
      setDrawer(true);
    },
    [fgRef]
  );

  return (
    <>
      <div id='graph' className='w-full h-screen'>
        <NodeDrawer
          nodeTitle={
            myData.nodes.filter((node) => selectedNode?.id === node.id)[0]?.name
          }
          nodeSummary='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo a diam sollicitudin tempor id eu. Tristique senectus et netus et. Ultricies mi eget mauris pharetra et ultrices neque ornare aenean. Vitae et leo duis ut diam. At quis risus sed vulputate odio ut enim blandit volutpat. Suspendisse potenti nullam ac tortor vitae purus faucibus. Cursus metus aliquam eleifend mi in nulla. Commodo nulla facilisi nullam vehicula ipsum. Nam at lectus urna duis convallis convallis. Convallis posuere morbi leo urna molestie. Sed vulputate odio ut enim blandit volutpat maecenas. Maecenas ultricies mi eget mauris pharetra et. Ornare quam viverra orci sagittis. Nisl condimentum id venenatis a condimentum vitae sapien. Proin sagittis nisl rhoncus mattis rhoncus urna. Integer malesuada nunc vel risus commodo viverra maecenas accumsan. Egestas sed tempus urna et. Sit amet massa vitae tortor condimentum lacinia.'
          nodeCharacters={['Character 1', 'Character 2']}
          nodeDate='2021-12-12'
          nodeLocation='Paris'
          isOpen={selectedNode !== null}
          onClose={() => setSelectedNode(null)}
        />
        {/* <StoryDrawer
          nodeTitle={"test"}
          nodeSummary={"test"}
          nodeLocation={"Stanford"}
          nodeCharacter={["Character 1", "Character 2"]}
          nodeDate={"2021-12-12"}
          isOpen={drawer}
          setOpen={() => {
            setDrawer(false);
          }}
        /> */}
        <ForceGraph3D
          ref={fgRef}
          graphData={data}
          nodeRelSize={NODE_R}
          linkWidth={(link) => (highlightLinks.has(link) ? 5 : 2)}
          linkDirectionalParticles={4}
          linkDirectionalParticleWidth={(link) =>
            highlightLinks.has(link) ? 4 : 0
          }
          onNodeHover={handleNodeHover}
          onLinkHover={handleLinkHover}
          nodeLabel='id'
          nodeAutoColorBy='group'
          nodeCanvasObjectMode={(node) =>
            highlightNodes.has(node) ? 'before' : undefined
          }
          nodeCanvasObject={paintRing}
          onNodeClick={handleClick}
          nodeThreeObject={(node) => {
            const sprite = new SpriteText(node.name?.toString() || '');
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
