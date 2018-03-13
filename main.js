var localStorage = window.localStorage;

function update_ancor(map) {
    zoom = map.getZoom();
    pos = map.getCenter();
    var hash = 'map=' + zoom + '/' + pos.lat + '/' + pos.lng + '&style=' + cur_style;
    window.location.hash = (hash);
    localStorage.setItem("pos", hash);
    return true;
}

//function do_map(new_scene) {
var map = L.map('map');
//}
//var map = do_map('streetcomplete-mapstyle/streetcomplete-light-style.yaml');

var hash = window.location.hash.split('#', 2)[1];
var cur_style = 'cinnabar';
var styles = {
    'cinnabar': 'map-styles/cinnabar.yaml',
    'streetcomplete-light': 'map-styles/streetcomplete-mapstyle/streetcomplete-light-style.yaml',
    'streetcomplete-dark': 'map-styles/streetcomplete-mapstyle/streetcomplete-dark-style.yaml'
};

function set_style(name, sceene) {
    sceene.load(styles[name]);
    cur_style = name
}

console.log(hash);

if (hash === undefined && hash === '') {
    hash = localStorage.getItem("pos")
}

var map_position = false;
if (hash !== undefined && hash !== '') {
    fields = hash.split('&');
    for (var i in fields) {
        var field = fields[i].split('=');
        switch (field[0]) {
            case 'map':
                zpos = field[1].split('/');
                map.setView([zpos[1], zpos[2]], zpos[0]);
                map_position = true;
                break;
            case 'style':
                console.log('Style: ' + field[1]);
                cur_style = field[1];
                break;
            default:
                console.log('unkown argument: ' + field[0]);
                break
        }
    }
}
if (!map_position)
{
    map.setView([53.59955, 9.93301], 17);
}
map.on('zoomend', function (ev) {
    update_ancor(map)
});
map.on('moveend', function (ev) {
    update_ancor(map)
});

var layer = Tangram.leafletLayer({
    scene: styles[cur_style],
    attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors'
});
layer.addTo(map);
//return map;
var scene = layer.scene;
//set_style(cur_style, scene);