var blueStyle = new ol.style.Style({
	fill : new ol.style.Fill({
		color : 'rgba(255, 100, 50, 0.3)'
	}),
	stroke : new ol.style.Stroke({
		width : 4,
		color : 'rgba(76, 76, 255, 0.8)'
	}),
	image : new ol.style.Circle({
		fill : new ol.style.Fill({
			color : 'rgba(55, 200, 150, 0.5)'
		}),
		stroke : new ol.style.Stroke({
			width : 1,
			color : 'rgba(0, 0, 0, 0.8)'
		}),
		radius : 2
	}),
});

var redStyle = new ol.style.Style({
	fill : new ol.style.Fill({
		color : 'rgba(255, 100, 50, 0.3)'
	}),
	stroke : new ol.style.Stroke({
		width : 4,
		color : 'rgba(170, 57, 57, 0.8)'
	}),
	image : new ol.style.Circle({
		fill : new ol.style.Fill({
			color : 'rgba(85, 0, 0, 0.5)'
		}),
		stroke : new ol.style.Stroke({
			width : 1,
			color : 'rgba(0, 0, 0, 0.8)'
		}),
		radius : 2
	}),
});

var greenStyle = new ol.style.Style({
	fill : new ol.style.Fill({
		color : 'rgba(202, 234, 156, 0.3)'
	}),
	stroke : new ol.style.Stroke({
		width : 4,
		color : 'rgba(114, 156, 52, 0.8)'
	}),
	image : new ol.style.Circle({
		fill : new ol.style.Fill({
			color : 'rgba(46, 78, 0, 0.5)'
		}),
		stroke : new ol.style.Stroke({
			width : 1,
			color : 'rgba(0, 0, 0, 0.8)'
		}),
		radius : 2
	}),
});

var selectStyle = new ol.style.Style({
	stroke : new ol.style.Stroke({
		color : 'rgba(255, 0, 0, 1)',
		width : 4
	}),
	image : new ol.style.Circle({
		fill : new ol.style.Fill({
			color : 'rgba(0, 0, 0, 0.5)'
		}),
		stroke : new ol.style.Stroke({
			width : 1,
			color : 'rgba(0, 0, 0, 0.8)'
		}),
		radius : 2
	}),
});

styles = {red: redStyle,
		blue: blueStyle,
		green: greenStyle,
		select: selectStyle};