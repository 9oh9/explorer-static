import _ from 'lodash';
import { Point, Polygon } from 'src/components/features'
import 'es6-collections';
//import jsts from 'nineohnine/jsts';
import crossfilter from 'crossfilter';

function strToDate(str, tz) {
    var l = str.split(/[\-:\s]/);

    var d = new Date(
        parseInt(l[0]),
        parseInt(l[1] - 1),
        parseInt(l[2]),
        parseInt(l[3]),
        parseInt(l[4]),
        parseInt(0)
    );

    if(tz){
        var miliOff = d.getTimezoneOffset() * 60000;
        var dMili = d.getTime() - (miliOff);
        d = new Date(dMili);
    }

    return d;
}


class MapService {

    constructor($http){
        this.features = [];
        this.strTree;
//        this.jsts = jsts;
        this.cf = crossfilter();

        this.monthDimension = this.cf.dimension((d) => {
            return strToDate(d.properties.time, true);
        });

        this.baseURI = 'http://api.uber.nineohnine.io/rides/1/';
        this.$http = $http;
        this.mapControl = {};
        this.webGl = WebGLLayer;
        this.webGLLayer;
        this.currentPoly;
        this.api;
        this.gmap;
        this.uuid;
        this.mapInstNum;
        this.opts = {};
        this.zoom;
        this.center;
        this.dm = {};
        this.dmOpts;
        this.colors = [
            [0.0,  1.0,  0.0,  1.0],
            [1.0,  0.0,  0.0,  1.0]
        ];

    }

    set style(styleObj){
        this.opts['styles'] = styleObj;
    }

    get style(){
        return this.opts['style'];
    }

    setCurrentPoly(coordArr){

        this.currentPoly = new Polygon(coordArr);
    }

    loadRideGeoJson(cb){

        this.webGLLayer.loadGeoJson(this.baseURI + this.currentPoly.toString(), cb);

        this.webGLLayer.start();


//        this.$http({
//            method: 'GET',
//            url: this.baseURI + this.currentPoly.toString()
//        }).then((response) => {
//            this.webGLLayer.loadGeoJson(response);
//            this.webGLLayer.start();
//        }, (response) => {
//
//            console.log("ERROR GETTING RIDE DATA");
//
//        });

    }

    filterRides(s, e, c){

        let data = this.monthDimension.filter([s, e]);
        console.log('subset', this.cf.groupAll().reduceCount().value());
        console.log('subset data', this.monthDimension.top(this.cf.groupAll().reduceCount().value()));
        data = this.monthDimension.top(this.cf.groupAll().reduceCount().value());

        for(var i = 0; i < data.length; i++){
            this.webGLLayer.changePointColor(data[i].properties.index, this.colors[c]);
        }

        return this.cf.groupAll().reduceCount().value();
    }

//    clearCanvas(){
//        let ctx = this.webGLLayer.canvasLayer_.canvas.getContext('2d');
//        ctx.clearRect(
//            0,
//            0,
//            this.webGLLayer.canvasLayer_.canvas.width,
//            this.webGLLayer.canvasLayer_.canvas.width
//        );
//
//    }

}

MapService.$inject = ['$http'];

export { MapService };
