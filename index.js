const fs = require("fs");
const { Parser } = require("json2csv");
const DistanceParser = require("./distance_parser");

(async () => {
    const distanceParser = new DistanceParser("coordinates_for_node_test.csv"); 
    await distanceParser.loadFile();
    const dataWithDistance = distanceParser.processAndAddDistance()

    const carsInCsv = new Parser({ fields: ["vehicle_id", "row_id", "latitude", "longitude", "distance"] }).parse(dataWithDistance);
    fs.writeFileSync("./output/with_distance.csv", carsInCsv);
})();