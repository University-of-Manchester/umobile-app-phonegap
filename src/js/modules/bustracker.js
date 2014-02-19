var BUSTRACKER = {};

(function($) {

    $(function() {

        BUSTRACKER = function() {
            var URL_BASE = "http://147tracker.itservices.manchester.ac.uk/NavManService";

            var locations = [];
            var buses = [];
            var map = null;

            function getBusLocations() {
                $.get(URL_BASE + "/getbuslocations", function(data) {
                    locations = data;
                    initializeBusMarkers();
                    showBuses(map);
                });
            }


            function initializeBusMarkers() {
                $(locations).each(function(index) {
                    var busLocation = new google.maps.LatLng(this.busLocation.latitude, this.busLocation.longitude);
                    var bus = new google.maps.Marker({
                        position: busLocation,
                        title: this.busId + " " + this.busLocation.direction,
                        icon: "../images/bustracker/" + getBusType(this.type) + "_" + findDirection(this.busLocation.direction) + ".png"
                    });
                    buses.push(bus);
                });
            }

            function showBuses(map) {
                if (buses) {
                    for (bus in buses) {
                        buses[bus].setMap(map);
                    }
                }
            }

            function clearBuses() {
                if (buses) {
                    for (bus in buses) {
                        buses[bus].setMap(null);
                    }
                    buses.length = 0;
                }
            }

            var kmlLayer = new google.maps.KmlLayer(null);
            
            function removeRoute(map) {
                kmlLayer.setMap(null);
            }
            
            function renderRoute(map) {
                var kmlUrl = URL_BASE + "/docs/route147.kml?rand=" + Math.random();
                var kmlOptions = {
                    suppressInfoWindows: true,
                    preserveViewport: false
                };
                kmlLayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);
                kmlLayer.setMap(map);
            }


            function findDirection(direction) {
                if ((direction > 0 && direction < 22.5) || (direction > 337.5 && direction < 360)) {
                    return "N";
                } else if (direction > 22.5 && direction < 67.5) {
                    return "NE";
                } else if (direction > 67.5 && direction < 112.5) {
                    return "E";
                } else if (direction > 112.5 && direction < 157.5) {
                    return "SE";
                } else if (direction > 157.5 && direction < 202.5) {
                    return "S";
                } else if (direction > 202.5 && direction < 247.5) {
                    return "SW";
                } else if (direction > 247.5 && direction < 292.5) {
                    return "W";
                } else if (direction > 292.5 && direction < 337.5) {
                    return "NW";
                }
            }

            function getBusType(type) {
                if (type == 1) {
                    return "DD";
                } else {
                    return "SD";
                }
            }


            var external = {
                refresh: null,
                init: function(mapObject) {
                    map = mapObject;
                },
                start: function() {
                    renderRoute(map);
                    getBusLocations();
                    this.refresh = setInterval(function() {
                        clearBuses();
                        getBusLocations();
                    }, 12000);
                },
                stop : function() {
                    clearInterval(this.refresh);
                    clearBuses();
                    removeRoute();
                }
            }

            return external;

        }();





    });

})(jQuery);