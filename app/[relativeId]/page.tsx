import React from 'react';

type Props = {
  params: { relativeId: string };
};

const KnowledgeGraph = ({ params }: Props) => {
  return <div>KnowledgeGraph for {params.relativeId} </div>;
};

export default KnowledgeGraph;
