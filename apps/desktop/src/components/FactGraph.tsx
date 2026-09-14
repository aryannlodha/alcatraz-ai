import React, { useState, useEffect, useRef } from 'react';
import { Fact } from '@alcatraz/contracts';

interface FactNode {
  fact: Fact;
  x: number;
  y: number;
}

interface Connection {
  from: number;
  to: number;
  type: 'match' | 'mismatch' | 'possible_match' | 'neutral';
}

function getColor(type: string): string {
  switch (type) {
    case 'match': return '#22c55e';
    case 'mismatch': return '#ef4444';
    case 'possible_match': return '#f59e0b';
    default: return '#d1d5db';
  }
}

export function FactGraph({ facts, findingFactIds }: { facts: Fact[]; findingFactIds: Set<string> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<FactNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    if (facts.length === 0) return;

    // Layout facts in a circular pattern
    const centerX = 300;
    const centerY = 200;
    const radius = Math.min(160, facts.length * 30);
    
    const layoutNodes = facts.map((fact, i) => ({
      fact,
      x: centerX + radius * Math.cos((2 * Math.PI * i) / facts.length - Math.PI / 2),
      y: centerY + radius * Math.sin((2 * Math.PI * i) / facts.length - Math.PI / 2),
    }));

    setNodes(layoutNodes);

    // Connect facts that share the same attribute
    const conns: Connection[] = [];
    for (let i = 0; i < facts.length; i++) {
      for (let j = i + 1; j < facts.length; j++) {
        if (facts[i].attribute === facts[j].attribute) {
          const bothInFinding = findingFactIds.has(facts[i].id) && findingFactIds.has(facts[j].id);
          conns.push({
            from: i,
            to: j,
            type: bothInFinding ? 'mismatch' : facts[i].value === facts[j].value ? 'match' : 'neutral',
          });
        }
      }
    }
    setConnections(conns);
  }, [facts, findingFactIds]);

  if (facts.length === 0) return null;

  return (
    <div ref={containerRef} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Fact Relationship Graph</h3>
      <svg width="100%" height="400" viewBox="0 0 600 400" className="overflow-visible">
        {/* Connections */}
        {connections.map((conn, i) => (
          <line
            key={`conn-${i}`}
            x1={nodes[conn.from]?.x || 0}
            y1={nodes[conn.from]?.y || 0}
            x2={nodes[conn.to]?.x || 0}
            y2={nodes[conn.to]?.y || 0}
            stroke={getColor(conn.type)}
            strokeWidth={conn.type === 'mismatch' ? 3 : 1.5}
            strokeDasharray={conn.type === 'neutral' ? '4,4' : 'none'}
            opacity={0.7}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isInFinding = findingFactIds.has(node.fact.id);
          return (
            <g key={`node-${i}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={isInFinding ? 28 : 22}
                fill={isInFinding ? '#fef2f2' : '#f9fafb'}
                stroke={isInFinding ? '#ef4444' : '#d1d5db'}
                strokeWidth={isInFinding ? 2.5 : 1.5}
                className="dark:fill-gray-800"
              />
              <text
                x={node.x}
                y={node.y - 4}
                textAnchor="middle"
                className="text-[10px] font-bold fill-gray-700 dark:fill-gray-300"
              >
                {node.fact.attribute.replace(/_/g, ' ').slice(0, 12)}
              </text>
              <text
                x={node.x}
                y={node.y + 8}
                textAnchor="middle"
                className="text-[9px] fill-gray-500 dark:fill-gray-400"
              >
                {String(node.fact.value).slice(0, 10)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex items-center gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-4 h-0.5 bg-green-500" /> Match
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-4 h-0.5 bg-red-500" style={{ height: 3 }} /> Mismatch
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-4 h-0.5 bg-gray-300 border-t border-dashed border-gray-400" /> Unrelated
        </div>
      </div>
    </div>
  );
}
