
function displayFeatureInfo(feature){
	if (feature){
		idGaia = feature.get("idGaia");
		code = feature.get("codeLigne");
		pkdebut = Number.parseInt(feature.get("pkDebut"));
		pkfin = Number.parseInt(feature.get("pkFin"));
		
		info = {title: "TronconDItineraireLigne", 
				body: "", 
				items: ["UUID : " + idGaia, "Ligne : " + code, "PkDebut : " + pkdebut, "PkFin : " + pkfin]}
		//ngGaiaScope.updateLeftPanel(info);
		scope = angular.element('[ng-controller=mainCtrl]').scope();
		scope.updateLeftPanel(info);
		scope.$apply();
	}
}

function createPointFeature(features) {
	var pointFeatures = []
	for (i = 0; i < features.length; i++) {
		geometry = features[i].getGeometry();

		coordinates = geometry.getCoordinates();
		pkDebutValue = features[i].get("pkDebut");
		pointFeature = new ol.Feature({
			geometry : new ol.geom.Point(coordinates[0]),
			name : 'pkDebut',
			pk: pkDebutValue
		});
		pointFeatures.push(pointFeature);
	}
	return pointFeatures;
}

function createPointFeatureStyle(pointFeature){
	pk = pointFeature.get("pk").toString();
	return new ol.style.Style({
		image: new ol.style.Circle({
	        radius: 2,
	        fill: new ol.style.Fill({
	            color: 'rgba(100,50,200,0.5)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: 'rgba(120,30,100,0.8)',
	            width: 3
	        })
	    }),
	    text: new ol.style.Text({
	        font: '12px helvetica,sans-serif',
	        text: pk,
	        fill: new ol.style.Fill({
	            color: '#000'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#fff',
	            width: 2
	        })
	    })
	});
}


map.on("moveend", function(event){
	togglePKValueDisplay(map.getView().getZoom())
})

var pkDisplay = false;
function togglePKValueDisplay(zoomLevel){
	if (zoomLevel >= 8){
		
		if (pkDisplay){
			return;
		}
		
		features = pkDebutPointSource.getFeatures();
		for(i=0; i<features.length; i++){ 
			features[i].setStyle(createPointFeatureStyle(features[i]));
		}
		pkDisplay = true;
	} else {
		if (!pkDisplay){
			return;
		}
		
		features = pkDebutPointSource.getFeatures();
		for(i=0; i<features.length; i++){ 
			features[i].setStyle(defaultStyle);
		}
		pkDisplay = false;
	}

}
