class MapCtrl {
    constructor($scope, $state, MapService, uiGmapIsReady){
        this.loading = false;
        this.yearStart;
        this.monthStart = '-';;
        this.dayStart;
        this.yearEnd;
        this.monthEnd = '-';;
        this.dayEnd;
        this.$scope = $scope;
        this.color = '-';
        this.dataSetSize;
        this.subSetSize;

        MapService.zoom = 12;
        MapService.center = { latitude: 40.719669, longitude: -74.000529 };


        MapService.style = [
            {
                featureType: "all",
                stylers: [
                    { saturation: -80 }
                ]
            },
            {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                    { hue: "#00ffee" },
                    { saturation: 50 }
                ]
            },
            {
                featureType: "poi.business",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];

        this.mapService = MapService;

        uiGmapIsReady.promise(1).then((inst) => {
            this.mapService = MapService;

            MapService.api.event.addListener(
                this.mapService.dm.getDrawingManager(),
                'polygoncomplete',
                (polygon) => {

                    console.log(this.mapService.dm);

                    var coordinates = polygon.getPath().getArray();
                    this.mapService.setCurrentPoly(coordinates);

                }
            );

            this.mapService.webGLLayer = new MapService.webGl(this.mapService.mapControl.getGMap());
            //this.mapService.strTree = new MapService.jsts.index.strtree.STRtree();

            this.mapService.webGLLayer.onAddFeature = (feature) => {
                //let reader = new MapService.jsts.io.GeoJSONReader();
//                let feat = reader.read(feature);

                this.mapService.features.push(feature);

                //this.mapService.strTree.insert(feat.geometry.getEnvelopeInternal(), feat);

            };

            this.mapService.webGLLayer.setDefaultPointColor([ 0.0,  0.0,  1.0,  1.0 ]);

            //TEST data;
            //this.mapService.webGLLayer.loadGeoJson("//raw.githubusercontent.com/dwillis/nyc-maps/master/boroughs.geojson");
            this.mapService.webGLLayer.start();
        });

    }

    get center(){
        return this.mapService.center;
    }

    set center(c){
        this.mapService.center = c;
    }

    get opts(){
        return this.mapService.opts;
    }

    set opts(o){
        this.mapService.opts = o;
    }

    get zoom(){
        return this.mapService.zoom;
    }

    set zoom(z){
        this.mapService.zoom = z;
    }

    loadRideData(){
        this.loading = true;
        var self = this;
        this.mapService.loadRideGeoJson(
            () => {

                this.mapService.cf.add(this.mapService.features);
                this.$scope.$apply(() => {
                    this.loading = false;
                    this.dataSetSize = this.mapService.cf.size();
                });

                console.log("call back after data is added");
                console.log('crossfilter size', this.mapService.cf.size());
                console.log("stuff stuff");
            }
        );
    }

    filterByMonth(){
        let s = new Date(this.yearStart, this.monthStart, this.dayStart);
        let e = new Date(this.yearEnd, this.monthEnd, this.dayEnd);

        console.log('start', s);
        console.log('end', e);

       this.subSetSize = this.mapService.filterRides(s, e, this.color);
    }

//    clearMap(){
//        this.mapService.clearCanvas();
//    }


}

MapCtrl.$inject = ['$scope', '$state', 'MapService', 'uiGmapIsReady'];

export { MapCtrl };
