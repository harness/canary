# Pipeline Graph

A library for generating and interacting with pipeline graphs.

![pipeline graph](./public/pipeline-graph.png 'Pipeline graph')

## Anatomy

- Model
- Container and Content nodes
- Edges
- Canvas

### Model

Type **AnyContainerNodeType** us a union of **LeafContainerNodeType** | **ParallelContainerNodeType** | **SerialContainerNodeType** and represent one node.
**LeafContainerNodeType** node does not have children while other have.

Example of the model

```ts
const model: AnyContainerNodeType[] = [
  {
    type: 'stage',
    children: [{ type: 'step' }, { type: 'step' }]
  }
]
```

In order to visualize our model we need **container** and **content** nodes.

### Container and Content nodes

#### Container node

Container node is responsible for layout and basic user interaction like adding/deleting nodes. There are three containers: **Leaf**, **Serial** and **Parallel**. **Leaf** render one **Content** node, while **Serial**/**Parallel** renders itself and children.

Container node anatomy:

- **Metadata** - At the very root div we have **data-path** and **data-action** attributes which are used for event delegation purpose.
- **Relative positioning** - root div has _position:relative_ so we can use absolute position for styling in the **content** node.
- **Ports** - Port is div. It's position is used for calculating and drawing links between ports.
- **Add/Delete containers** - are used for capturing mouse hover (via css). They have buttons that appears on mouse hover.

#### Content node

Content nodes are responsible for the content of the node (like text, icons etc.) and visualizing state (like _loading_ or _selection_)

#### Pairing Content and Connection nodes

In order to render our graph we have to pair container and content node. For this we uses **NodeContent** type.

```ts
const nodes: NodeContent[] = [
  // register "step" content node which will render "StepContentNode" inside "leaf" container
  {
    type: "step",
    component: StepContentNode,
    containerType: ContainerNode.leaf
  },
  // register "stage" content node which will render "SerialGroupContentNode" inside "serial" container
  {
    type: "stage",
    component: SerialGroupContentNode
    containerType: ContainerNode.serial,
  }
]
```

### Edges

Connection lines between nodes are drawn using svg paths. Lines are calculated using ports (which are part of container nodes).

### Canvas

Library provides pan and pinch-to-zoom out of the box.
For creating manual controls for zoom in/out and fit we can use useCanvasContext that exposes increment, decrement and fit functions.

Implementing custom controls example

```tsx
const { increase, decrease, fit } = useCanvasContext()

return <>
    <button onClick={() => increase()}>+</button>
    <button onClick={() => decrease()}>-</button>
    <button onClick={() => fit()}>FIT</button>
</>
```
