// db connection
var db = require('./db');


module.exports = function(app) {

  // Express routing for GET search requests.
  app.get('/search', function (req, res) {

    // Getting passed params and initialize it to variables. Assuming all parameters are always passed.
    let params = req.query;

    let searchTerm = params['searchTerm'];
    let lat = params['lat'];
    let lng = params['lng'];

    // I defined a radius of 111km for every search so that it doesn't return results in the entire world.
    // 111km is ~1 degree in lat/lng. Wouldn't make a big difference for the database given.
    // Radius would probably be a user defined parameter. 
    let sql = `SELECT item_name, lat, lng, item_url, img_urls
    FROM items
    WHERE item_name LIKE '%`+searchTerm+`%'
    AND ABS(lat - `+lat+`) < 1
    AND ABS(lng - `+lng+`) < 1`;


    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }

      // Adding distance variable for each returned result. Works fine with amount of data given.
      // With a bigger amount of data (1M+), would probably do a KNN (K-nearest neighbor) approach.
      for (let i = 0; i < rows.length; i++) {
        rows[i]['distance'] = distance(lat, lng, rows[i].lat, rows[i].lng);
      }

      //Sorting with function parameter and getting first 20.
      rows = rows.sort(compare).slice(0,20);

      res.send(rows);
    });
  });

    //other routes..
}


// 'Great Circle Distance' - Could probably use Google's API (Distance Matrix) for this in a real world scenario?
// Code found in https://www.movable-type.co.uk/scripts/latlong.html. Modified a bit.
function distance(lat1, lon1, lat2, lon2) {

    var R = 6371; // Radius of earth in Km
    var dLat = toRad(lat2-lat1);

    var dLon = toRad((lon2-lon1));

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d;
}

 // Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

// Compare helper used in .sort()
function compare(a,b) {
  if (a.distance < b.distance)
     return -1;
  if (a.distance > b.distance)
    return 1;
  return 0;
}
