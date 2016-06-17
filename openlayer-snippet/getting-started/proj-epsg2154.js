// Definition of EPSG:2154

bbox2154 = [51.56, -9.86, 41.15, 10.38];
extent2154 = [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772];
center2154 = [755520.187986, 6587896.855407];
centerParis = [652242.7019052965, 6862939.613291941]

var proj4def2154 = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
proj4.defs('EPSG:2154', proj4def2154);
var proj2154 = ol.proj.get('EPSG:2154');
proj2154.setExtent(extent2154);


