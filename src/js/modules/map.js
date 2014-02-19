var CAMPUS_MAP = {};

(function($) {
    $(document).ready(function() {
        
        
        
        var options, map, minZoom, maxZoom;

        var location = {
            lat: 53.4685527268,
            lng: -2.233056859149997,
            title: "University Campus",
            mark: false
        };
        
        if (localStorage.getItem("mapLocation") !== null) {
            var mapLocation = localStorage.getItem("mapLocation").split(",");
            localStorage.removeItem("mapLocation");
            location.lat = mapLocation[0];
            location.lng = mapLocation[1];
            location.title = mapLocation[2];
            location.mark = true;
        }

        minZoom = 13;
        maxZoom = 17;

        options = {
            center: new google.maps.LatLng(location.lat, location.lng),
            zoom: maxZoom,
            maxZoom: maxZoom,
            minZoom: minZoom,
            mapTypeId: "UoM",
            zoomControl: false,
            mapTypeControl: false,
            disableDefaultUI: true
        };
        map = new google.maps.Map(document.getElementById('mapCanvas'), options);


        var mapBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(53.46000847484184, -2.248908910689955),
                new google.maps.LatLng(53.477890311198905, -2.2179918366590914)
                );

        var maptiler = new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                var proj = map.getProjection();
                var tileSize = 256 / Math.pow(2, zoom);
                var tileBounds = new google.maps.LatLngBounds(
                        proj.fromPointToLatLng(new google.maps.Point(coord.x * tileSize, (coord.y + 1) * tileSize)),
                        proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * tileSize, coord.y * tileSize))
                        );
                if (tileBounds.intersects(mapBounds) && (zoom >= minZoom) && (zoom <= maxZoom)) {

                    return  "../data/tiles/" + zoom + "/" + coord.x + "/" + (Math.pow(2, zoom) - coord.y - 1) + ".png";
                } else
                    return "../data/tiles/blank.png";
            },
            tileSize: new google.maps.Size(256, 256),
            isPng: true,
            maxZoom: maxZoom,
            minZoom: minZoom,
            name: "UoM"
        });

        map.mapTypes.set("UoM", maptiler);

        var lastValidCenter = mapBounds.getCenter();

        google.maps.event.addListener(map, 'center_changed', function() {
            var gmapCenter = map.getCenter();
            if (mapBounds.contains(gmapCenter)) {
                // still within valid bounds, so save the last valid position
                lastValidCenter = gmapCenter;
                return;
            }
            // not valid anymore => return to last valid position
            map.setCenter(lastValidCenter);
        });

        if (location.mark) {
            var location = new google.maps.LatLng(location.lat, location.lng);
            map.setCenter(location);
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: location.title
            });
        }
        
        var external = {
            map: map,
            meMarker: null,
            whereami: function() {
                if (this.meMarker !== null) {
                    this.meMarker.setMap(null);
                    this.meMarker = null;
                }
                var that = this;
                navigator.geolocation.getCurrentPosition(function(position) {
                    var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.setCenter(location);
                    that.meMarker = new google.maps.Marker({
                        position: location,
                        map: map,
                        title: 'You are here'
                    });
                });
            }
        }
        
        CAMPUS_MAP = external;
    });
})(jQuery);