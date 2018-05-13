// 一级一级获取栏目节点
export const setNodes = (nodes, nodesByKey = {}) => {
    for (let i = 0; i < nodes.length; i++) {
        let { childs, nodeId } = nodes[i]
        nodesByKey[nodeId] = {
            ...nodes[i],
            children: childs ? childs.map(child => child.nodeId) : undefined
        }
        delete nodesByKey[nodeId].childs
        childs && setNodes(childs, nodesByKey)
    }
    return nodesByKey
}