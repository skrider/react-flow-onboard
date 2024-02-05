import './App.css';
import { Box } from '@chakra-ui/react';
import ReactFlow, { Handle, Position, useNodesState, useEdgesState, addEdge, Background, BackgroundVariant } from 'reactflow';
import { useCallback, useMemo } from 'react';
import 'reactflow/dist/style.css';

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' }, },
    { id: '2', position: { x: 100, y: 0 }, data: { label: '1' }, },
    { id: '3', position: { x: 200, y: 0 }, data: { label: '1' }, },
    { id: '4', position: { x: 300, y: 0 }, data: { label: '1' }, type: 'textUpdater', },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const handleStyle = { left: 10 };

function TextUpdaterNode({ data }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <Box
                bg="green"
            >
                <label htmlFor="text">Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag" />
            </Box>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={handleStyle}
            />
        </>
    );
}

function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className="App">
            <Box
                w="100vw"
                h="100vh"
            >
                <ReactFlow
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    edges={edges}>
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </Box>
        </div>
    );
}

export default App;
