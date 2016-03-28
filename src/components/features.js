import _ from 'lodash';

class Point {
    constructor(lng, lat){
        this.lat = lat;
        this.lng = lng;
    }

    toString(){
        return this.lng + '_' + this.lat
    }
}

class Polygon {
    constructor(points){
        this.boundaries = [];

         _(points).forEach((item) => {
            this.boundaries.push(new Point(item.lng(), item.lat()));
        });

        this.boundaries.push(this.boundaries[0]);
    }

    toString(){
        let polyStr = [];
        _(this.boundaries).forEach((point) => {
            polyStr.push(point.toString());
        });

        return '@' + _.join(polyStr);
    }

}

export { Point, Polygon };
