import React, { useEffect, useState } from 'react';
import { GraphCanvas } from 'reagraph';


const nodes = [
    {
        id: '1',
        label: '1'
      },
      {
        id: '2',
        label: '2'
      }
    ];
    
const edges = [
    {
    source: '1',
    target: '2',
    id: '1-2',
    label: '1-2'
    },
    {
    source: '2',
    target: '1',
    id: '2-1',
    label: '2-1'
    }
];

export const MyDiagram = () => {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsBrowser(true);
        }
    }, []);

    if (!isBrowser) {
        return <></>;
    }
    return (
        <GraphCanvas
            nodes={nodes}
            edges={edges}
        />
    );
};

export default MyDiagram;