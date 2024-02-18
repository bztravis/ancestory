'use client';

import React from 'react';
import { GraphCanvas } from 'reagraph';

export const MyDiagram = () => <GraphCanvas nodes={nodes} edges={edges} />;
type Props = {
  params: { relativeId: string };
};

const nodes = [
  {
    id: '1',
    label: '1',
  },
  {
    id: '2',
    label: '2',
  },
];

const edges = [
  {
    source: '1',
    target: '2',
    id: '1-2',
    label: '1-2',
  },
  {
    source: '2',
    target: '1',
    id: '2-1',
    label: '2-1',
  },
];

const KnowledgeGraph = ({ params }: Props) => {
  return;
  <>
    <MyDiagram />
    <div>KnowledgeGraph for {params.relativeId} </div>;
  </>;
};

export default KnowledgeGraph;
