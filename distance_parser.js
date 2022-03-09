const csv = require("csvtojson");

function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
function getDistanceFromLatLonInMeter(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d * 1000;
  }


class DistanceParser {

    #carsData = [];
    #filename = "";

    constructor (filename){
        this.#filename = filename;
    }

    async loadFile() {
        this.#carsData = await csv().fromFile(this.#filename);
    }

    // get vid list
    #getUniqueVid() {
        const uniqueVid = []

        for (const row of this.#carsData) {
            if (!uniqueVid.includes(row.vehicle_id)) {
                uniqueVid.push(row.vehicle_id);
            }
        }
        
        return uniqueVid;
    }

    // for each vid, get all data for that vid
    #getDataForVehicle(id) {
        return this.#carsData.filter((car) => car.vehicle_id === id);
    }


    // process data
    #processDistancePerVehicle(vehicleData) {
        const output = [{
            vehicle_id: vehicleData[0].vehicle_id,
            row_id: vehicleData[0].row_id,
            latitude: vehicleData[0].latitude,
            longitude: vehicleData[0].longitude,
            distance: 0
        }];
        output[0].distance = 0;

        for (let i = 0; i < vehicleData.length - 1; i++) {
            output.push({
                vehicle_id: vehicleData[i+1].vehicle_id,
                row_id: vehicleData[i+1].row_id,
                latitude: vehicleData[i+1].latitude,
                longitude: vehicleData[i+1].longitude,
                distance: getDistanceFromLatLonInMeter(vehicleData[i].latitude, vehicleData[i].longitude, vehicleData[i+1].latitude, vehicleData[i+1].longitude)
            })
        }

        return output;
    }

    processAndAddDistance() {
        const processedVehicleData = []
        const uniqueVid = this.#getUniqueVid();
        for (const id of uniqueVid) {
            const currentVeichleData = this.#getDataForVehicle(id);

            const output = this.#processDistancePerVehicle(currentVeichleData);
            processedVehicleData.push(...output);
        }

        return processedVehicleData;
    }
}


module.exports = DistanceParser;