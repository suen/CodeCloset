//Global variables for this scope

var map;
var selectInteraction;
var ngOapsScope;

var ngOaps = angular.module("oaps", []);

ngOaps.controller("mainCtrl", function($scope, $http){
	
	$scope.leftpanelDisplay = "none";
	$scope.leftpanelTitle = "Information";
	$scope.leftpanelBody = "";
	$scope.leftpanelItems = [""];

	$scope.updateLeftPanel = function(content){
		$scope.leftpanelTitle = content.title;
		$scope.leftpanelBody = content.body;
		$scope.leftpanelItems = content.items;
		$("#leftpanel").show();
	}
	
	$scope.uiLayers = [];
	
	$scope.rasterUiLayers = [];
	
	$scope.validuiLayers = [];
	
	$scope.addEmptyLayer = function(){
		var n = $scope.uiLayers.length + 1;
		$scope.uiLayers.push({label: "Calque " + n, 
								type: "vector",
								idNameInput: "layer" + n, 
								nameValue: "",
								idSourceInput: "layer" + n + "source",
								sourceValue: "",
								idStyleName: "layer" + n + "styleName",
								styleName: "red",
								changed: false,
								readonly:false,
			                	display: true,
			                	olLayer: undefined });
	}
	
	$scope.updateLayersList = function(){
		$scope.uiLayers.forEach(function (layer){
			
			var nameValue = $("#" + layer.idNameInput ).val();
			if (layer.nameValue != nameValue){
				layer.nameValue = nameValue;
			};
			
			var sourceValue = $("#" + layer.idSourceInput ).val();
			if (layer.sourceValue != sourceValue) {
				layer.sourceValue = sourceValue;
				layer.changed = true;
			}
			
			var styleNameValue = $("#" + layer.idStyleName ).val();
			if (layer.styleName != styleNameValue){
				layer.styleName = styleNameValue;
				layer.changed = true;
			}
		});
		
		$scope.updateMap();
		$scope.configurationStatus(true, "Saved");
	}
	
	$scope.configurationStatus = function(success, msg){
		
		if (success){
			$("#configuration-status").removeClass("alert-danger");
			$("#configuration-status").addClass("alert-success");
		} else {
			$("#configuration-status").removeClass("alert-success");
			$("#configuration-status").addClass("alert-danger");
		}
		
		$("#configuration-status").text(msg);
		$("#configuration-status").show();
		$("#configuration-status").fadeOut(2000);
	}
	
	$scope.updateMap = function(){
		$scope.rasterUiLayers.forEach(function(layer){

			var mapLayers = map.getLayers().getArray();
			for(i=0; i<mapLayers.length; i++){
				if (mapLayers[i] == layer.olLayer){
					return;
				}
			}
			
			map.addLayer(layer.olLayer);
			layer.olLayer.setVisible(layer.display);

			if ($scope.validuiLayers.find(function(e){ return e == layer}) === undefined){
				$scope.validuiLayers.push(layer);
			}
		});
		
		$scope.uiLayers.forEach(function (layer){
			if (layer.olLayer === undefined){
				var vectorSource = new ol.source.Vector(); 
				var ollayer = createVectorLayer(layer.nameValue, vectorSource, styles[layer.styleName]);
				layer.olLayer = ollayer;
				map.addLayer(layer.olLayer);
			}
			
			//assumes the data in the layer object is valid
			if (layer.changed ){
				var olLayer = layer.olLayer;
				getVectorSource(layer.sourceValue, olLayer.getSource());
				
				olLayer.setVisible(layer.display);
				olLayer.setStyle(styles[layer.styleName]);
				
				layer.changed = false;
			}
			
			if ($scope.validuiLayers.find(function(e){ return e == layer}) === undefined){
				$scope.validuiLayers.push(layer);
			}
		});
	}
	
	$scope.toggleLayerVisibility = function(uiLayer){
		uiLayer.olLayer.setVisible(uiLayer.display);
	}

	$scope.searchAndHighlight = function(codeLine, rang, startPoint, endPoint){

		if (codeLine == "" 
			|| rang == "" 
			|| startPoint == ""){
				alert("One of the fields is empty");
				return;
			}

		var tilDataStore = $scope.getTilDataSource();
		highlight(search(tilDataStore, codeLine, startPoint, endPoint))
		$scope.updateLeftPanel({title: "Search Result", 
			items: ["Line: " + codeLine, "StartPoint: " + startPoint, " EndPoint: " + endPoint]});
	}

	$scope.getTilDataSource = function(){
		return $scope.validuiLayers.find(function(layer){
			return layer.nameValue == "LineSegment";
		}).olLayer.getSource();
	}
	
	$scope.getAvailableStyles = function(){
		return Object.keys(styles);
	}
	
	angular.element(document).ready(function(){
		
		jqueryUiInit();
		
		mapInit();
		
		ngOapsScope = angular.element('[ng-controller=mainCtrl]').scope();
		
		// Calque des TILs, par défaut
		var tillayer = {label: "Calque 1",
						type: "vector",
			     	   idNameInput: "layer1", 
			     	   nameValue: "LineSegment",
			     	   idSourceInput: "layer1source", 
			     	   sourceValue: "http://localhost:8080/OWS?service=WFS&version=1.1.0&request=GetFeature&typeName=oaps:GLineSegment&outputFormat=text/json",
						idStyleName: "layer1styleName",
						styleName: "blue",
			     	   changed: true,
			     	   readonly: true,
			     	   display: true,
			     	   olLayer: undefined,
     	   				}

		var osmLayer = {
				nameValue: "OpenStreetMap",
				type: "raster",
				olLayer: new ol.layer.Tile({
							source : new ol.source.OSM()
						}),
				display: true
		}
		var mapQuestLayer = {
				nameValue: "MapQuest Satellite",
				type: "raster",
				olLayer: new ol.layer.Tile({
					source : new ol.source.MapQuest({layer: "sat"})
				}),
				display: false
		}
		
		$scope.rasterUiLayers.push(osmLayer);
		$scope.rasterUiLayers.push(mapQuestLayer);
		
		$scope.uiLayers.push(tillayer);
		
		$scope.updateMap();

		$scope.$apply();
		
		console.log("Initialisation complete");
	});
	
});

