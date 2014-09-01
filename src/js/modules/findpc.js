
(function($) {


    $(function() {
        var location = {
            lat: 53.4685527268,
            lng: -2.233056859149997
        };

        /** Converts numeric degrees to radians */
        if (typeof(Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function() {
                return this * Math.PI / 180;
            }
        }

        function calcDistanceTo(lat, lng) {
            var lat1 = location.lat.toRad(),
                    lat2 = lat.toRad(),
                    lon1 = location.lng.toRad(),
                    lon2 = lng.toRad();

            var R = 6371000; // meters
            var d = Math.acos(Math.sin(lat1) * Math.sin(lat2) +
                    Math.cos(lat1) * Math.cos(lat2) *
                    Math.cos(lon2 - lon1)) * R;

            return Math.round(d);
        }


        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position.coords.longitude);
            console.log(position.coords.latitude);
            location.lat = position.coords.latitude;
            location.lng = position.coords.longitude;

        });
        var listGroup = $("div.list-group");
        $.ajax({
            url: 'http://130.88.133.38:8080/pc-cluster/',
            dataType: 'JSON'
        }).done(function(data) {
            console.log(data);
            
            $.each(data, function(index, cluster) {
                    var taken = "?", avail = "?", total = "?";
                    taken = cluster.numLoggedIn;
                    total = cluster.numSeen;
                    avail = total - taken;

                    var lng = cluster.longitude;
                    var lat = cluster.latitude;

                    var distance = calcDistanceTo(lat, lng);

                    var item = $("<a/>", {href: "map.html", avail: avail, distance: distance, lng: lng, lat: lat, "class": "list-group-item"})
                            .append($("<span/>", {"class": "badge"}).append(avail + "/" + total))
                            .append($("<h4/>").append(cluster.name))
                            .append($("<p/>").append(cluster.locationName + " ").append($("<small/>").append("(&#8776;" + distance + "m)")));
                    
                    var facilities = $("<span/>", {"class":"badge"});
                    if (cluster.printCol) facilities.append($("<span/>", { style: "color: blue",title:"Colour Printing","class": "glyphicon glyphicon-print"}));
                    if (cluster.printMono) facilities.append($("<span/>", { style:"color: black",title:"Mono Printing","class": "glyphicon glyphicon-print"}));
                    if (cluster.printMono) facilities.append($("<span/>", { style:"color: black",title:"Scanning available","class": "glyphicon glyphicon-file"}));
                    item.append(facilities);

                    if (cluster.open === false) item.append($("<div/>", {"class":"alert alert-danger"}).text("Currently Closed"));

                    var group = $(".list-group-item", listGroup)
                            .filter(function() {
                        return  $(this).attr("distance") <= distance;
                    });
                    if (group.length === 0) {
                        listGroup.prepend(item);
                    } else {
                        group.last().after(item);
                    }

            });
         }).fail(function(ret) {
            listGroup.append(
                    $("<div/>",{"class":"list-group-item list-group-item-danger"})
                        .append($("<h4/>").append("Data currently inaccessible."))
                        .append($("<p/>").append("Please try again later."))
            );
        });
        
         $("div.list-group").on("click tap", "a.list-group-item", function() {
            var lng = $(this).attr("lng");
            var lat = $(this).attr("lat");
            var title = $(this).find("h4").text();

            localStorage.setItem("mapLocation", lat+","+lng+","+title);
        });

    });
})(jQuery);