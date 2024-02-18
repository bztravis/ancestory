"use client";

import { useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Graph from '@/components/ancestree3D';

export default function Page() {
  return (
    <div>
      <Graph />
    </div>
  );
}

// Since `react-force-graph-3d` might use browser-specific APIs, we dynamically import it to avoid SSR issues