function jqueryUiInit(){

	$("#toggleConfigButton").click(function(){
		toggleConfigPanel();
	});

	$("#closeConfigButton").click(function(){
		toggleConfigPanel();
	});
	
	$("#leftPanelCloseBtn").click(function(){
		$("#leftpanel").fadeToggle(500);
	});
	
	$("#rightPanelCloseBtn").click(function(){
		$("#rightpanel").fadeToggle(500);
	});

	$("#layerButton").click(function(){
		$("#rightpanel").fadeToggle(500);
	});
}

function toggleConfigPanel(){
	$("#configuration").toggle(500, "swing");
	$("#configuration-status").hide();
}


function createVectorLayer(layerId, layerSource, style){
	return new ol.layer.Vector({
		id : layerId,
		source : layerSource,
		style : style
	});
}

function getVectorSource(sourceValue, vectorSource){
	return fetch(sourceValue)
		.then(function(resp){ return resp.json(); })
		.then(function(geoJson) { 
			var features = new ol.format.GeoJSON().readFeatures(geoJson);
			vectorSource.addFeatures(features);
		});
}

function search(tilSource, codeLine, pkD, pkF){
	var features = tilSource.getFeatures();
	return features.filter(function(feature){
		code = feature.get("codeLine");
		startpoint = Number.parseInt(feature.get("startPoint"));
		endpoint = Number.parseInt(feature.get("endPoint"));
		return (code == codeLine && startpoint >= Number.parseInt(pkD) && endpoint <= Number.parseInt(pkF));
	});
}

function highlight(features){
	for (i=0; i<features.length; i++){
		selectInteraction.getFeatures().push(features[i])
	}
	tempSource = new ol.source.Vector({features: features});
	map.getView().fit(tempSource.getExtent(), (map.getSize()))
}

function displayFeatureInfo(feature, layer){
	if (feature === undefined){
		return;
	}
	
	properties = ["Geometry : " + feature.getGeometry().getType()]
	
	var keys = feature.getKeys();
	for(i=0; i<keys.length; i++){
		if (keys[i] == "geometry"){
			continue;
		}
		var value = feature.get(keys[i]);
		properties.push(keys[i] + " : " + value);
	}
	
	info = {title: layer.get('id'), 
			body: "", 
			items: properties}
	scope = angular.element('[ng-controller=mainCtrl]').scope();
	scope.updateLeftPanel(info);
	scope.$apply();
}

function mapInit() {
	var osmlayer = new ol.layer.Tile({
		source : new ol.source.OSM()
	});

	map = new ol.Map({
		layers : [],
		target : document.getElementById('map'),
		renderer : 'canvas',
		view : new ol.View({
			projection : 'EPSG:2154',
			center : centerParis,
			zoom : 4
		})
	});
	
	selectInteraction = new ol.interaction.Select({
		condition: ol.events.condition.singleClick,
		toggleCondition: ol.events.condition.shiftKeyOnly,
		layers: function (layer) {
			return true;
		},
		style: styles.select
	});
	map.getInteractions().extend([selectInteraction]);

	map.on('click', function(event){
		var aFeature; 
		var aLayer;
		map.forEachFeatureAtPixel(event.pixel, function(feature, layer){
			// display information on only one (feature,layer) pair
			aFeature = feature;
			aLayer = layer;
		});
		displayFeatureInfo(aFeature, aLayer);
	});
}

