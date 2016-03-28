import angular from 'angular';
import 'angular-ui-router';
import 'angular-google-maps';
import _ from 'lodash';
import { nemLogging } from 'angular-simple-logger';
import 'restangular';
import { MapCtrl } from 'src/components/controllers';
import { MapService } from 'src/components/services';

angular.module('uber', [
        'ui.router',
        'uiGmapgoogle-maps',
        'restangular'
    ])
    .config([
        '$stateProvider',
        '$locationProvider',
        'uiGmapGoogleMapApiProvider',
        'RestangularProvider',
        (
            $stateProvider,
            $locationProvider,
            uiGmapGoogleMapApiProvider,
            RestangularProvider
        ) => {

            RestangularProvider.setBaseUrl('http://10.0.0.80/api');

            $stateProvider.state('map', {
                url: '/',
                controller: 'MapCtrl as m',
                templateUrl: '/templates/map.html'
            })

            $locationProvider.html5Mode({
                enabled: true,
                rewriteLinks: false
            });

            $locationProvider.hashPrefix('!');

//            uiGmapGoogleMapApiProvider.configure({
//                v: 3.23,
//                key: 'AIzaSyBand580Qi8cYFUdBgw1yHIzQm647mkOWU',
//                libraries: 'geometry,visualization,drawing'
//            });
        }])
    .run(['uiGmapIsReady', 'MapService', 'uiGmapGoogleMapApi',
            (uiGmapIsReady, MapService, uiGmapGoogleMapApi) => {

        uiGmapIsReady.promise(1).then((inst) => {

            MapService.gmap = inst.map;
            MapService.uuid = inst.uiGmap_id;
            MapService.mapInstNum = inst.instance;

        });

        uiGmapGoogleMapApi.then((maps) => {

            google.maps = maps;
            MapService.api = maps;

            MapService.dmOpts = {
                drawingMode: MapService.api.drawing.OverlayType.POLYGON,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: MapService.api.ControlPosition.TOP_CENTER,
                        drawingModes: [
                            MapService.api.drawing.OverlayType.POLYGON
                        ]
                    },
                    polygonOptions: {
                        fillColor: '#A6DAEC',
                        fillOpacity: .6,
                        strokeColor:'#4DB5D9',
                        fillOpacity: .3
                    }
            }


        });

    }])
    .controller('MapCtrl', MapCtrl)
    .service('MapService', MapService);
