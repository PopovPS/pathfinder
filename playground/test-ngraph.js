import CreateGrpah from 'ngraph.graph'
import { aStar } from 'ngraph.path'

let graph = CreateGrpah()

export const pointsLayer = {
    "type": "FeatureCollection",
    "name": "points",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "id": 1, "name": "a" }, "geometry": { "type": "Point", "coordinates": [86.407659384151657, 54.131457368528508] } },
        { "type": "Feature", "properties": { "id": 2, "name": "b" }, "geometry": { "type": "Point", "coordinates": [86.408617305214975, 54.132308945365033] } },
        { "type": "Feature", "properties": { "id": 3, "name": "c" }, "geometry": { "type": "Point", "coordinates": [86.409211876909467, 54.132192822281745] } },
        { "type": "Feature", "properties": { "id": 4, "name": "d" }, "geometry": { "type": "Point", "coordinates": [86.410434052059202, 54.132270237706777] } },
        { "type": "Feature", "properties": { "id": null, "name": "e" }, "geometry": { "type": "Point", "coordinates": [86.41122681431851, 54.131883159134922] } },
        { "type": "Feature", "properties": { "id": null, "name": "f" }, "geometry": { "type": "Point", "coordinates": [86.410467083820009, 54.130857383427823] } },
        { "type": "Feature", "properties": { "id": null, "name": "g" }, "geometry": { "type": "Point", "coordinates": [86.409806448603931, 54.130296099176718] } },
        { "type": "Feature", "properties": { "id": null, "name": "h" }, "geometry": { "type": "Point", "coordinates": [86.400821809665175, 54.134747454922241] } },
        { "type": "Feature", "properties": { "id": null, "name": "j" }, "geometry": { "type": "Point", "coordinates": [86.401350317838038, 54.13544414557294] } }
    ]
}

pointsLayer.features.forEach((el) => graph.addNode(el.properties.name, {x: el.geometry.coordinates[0], y: el.geometry.coordinates[1]}) )

graph.addLink('a', 'b', {weight: 10})
graph.addLink('a', 'g', {weight: 10})
graph.addLink('b', 'c', {weight: 10})
graph.addLink('c', 'd', {weight: 10})
graph.addLink('d', 'e', {weight: 10})
graph.addLink('e', 'f', {weight: 10})
graph.addLink('f', 'c', {weight: 10})
graph.addLink('f', 'g', {weight: 10})


let pathFinder = aStar(graph, {
    distance(fromNode, toNode) {
      let dx = fromNode.data.x - toNode.data.x;
      let dy = fromNode.data.y - toNode.data.y;
  
      return Math.sqrt(dx * dx + dy * dy);
    },
    heuristic(fromNode, toNode) {
      let dx = fromNode.data.x - toNode.data.x;
      let dy = fromNode.data.y - toNode.data.y;
  
      return Math.sqrt(dx * dx + dy * dy);
    }
  });


export default function findPath(a, b) {
    return pathFinder.find('a', 'f');
}
