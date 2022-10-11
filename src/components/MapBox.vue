<script setup>
    import { onMounted, reactive } from 'vue'
    import mapboxgl from 'mapbox-gl'
    import { PathFinder } from '../js/pathfinder'


    let point = reactive({
        a: '',
        b: '',
    })

    const clearButtonClickHandler = () => {
        point.a = ''
        point.b = ''
        marker1.remove()
        marker2.remove()
        map.getSource('ABPath').setData({type: "FeatureCollection", features: []})
    }

    let map
    let marker1 = new mapboxgl.Marker({color: 'green'})
    let marker2 = new mapboxgl.Marker({color: 'blue'})
    let pathfinder = new PathFinder


    const props = defineProps({
        config: {type: Object},
        pointAB: {type: Object},
    })

    onMounted(() => {
        mapboxgl.accessToken = "pk.eyJ1IjoicG9wb3ZwcyIsImEiOiJja3EyZzhxZ28wamMyMnBtdXdodjZ0NzNxIn0.axwSz4f2cJVj7xAV62dvug"
        map = new mapboxgl.Map(props.config)

        map.on('style.load', () => {
            map.setFog({}); // Set the default atmosphere style
        })

        map.on('load', () => {
            map.addSource('roads', {
                type: 'geojson',
                data: '/assets/export.geojson'
            })

            map.addLayer({
                id: 'roads',
                type: 'line',
                source: 'roads',
            })

            fetch('/assets/export.json')
            .then((response) => response.json())
            .then((data) => {
                pathfinder.loadData(data.elements)
                map.addSource('Points', {
                    type: 'geojson',
                    data: pathfinder.pointsLayer
                })

                map.addSource('ABPath', {type: 'geojson', data: {type: "FeatureCollection", features: []}}) 
                map.addLayer({
                    'id': 'ABPath',
                    'type': 'line',
                    'source': 'ABPath',
                    'paint': {
                        'line-color': 'green',
                        'line-opacity': 0.75,
                        'line-width': 5
                    }
                })

                map.addLayer({
                    'id': 'Points',
                    'type': 'circle',
                    'source': 'Points',
                    'paint': {
                        'circle-color': '#f00',
                        'circle-radius': 4,
                    }
        
            })
            
            map.on('click', e => {
                const clickPoint = e.lngLat.wrap()
                const nearest = pathfinder.findNearBy(clickPoint.lat, clickPoint.lng)
                if (nearest.length > 0) {
                    const name = nearest[0].i

                    if (point.a === '' ) {
                        marker1.setLngLat([clickPoint.lng, clickPoint.lat]).addTo(map)
                        point.a = name
                    } 
                    else {
                        marker2.setLngLat([clickPoint.lng, clickPoint.lat]).addTo(map)                        
                        point.b = name
                    }

                    if (point.a !== '' && point.b !== ''  ) {
                        const data = pathfinder.findPath(point.a, point.b)
                        map.getSource('ABPath').setData(data)
                    }                    
                }

            })

            })
            .catch((error) => console.log(error))            
        })


    })

</script>

<template>
    <div class="points">
        <div><b>От точки:</b> {{ point.a }}</div>
        <div><b>До:</b> {{ point.b }}</div>
        <div class="clearButton" @click="clearButtonClickHandler">X</div>
    </div>    
    <div id="mapboxContainer"></div>
</template>
