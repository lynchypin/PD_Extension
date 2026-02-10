import { useState, useMemo, useCallback } from 'react';
import { getStore } from '../data/store';
import {
  Search, ZoomIn, ZoomOut, Maximize2, Filter, Layers, ArrowRight,
  Briefcase, Server, ChevronDown, AlertTriangle, CheckCircle, XCircle,
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'business' | 'technical';
  status: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
}

function statusColor(status: string): string {
  if (status === 'operational' || status === 'active') return '#22c55e';
  if (status === 'degraded' || status === 'warning') return '#f59e0b';
  if (status === 'disrupted' || status === 'critical' || status === 'disabled') return '#ef4444';
  return '#6b7280';
}

export default function ServiceGraphPage() {
  const store = getStore();
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBusiness, setShowBusiness] = useState(true);
  const [showTechnical, setShowTechnical] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const { nodes, edges } = useMemo(() => {
    const n: GraphNode[] = [];
    const e: GraphEdge[] = [];
    const bsCount = store.businessServices.length;
    const svcCount = store.services.length;

    if (showBusiness) {
      store.businessServices.forEach((bs, i) => {
        n.push({ id: bs.id, label: bs.name, type: 'business', status: bs.status, x: 120 + i * 280, y: 80 });
        bs.supportingServices.forEach(sid => {
          e.push({ from: bs.id, to: sid });
        });
      });
    }

    if (showTechnical) {
      store.services.forEach((svc, i) => {
        n.push({ id: svc.id, label: svc.name, type: 'technical', status: svc.status, x: 80 + i * 220, y: showBusiness ? 280 : 80 });
      });
    }

    return { nodes: n, edges: e };
  }, [store, showBusiness, showTechnical]);

  const filteredNodes = useMemo(() => {
    if (!searchQuery) return nodes;
    return nodes.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [nodes, searchQuery]);

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
  }, [filteredNodes, edges]);

  const nodeMap = useMemo(() => new Map(filteredNodes.map(n => [n.id, n])), [filteredNodes]);

  const svgWidth = Math.max(900, filteredNodes.reduce((max, n) => Math.max(max, n.x + 200), 0));
  const svgHeight = Math.max(500, filteredNodes.reduce((max, n) => Math.max(max, n.y + 120), 0));

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Service Graph</h1>
          <p className="text-sm text-gray-500 mt-1">Visualize dependencies between business and technical services</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
        </div>

        <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={showBusiness} onChange={e => setShowBusiness(e.target.checked)} className="accent-green-600 rounded" />
            <Briefcase size={14} className="text-purple-500" /> Business
          </label>
          <span className="text-gray-300">|</span>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={showTechnical} onChange={e => setShowTechnical(e.target.checked)} className="accent-green-600 rounded" />
            <Server size={14} className="text-blue-500" /> Technical
          </label>
        </div>

        <div className="flex items-center gap-1 border rounded-lg px-1 py-1">
          <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="p-1 hover:bg-gray-100 rounded"><ZoomIn size={16} /></button>
          <span className="text-xs text-gray-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.3))} className="p-1 hover:bg-gray-100 rounded"><ZoomOut size={16} /></button>
          <button onClick={() => setZoom(1)} className="p-1 hover:bg-gray-100 rounded"><Maximize2 size={16} /></button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg border shadow-sm overflow-auto relative">
        <div className="absolute top-3 left-3 flex items-center gap-4 text-xs text-gray-500 bg-white/80 backdrop-blur rounded px-3 py-2 border">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100 border-2 border-purple-400 inline-block" /> Business Service</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border-2 border-blue-400 inline-block" /> Technical Service</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Operational</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Degraded</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Disrupted</span>
        </div>

        <svg width={svgWidth * zoom} height={svgHeight * zoom} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="min-w-full min-h-full">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          {filteredEdges.map((edge, i) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            return (
              <line key={i} x1={from.x + 80} y1={from.y + 40} x2={to.x + 80} y2={to.y} stroke="#cbd5e1" strokeWidth={1.5} markerEnd="url(#arrow)" strokeDasharray="4 2" />
            );
          })}

          {filteredNodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const isBusiness = node.type === 'business';
            return (
              <g key={node.id} onClick={() => setSelectedNode(isSelected ? null : node)} className="cursor-pointer">
                <rect x={node.x} y={node.y} width={160} height={50} rx={8} fill={isBusiness ? '#f5f3ff' : '#eff6ff'} stroke={isSelected ? '#16a34a' : isBusiness ? '#a78bfa' : '#60a5fa'} strokeWidth={isSelected ? 2 : 1.5} />
                <circle cx={node.x + 15} cy={node.y + 25} r={5} fill={statusColor(node.status)} />
                <text x={node.x + 28} y={node.y + 29} fontSize={12} fill="#1f2937" fontWeight={500} className="select-none">{node.label.length > 16 ? node.label.slice(0, 16) + '…' : node.label}</text>
              </g>
            );
          })}
        </svg>

        {filteredNodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Layers size={40} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No services to display</p>
            </div>
          </div>
        )}
      </div>

      {selectedNode && (
        <div className="mt-4 bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedNode.type === 'business' ? <Briefcase size={18} className="text-purple-500" /> : <Server size={18} className="text-blue-500" />}
              <div>
                <p className="text-sm font-semibold text-gray-900">{selectedNode.label}</p>
                <p className="text-xs text-gray-500 capitalize">{selectedNode.type} Service · <span style={{ color: statusColor(selectedNode.status) }}>{selectedNode.status}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {selectedNode.type === 'business' && (
                <span>{edges.filter(e => e.from === selectedNode.id).length} supporting services</span>
              )}
              {selectedNode.type === 'technical' && (
                <span>Used by {edges.filter(e => e.to === selectedNode.id).length} business services</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
