import { ArrowUpRight, BookOpen, CircleDot, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { RelationMapData, RelationMapEdge, RelationMapNode, RelationMapNodeKind } from '@lib/relations';

type Props = {
  data: RelationMapData;
};

type Coordinates = {
  x: number;
  y: number;
  anchor: 'start' | 'end' | 'middle';
};

type NodeEvidenceItem = {
  id: string;
  event: RelationMapEdge['events'][number];
  edge: RelationMapEdge;
  neighbor: RelationMapNode;
};

const WIDTH = 1040;
const HEIGHT = 620;
const MAX_EDGES = 100;
const FOCUS_NEIGHBORS = 12;

const KIND_LABELS: Record<RelationMapNodeKind, string> = {
  character: '人物',
  motif: '意象',
  chapter: '章节'
};

const KIND_ICONS = {
  character: Users,
  motif: CircleDot,
  chapter: BookOpen
};

export default function RelationMap({ data }: Props) {
  const [enabledKinds, setEnabledKinds] = useState<Record<RelationMapNodeKind, boolean>>({
    character: true,
    motif: true,
    chapter: true
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  const nodesById = useMemo(() => new Map(data.nodes.map((node) => [node.id, node])), [data.nodes]);

  useEffect(() => {
    const focus = new URLSearchParams(window.location.search).get('focus');
    if (focus && nodesById.has(focus)) setSelectedNodeId(focus);
  }, [nodesById]);

  const focusNeighborIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    return new Set(
      data.edges
        .filter((edge) => edge.source === selectedNodeId || edge.target === selectedNodeId)
        .sort(sortEdges)
        .slice(0, FOCUS_NEIGHBORS)
        .map((edge) => (edge.source === selectedNodeId ? edge.target : edge.source))
    );
  }, [data.edges, selectedNodeId]);

  const visibleNodes = useMemo(() => {
    return data.nodes.filter((node) => {
      const included = node.core || node.id === selectedNodeId || focusNeighborIds.has(node.id);
      return included && enabledKinds[node.kind];
    });
  }, [data.nodes, enabledKinds, focusNeighborIds, selectedNodeId]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);

  const visibleEdges = useMemo(() => {
    const candidateEdges = data.edges.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
    if (!selectedNodeId || !visibleNodeIds.has(selectedNodeId)) return candidateEdges.sort(sortEdges).slice(0, MAX_EDGES);

    const focusEdges = candidateEdges
      .filter((edge) => edge.source === selectedNodeId || edge.target === selectedNodeId)
      .sort(sortEdges)
      .slice(0, 36);
    const focusEdgeIds = new Set(focusEdges.map((edge) => edge.id));
    const restEdges = candidateEdges
      .filter((edge) => !focusEdgeIds.has(edge.id))
      .sort(sortEdges)
      .slice(0, Math.max(0, MAX_EDGES - focusEdges.length));

    return [...focusEdges, ...restEdges].sort(sortEdges);
  }, [data.edges, selectedNodeId, visibleNodeIds]);

  const coordinates = useMemo(() => layoutNodes(visibleNodes), [visibleNodes]);
  const visibleEdgesById = useMemo(() => new Map(visibleEdges.map((edge) => [edge.id, edge])), [visibleEdges]);
  const activeEdgeId = hoveredEdgeId ?? selectedEdgeId;
  const activeNodeCandidateId = hoveredNodeId ?? selectedNodeId;
  const activeEdge = activeEdgeId
    ? visibleEdgesById.get(activeEdgeId)
    : activeNodeCandidateId
      ? undefined
      : visibleEdges[0];
  const activeEdgeDetails = useMemo(() => {
    if (!activeEdge) return undefined;
    const source = nodesById.get(activeEdge.source);
    const target = nodesById.get(activeEdge.target);
    return source && target ? { edge: activeEdge, source, target } : undefined;
  }, [activeEdge, nodesById]);
  const activeNodeId = activeEdgeDetails ? null : activeNodeCandidateId;
  const activeNode = activeNodeId ? nodesById.get(activeNodeId) : undefined;
  const edgeEndpointNodeIds = useMemo(() => {
    if (!activeEdgeDetails) return new Set<string>();
    return new Set([activeEdgeDetails.edge.source, activeEdgeDetails.edge.target]);
  }, [activeEdgeDetails]);
  const adjacentNodeIds = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    const ids = new Set<string>();
    for (const edge of visibleEdges) {
      if (edge.source === activeNodeId) ids.add(edge.target);
      if (edge.target === activeNodeId) ids.add(edge.source);
    }
    return ids;
  }, [activeNodeId, visibleEdges]);

  const activeRelations = useMemo(() => {
    if (!activeNodeId) return [];
    return data.edges
      .filter((edge) => edge.source === activeNodeId || edge.target === activeNodeId)
      .sort(sortEdges)
      .slice(0, 8)
      .map((edge) => {
        const neighborId = edge.source === activeNodeId ? edge.target : edge.source;
        const node = nodesById.get(neighborId);
        return node ? { edge, node } : undefined;
      })
      .filter(isRelationMapPanelItem);
  }, [activeNodeId, data.edges, nodesById]);

  const activeRelationEvidence = useMemo(() => {
    return collectNodeEvidence(activeRelations);
  }, [activeRelations]);

  const strongestVisibleEdges = useMemo(() => {
    return visibleEdges
      .slice(0, 6)
      .map((edge) => {
        const source = nodesById.get(edge.source);
        const target = nodesById.get(edge.target);
        return source && target ? { edge, source, target } : undefined;
      })
      .filter(isRelationMapEdgePanelItem);
  }, [nodesById, visibleEdges]);

  useEffect(() => {
    if (selectedEdgeId && !visibleEdgesById.has(selectedEdgeId)) setSelectedEdgeId(null);
    if (hoveredEdgeId && !visibleEdgesById.has(hoveredEdgeId)) setHoveredEdgeId(null);
  }, [hoveredEdgeId, selectedEdgeId, visibleEdgesById]);

  const toggleKind = (kind: RelationMapNodeKind) => {
    setEnabledKinds((current) => ({ ...current, [kind]: !current[kind] }));
  };

  const selectEdge = (edgeId: string) => {
    setSelectedEdgeId(edgeId);
    setSelectedNodeId(null);
    setHoveredNodeId(null);
  };

  return (
    <div className="relation-map-tool">
      <div className="relation-map-toolbar" aria-label="图谱筛选">
        {(['character', 'motif', 'chapter'] as RelationMapNodeKind[]).map((kind) => {
          const Icon = KIND_ICONS[kind];
          return (
            <button
              aria-pressed={enabledKinds[kind]}
              className={`relation-map-toggle ${enabledKinds[kind] ? 'is-active' : ''}`}
              key={kind}
              onClick={() => toggleKind(kind)}
              type="button"
            >
              <Icon aria-hidden="true" size={16} />
              <span>{KIND_LABELS[kind]}</span>
            </button>
          );
        })}
        <span className="relation-map-status" aria-live="polite">
          {visibleNodes.length} 个节点 · {visibleEdges.length} 条共现边
        </span>
      </div>

      <div className="relation-map-main">
        <div className="relation-map-stage" aria-label="全站关系图谱">
          <svg className="relation-map-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img">
            <title>全站关系图谱</title>
            <desc>人物、意象与章节基于同一事件共现形成的轻量关系图。</desc>
            <line className="relation-map-axis" x1="68" x2="972" y1="322" y2="322" />
            <g className="relation-map-edges">
              {visibleEdges.map((edge) => {
                const sourcePoint = coordinates.get(edge.source);
                const targetPoint = coordinates.get(edge.target);
                const sourceNode = nodesById.get(edge.source);
                const targetNode = nodesById.get(edge.target);
                if (!sourcePoint || !targetPoint || !sourceNode || !targetNode) return null;
                const path = edgePath(sourcePoint, targetPoint);
                const activeByEdge = activeEdgeDetails?.edge.id === edge.id;
                const activeByNode = Boolean(activeNodeId && (edge.source === activeNodeId || edge.target === activeNodeId));
                const active = activeByEdge || activeByNode;
                const muted = activeEdgeDetails ? !activeByEdge : Boolean(activeNodeId && !activeByNode);
                return (
                  <g className="relation-map-edge-group" key={edge.id}>
                    <path
                      className={`relation-map-edge ${active ? 'is-active' : ''} ${muted ? 'is-muted' : ''}`}
                      d={path}
                      strokeWidth={edgeWidth(edge, data.stats.maxWeight)}
                    />
                    <path
                      aria-label={`查看${sourceNode.title}与${targetNode.title}的${edge.weight}个共现事件`}
                      className="relation-map-edge-hit"
                      d={path}
                      onBlur={() => setHoveredEdgeId(null)}
                      onClick={() => selectEdge(edge.id)}
                      onFocus={() => {
                        setHoveredEdgeId(edge.id);
                        setHoveredNodeId(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          selectEdge(edge.id);
                        }
                      }}
                      onMouseEnter={() => {
                        setHoveredEdgeId(edge.id);
                        setHoveredNodeId(null);
                      }}
                      onMouseLeave={() => setHoveredEdgeId(null)}
                      role="button"
                      strokeWidth={Math.max(14, edgeWidth(edge, data.stats.maxWeight) + 8)}
                      tabIndex={0}
                    >
                      <title>{`${sourceNode.title} ↔ ${targetNode.title}，${edge.weight} 个共现事件`}</title>
                    </path>
                  </g>
                );
              })}
            </g>
            <g className="relation-map-nodes">
              {visibleNodes.map((node) => {
                const point = coordinates.get(node.id);
                if (!point) return null;
                const active = activeNodeId === node.id;
                const adjacent = adjacentNodeIds.has(node.id);
                const edgeEndpoint = edgeEndpointNodeIds.has(node.id);
                const muted = activeEdgeDetails
                  ? !edgeEndpoint
                  : Boolean(activeNodeId && !active && !adjacent);
                return (
                  <a
                    aria-label={`打开${node.title}`}
                    className="relation-map-node-link"
                    href={node.href}
                    key={node.id}
                    onBlur={() => setHoveredNodeId(null)}
                    onClick={(event) => {
                      if (!selectedEdgeId) return;
                      event.preventDefault();
                      setSelectedEdgeId(null);
                      setHoveredEdgeId(null);
                      setSelectedNodeId(node.id);
                    }}
                    onFocus={() => {
                      setSelectedEdgeId(null);
                      setHoveredEdgeId(null);
                      setHoveredNodeId(node.id);
                    }}
                    onMouseEnter={() => {
                      setHoveredEdgeId(null);
                      setHoveredNodeId(node.id);
                    }}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    <g
                      className={`relation-map-node relation-map-node-${node.kind} ${active ? 'is-active' : ''} ${
                        adjacent ? 'is-adjacent' : ''
                      } ${edgeEndpoint ? 'is-edge-endpoint' : ''} ${muted ? 'is-muted' : ''}`}
                      transform={`translate(${point.x} ${point.y})`}
                    >
                      <title>{`${node.title}，${node.eventCount} 个事件`}</title>
                      {node.kind === 'chapter' ? (
                        <>
                          <rect height="28" rx="6" width="40" x="-20" y="-14" />
                          <text dominantBaseline="middle" textAnchor="middle">
                            {String(node.sortKey).padStart(2, '0')}
                          </text>
                        </>
                      ) : (
                        <>
                          <circle r={nodeRadius(node)} />
                          <text dominantBaseline="middle" textAnchor={point.anchor} x={point.anchor === 'start' ? 20 : -20}>
                            {node.title}
                          </text>
                        </>
                      )}
                    </g>
                  </a>
                );
              })}
            </g>
          </svg>
        </div>

        <aside className="relation-map-panel" aria-live="polite">
          {activeEdgeDetails ? (
            <>
              <p className="eyebrow">Evidence Edge</p>
              <h2>
                {activeEdgeDetails.source.title} ↔ {activeEdgeDetails.target.title}
              </h2>
              <p className="muted">这条关系来自同一结构化事件中的共现，可直接回到全书时间线核对。</p>
              <div className="relation-map-facts">
                <span>
                  {KIND_LABELS[activeEdgeDetails.source.kind]} · {KIND_LABELS[activeEdgeDetails.target.kind]}
                </span>
                <span>{activeEdgeDetails.edge.weight} 个共现事件</span>
              </div>
              <div className="relation-map-explanation">
                <h3>关系解释</h3>
                <div className="relation-map-explanation-grid">
                  <span>
                    <small>关系类型</small>
                    <strong>{activeEdgeDetails.edge.explanation.relationType}</strong>
                  </span>
                  <span>
                    <small>时间跨度</small>
                    <strong>{activeEdgeDetails.edge.explanation.timeSpan}</strong>
                  </span>
                </div>
                <div className="relation-map-function-tags" aria-label="文学功能">
                  {activeEdgeDetails.edge.explanation.literaryFunctions.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                {activeEdgeDetails.edge.explanation.keyEvidence.length > 0 && (
                  <div className="relation-map-key-evidence">
                    <small>关键证据</small>
                    {activeEdgeDetails.edge.explanation.keyEvidence.map((event) => (
                      <a href={event.href} key={event.id}>
                        <span>{event.title}</span>
                        <small>
                          第{event.chapter}章 · 事件 {String(event.order).padStart(2, '0')}
                        </small>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="relation-map-evidence-list">
                <h3>共现事件</h3>
                {activeEdgeDetails.edge.events.map((event) => (
                  <a className="relation-map-evidence-item" href={event.href} key={event.id}>
                    <span className="relation-map-evidence-title">{event.title}</span>
                    <small>
                      第{event.chapter}章 · 事件 {String(event.order).padStart(2, '0')}
                    </small>
                  </a>
                ))}
              </div>
            </>
          ) : activeNode ? (
            <>
              <p className="eyebrow">{KIND_LABELS[activeNode.kind]} · Relation Focus</p>
              <h2>{activeNode.title}</h2>
              <p className="muted">{activeNode.summary}</p>
              <div className="relation-map-facts">
                <span>{activeNode.meta}</span>
                <span>{activeNode.eventCount} 个事件</span>
              </div>
              <a className="relation-map-open" href={activeNode.href}>
                <span>打开档案</span>
                <ArrowUpRight aria-hidden="true" size={16} />
              </a>
              {activeRelations.length > 0 && (
                <div className="relation-map-panel-list">
                  <h3>强关联</h3>
                  {activeRelations.map(({ edge, node }) => (
                    <button
                      className="relation-map-panel-item relation-map-panel-button"
                      key={edge.id}
                      onClick={() => selectEdge(edge.id)}
                      type="button"
                    >
                      <span>
                        <strong>{node.title}</strong>
                        <small>{KIND_LABELS[node.kind]}</small>
                      </span>
                      <span className="relation-count">{edge.weight}</span>
                    </button>
                  ))}
                </div>
              )}
              {activeRelationEvidence.length > 0 && (
                <div className="relation-map-evidence-list">
                  <h3>共现事件</h3>
                  {activeRelationEvidence.map((item) => (
                    <a className="relation-map-evidence-item" href={item.event.href} key={item.id}>
                      <span className="relation-map-evidence-title">{item.event.title}</span>
                      <small>
                        与{item.neighbor.title}共现 · 第{item.event.chapter}章
                      </small>
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="eyebrow">Relation Overview</p>
              <h2>全站共现概览</h2>
              <p className="muted">
                默认保留核心人物、核心意象和二十个章节。移动到节点上可以查看它最强的相邻关系。
              </p>
              <div className="relation-map-facts">
                <span>{data.stats.events} 个事件</span>
                <span>{data.stats.coreNodes} 个默认节点</span>
                <span>{data.stats.defaultEdges} 条默认边</span>
              </div>
              <div className="relation-map-panel-list">
                <h3>当前最强共现</h3>
                {strongestVisibleEdges.map(({ edge, source, target }) => (
                  <button
                    className="relation-map-panel-item relation-map-panel-button"
                    key={edge.id}
                    onClick={() => selectEdge(edge.id)}
                    type="button"
                  >
                    <span>
                      <strong>{source.title}</strong>
                      <small>{target.title}</small>
                    </span>
                    <span className="relation-count">{edge.weight}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function layoutNodes(nodes: RelationMapNode[]) {
  const coordinates = new Map<string, Coordinates>();
  const chapters = nodes.filter((node) => node.kind === 'chapter').sort((a, b) => Number(a.sortKey) - Number(b.sortKey));
  const characters = nodes.filter((node) => node.kind === 'character').sort(sortNodesForCharacterLane);
  const motifs = nodes.filter((node) => node.kind === 'motif').sort((a, b) => a.rank - b.rank);

  chapters.forEach((node, index) => {
    const step = chapters.length > 1 ? 904 / (chapters.length - 1) : 0;
    coordinates.set(node.id, {
      x: 68 + step * index,
      y: 322 + (index % 2 === 0 ? -24 : 24),
      anchor: 'middle'
    });
  });

  placeSideLane(characters, coordinates, {
    singleX: 162,
    firstX: 92,
    secondX: 284,
    anchor: 'start'
  });
  placeSideLane(motifs, coordinates, {
    singleX: 872,
    firstX: 754,
    secondX: 944,
    anchor: 'end'
  });

  return coordinates;
}

function placeSideLane(
  nodes: RelationMapNode[],
  coordinates: Map<string, Coordinates>,
  options: { singleX: number; firstX: number; secondX: number; anchor: 'start' | 'end' }
) {
  const columns = nodes.length > 12 ? 2 : 1;
  const rows = Math.ceil(nodes.length / columns);
  const rowHeight = Math.max(28, Math.min(44, 486 / Math.max(1, rows - 1)));
  const startY = 70;

  nodes.forEach((node, index) => {
    const column = columns === 1 ? 0 : index % 2;
    const row = columns === 1 ? index : Math.floor(index / 2);
    coordinates.set(node.id, {
      x: columns === 1 ? options.singleX : column === 0 ? options.firstX : options.secondX,
      y: startY + row * rowHeight,
      anchor: options.anchor
    });
  });
}

function edgePath(source: Coordinates, target: Coordinates) {
  const sameX = Math.abs(source.x - target.x) < 1;
  const direction = sameX ? (source.x < WIDTH / 2 ? -1 : 1) : target.x > source.x ? 1 : -1;
  const curve = sameX ? 54 : Math.max(44, Math.abs(target.x - source.x) * 0.38);
  const sourceControlX = source.x + curve * direction;
  const targetControlX = target.x - curve * direction;
  return `M ${source.x} ${source.y} C ${sourceControlX} ${source.y}, ${targetControlX} ${target.y}, ${target.x} ${target.y}`;
}

function nodeRadius(node: RelationMapNode) {
  return Math.min(18, 9 + Math.sqrt(node.eventCount) * 1.35);
}

function edgeWidth(edge: RelationMapEdge, maxWeight: number) {
  if (!maxWeight) return 1;
  return 0.7 + (edge.weight / maxWeight) * 4.8;
}

function sortEdges(a: RelationMapEdge, b: RelationMapEdge) {
  return b.weight - a.weight || a.id.localeCompare(b.id, 'zh-CN');
}

function sortNodesForCharacterLane(a: RelationMapNode, b: RelationMapNode) {
  const generationDiff = Number(a.sortKey) - Number(b.sortKey);
  return generationDiff || a.rank - b.rank;
}

function collectNodeEvidence(relations: Array<{ edge: RelationMapEdge; node: RelationMapNode }>) {
  const rows = relations.slice(0, 4);
  const evidence: NodeEvidenceItem[] = [];
  let eventIndex = 0;

  while (evidence.length < 6) {
    let added = false;
    for (const row of rows) {
      const event = row.edge.events[eventIndex];
      if (!event) continue;
      evidence.push({
        id: `${row.edge.id}:${event.id}`,
        event,
        edge: row.edge,
        neighbor: row.node
      });
      added = true;
      if (evidence.length >= 6) break;
    }
    if (!added) break;
    eventIndex += 1;
  }

  return evidence;
}

function isRelationMapPanelItem(
  value: { edge: RelationMapEdge; node: RelationMapNode } | undefined
): value is { edge: RelationMapEdge; node: RelationMapNode } {
  return Boolean(value);
}

function isRelationMapEdgePanelItem(
  value: { edge: RelationMapEdge; source: RelationMapNode; target: RelationMapNode } | undefined
): value is { edge: RelationMapEdge; source: RelationMapNode; target: RelationMapNode } {
  return Boolean(value);
}
