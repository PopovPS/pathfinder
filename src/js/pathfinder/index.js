import CreateGrpah from 'ngraph.graph'
import { aStar } from 'ngraph.path'
import GEO from 'geo-nearby'

export class PathFinder {
    constructor() {
        this.ready = false
        this.pointsLayer = null
        this.PathFinder = null
        this.geo = null
        this.graph = CreateGrpah()
    }

    loadData(elements) {
        const pl = {
            type: "FeatureCollection",
            features: []
        }
    
        elements.forEach(element => {
            if (element.type === "node") {
                pl.features.push({
                    type: 'Feature',
                    properties: {id: element.id},
                    geometry: {
                        type: "Point",
                        coordinates: [element.lon, element.lat]
                    }
                    
                })
                this.graph.addNode(element.id, {x: element.lon, y: element.lat})
            } else if (element.type === "way") {
                const nodes = element.nodes
                for (let i = 1; i < nodes.length; i++) {
                    const from = nodes[i]
                    const to = nodes[i - 1]
                    this.graph.addLink(from, to)
                }
            }
        })


        this.pathFinder = aStar(this.graph, {
            distance(fromNode, toNode) {
              let dx = fromNode.data.x - toNode.data.x
              let dy = fromNode.data.y - toNode.data.y
        
              return Math.sqrt(dx * dx + dy * dy)
            },
            heuristic(fromNode, toNode) {
              let dx = fromNode.data.x - toNode.data.x
              let dy = fromNode.data.y - toNode.data.y
        
              return Math.sqrt(dx * dx + dy * dy)
            }
          })
        this.pointsLayer = pl

        const dataset = GEO.createCompactSet(pl, {id: 'id'})
        
        console.log(dataset)

        this.geo = new GEO(dataset, {sorted: false})

        this.ready = true
    }

    findNearBy(lat, lon) {
        if (!this.ready) return null

        let nearby = this.geo.nearBy(lat, lon, [5, 200])

        return nearby
    }

    findPath(a, b) {
            if (!this.ready) {
                console.log('No data loaded')
                return {
                    type: "FeatureCollection",
                    features: []
                }
            }

            const path = this.pathFinder.find(a, b)
            const lineLayer = {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {type: "LineString", coordinates: path.map((el) => [el.data.x, el.data.y])}
                    }
                ]        
            }
            return lineLayer
        }
}
