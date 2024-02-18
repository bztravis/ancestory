//@ts-nocheck
import React from 'react';

interface NodeDrawerProps {
  nodeTitle: string;
  nodeSummary: string;
  nodeCharacters: string[];
  nodeDate: string;
  nodeLocation: string; // Replace `any` with your node data type for better type safety
  isOpen: boolean;
  onClose: () => void;
}

const NodeDrawer: React.FC<NodeDrawerProps> = ({
  nodeTitle,
  nodeSummary,
  nodeCharacters,
  nodeDate,
  nodeLocation,
  isOpen,
  onClose,
}) => {
  const drawerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px -2px 10px rgba(0,0,0,0.1)',
    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.3s ease-in-out',
    padding: '20px',
    zIndex: 1000,
  };

  return (
    <div style={drawerStyle}>
      <div className='flex w-[200] h-[5] rounded-full bg-gray-500/70'></div>
      <div className='flex items-center justify-start space-x-4'>
        <button onClick={onClose}>X</button>
        <div className='flex-1 text-center font-bold text-xl'>
          Story: {nodeTitle}
        </div>
      </div>
      <div className='py-5'>
        <p>
          <span className='font-bold'> Date:</span> {nodeDate}
        </p>
        <p>
          <span className='font-bold'>Location:</span> {nodeLocation}
        </p>
        <p>
          <span className='font-bold'>Characters:</span>{' '}
          {nodeCharacters.join(', ')}
        </p>
      </div>
      <p>
        <span className='font-bold'>Summary:</span> {nodeSummary}
      </p>
      <div className='flex justify-center items-center'>
        <div className='bg-blue-500 text-white text-center p-4 rounded-lg'>
          Listen to Recording
        </div>
      </div>
    </div>
  );
};

export default NodeDrawer;
