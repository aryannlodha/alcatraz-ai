import React, { useRef, useEffect, useState } from 'react';
import { Fact, Finding } from '@alcatraz/contracts';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

export function FactGraph({ facts, findings }: { facts: Fact[], findings: Finding[] }) {
  const fgRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: 500
      });
    }
  }, []);

  const data = React.useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Group facts by entity
    const entities = new Set(facts.map(f => f.entity));
    
    // Add entity center nodes
    entities.forEach(entity => {
      nodes.push({
        id: `entity_${entity}`,
        name: entity,
        val: 20,
        color: '#4f46e5',
        type: 'entity'
      });
    });

    // Add facts and link to entities
    facts.forEach(fact => {
      nodes.push({
        id: fact.id,
        name: `${fact.attribute}: ${fact.value}`,
        val: 10,
        color: '#10b981',
        type: 'fact',
        sourceId: fact.sourceId
      });
      links.push({
        source: fact.id,
        target: `entity_${fact.entity}`,
        color: '#9ca3af'
      });
    });

    // Add contradictions based on findings
    findings.forEach(finding => {
      if (finding.factIds.length >= 2) {
        for (let i = 0; i < finding.factIds.length; i++) {
          for (let j = i + 1; j < finding.factIds.length; j++) {
            links.push({
              source: finding.factIds[i],
              target: finding.factIds[j],
              color: '#ef4444', // Red for contradiction
              width: 3
            });
          }
        }
      }
    });

    return { nodes, links };
  }, [facts, findings]);

  return (
    <div ref={containerRef} className="w-full bg-gray-950 rounded-xl overflow-hidden border border-gray-800 shadow-xl relative">
      <div className="absolute top-4 left-4 z-10 bg-gray-900/80 p-3 rounded-lg backdrop-blur-sm border border-gray-700">
        <h4 className="text-white text-sm font-bold mb-2">3D Semantic Fact Network</h4>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div> Entity Root
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div> Fact Node
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
          <div className="w-3 h-0.5 bg-red-500"></div> Contradiction Link
        </div>
      </div>
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#030712"
        nodeLabel="name"
        nodeColor="color"
        nodeRelSize={6}
        linkColor="color"
        linkWidth={link => link.width || 1}
        nodeResolution={16}
        enableNodeDrag={false}
        enableNavigationControls={true}
        showNavInfo={false}
      />
    </div>
  );
}
