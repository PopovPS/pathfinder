<script setup>
    import MapBox from '@/components/MapBox.vue'

    const mapboxConfig = {
            container: 'mapboxContainer', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [86.406130, 54.132559], // starting position [lng, lat]
            zoom: 14, // starting zoom
            projection: 'globe' // display the map as a 3D globe
        }

</script>
<template>
    <MapBox :config="mapboxConfig" />
</template>