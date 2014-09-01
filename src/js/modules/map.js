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
                new google.maps.LatLng(53.45895002154289, -2.2487240243172812),
                new google.maps.LatLng(53.477802484563036, -2.2163297412497887)
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
            watch: null,
            whereami: function() {
                if (this.watch == null) {
                    console.log("No watch -- watching location --- ");
                    var alertBox = null;
                    var that = this;
                    this.watch = navigator.geolocation.watchPosition(function(position) {
                        console.log("Got Position -- "+position.coords.latitude +" :: " +position.coords.longitude);
                        var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        if (mapBounds.contains(location)) {
                            console.log("On Campus");
                            map.setCenter(location);
                            if (that.meMarker !== null) {
                                that.meMarker.setMap(null);
                            }
                            that.meMarker = new google.maps.Marker({
                                position: location,
                                map: map,
                                title: 'You are here'
                            });
                        } else {
                            console.log("Off Campus");
                            navigator.notification.alert("You do not appear to be on campus at the moment", function() { external.whereami() }, "Where am I", "Ok");
                        }
                    }, function(error) {
                        navigator.notification.alert("There was an error getting your location.", function() { external.whereami() }, "Where am I", "Ok");
                        console.warn("ERROR("+error.code+") "+error.message);
                    },{
                        enableHighAccuracy: true,
                        timeout: 30000,
                        maximumAge: 0,
                    });
                } else {
                    console.log("Watcher being cancelled");
                    if (this.meMarker !== null) {
                        this.meMarker.setMap(null);
                        this.meMarker = null;
                    }
                    navigator.geolocation.clearWatch(this.watch);
                    this.watch = null;
                }
            },
            search: function() {
                
            }
        }
        
        CAMPUS_MAP = external;
    });
})(jQuery);