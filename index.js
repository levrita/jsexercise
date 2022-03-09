const DistanceParser = require("./distance_parser");

(async () => {
    const distanceParser = new DistanceParser("coordinates_for_node_test.csv"); 
    await distanceParser.loadFile();
    const dataWithDistance = distanceParser.processAndAddDistance()

    console.log(dataWithDistance);

})();