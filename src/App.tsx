import './App.css';
import { Box, Image } from '@chakra-ui/react';
import ReactFlow, { Handle, Position, useNodesState, useEdgesState, addEdge, Background, BackgroundVariant } from 'reactflow';
import { useCallback, useMemo, useState } from 'react';
import 'reactflow/dist/style.css';
import {
    Button,
    IconButton,
    HStack,
    VStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react';
import { ChevronDownIcon, PlusSquareIcon, MinusIcon } from "@chakra-ui/icons";

const spacingX = 800;
const spacingY = 500;

enum ScreenKind {
    First = 0,
    Second = 1,
    Third = 2,
    Fourth = 3,
}

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { screenKind: ScreenKind.First }, type: 'textUpdater', },
    { id: '2', position: { x: spacingX, y: spacingY }, data: { screenKind: ScreenKind.Second }, type: 'textUpdater', },
    { id: '3', position: { x: spacingX, y: 0 }, data: { screenKind: ScreenKind.Third }, type: 'textUpdater', },
    { id: '4', position: { x: 0, y: spacingY }, data: { screenKind: ScreenKind.Fourth }, type: 'textUpdater', },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

enum OutEdgeKind {
    Error = "error",
    Success = "success",
}

interface OutEdge {
    kind: OutEdgeKind,
}

function TextUpdaterNode({ data }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    const [outEdges, setOutEges] = useState<OutEdge[]>([])

    const [screenKind, setScreenKind] = useState<ScreenKind>(data.screenKind);

    return (
        <>
            <Handle
                type="target"
                id="a"
                position={Position.Left}
            />
            <HStack
                align="flex-start"
            >
                <Box
                    h="auto"
                >
                    <Image
                        src={`${screenKind}.png`}
                        h="20rem"
                        w="auto"
                    />
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} mt="-1.5rem">
                            Screen: {screenKind}
                        </MenuButton>
                        <MenuList>
                            {Object.values(ScreenKind)
                                .filter((v) => Number(v) >= 0)
                                .map((sk: ScreenKind) => (
                                    <MenuItem onClick={() => setScreenKind(sk)}>{sk}</MenuItem>
                                ))}
                        </MenuList>
                    </Menu>
                </Box>
                <VStack
                    spacing={2}
                    ml="-1.75rem"
                    mt="20px"
                    // start from the top
                    justify-content="flex-start"
                    align="flex-start"
                    p="0"
                >
                    {outEdges.map((oe: OutEdge, i) => (
                        <HStack w="10rem" spacing="0">
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%" mr="0"
                                    // remove border radius from right side
                                    borderTopRightRadius="0"
                                    borderBottomRightRadius="0"
                                >
                                    {oe.kind}
                                </MenuButton>
                                <MenuList>
                                    {Object.values(OutEdgeKind)
                                        .filter((v) => typeof v === "string")
                                        .map((oek: OutEdgeKind) => (
                                            <MenuItem onClick={() => {
                                                const newOutEdges = [...outEdges];
                                                newOutEdges[i] = { kind: oek };
                                                setOutEges(newOutEdges);
                                            }}>{oek}</MenuItem>
                                        ))}
                                </MenuList>
                            </Menu>
                            <IconButton
                                ml="0"
                                borderTopLeftRadius="0"
                                borderBottomLeftRadius="0"
                                aria-label="remove button"
                                icon={<MinusIcon />}
                                onClick={() => {
                                    const newOutEdges = [...outEdges];
                                    newOutEdges.splice(i, 1);
                                    setOutEges(newOutEdges);
                                }}
                            />
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={`out-${i}`}
                                style={{ top: 49 * (i) + 39 }}
                            />
                        </HStack>
                    ))}
                    <IconButton
                        aria-label="add button"
                        icon={<PlusSquareIcon />}
                        onClick={() => setOutEges([...outEdges, { kind: OutEdgeKind.Success }])}
                    />
                </VStack>
            </HStack>
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
