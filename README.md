# Fat Llama Backend Challenge
## Running it locally
For this challenge, I chose to use node.js as the main framework. To run it locally, make sure you have [Node.js](http://nodejs.org/) installed.
```sh
cd gus-fl-backend
npm install
npm start
```
The server is configured to run on port `3000`. To test it, simply send a `GET` HTTP request to `http://localhost:3000/search` with the parameters (`searchTerm`, `lat` and `lng`) and you should get an array with the result objects inside (I used Postman to send test requests).

## Approach
First of all, after reading the project description, I decided to move forward with Node.js not only because it was the framework I had most experience with, but also because there was no need to implement any user interface. Using Express with Node.js is a good combination for processing simple HTTP requests and sending back responses.

Secondly, looking at the database provided, I realized that the SQL query would only need to accomplish the string matching algorithm (with the `LIKE` operator) and the distance math I would do manually later. I also took the liberty of limiting the radius to 1 rad (111km), so that it only returns objects inside that range - this would probably be a user-defined range. The final SQL query looks like this:

```sh
SELECT item_name, lat, lng, item_url, img_urls
    FROM items
    WHERE item_name LIKE '%`+searchTerm+`%'
    AND ABS(lat - `+lat+`) < 1
    AND ABS(lng - `+lng+`) < 1
```

After getting all the results from the database, the algorithm then calculates the distance from the user's given `lat` and `lng` to each of the listing location and appends it to the object. Here, I decided to do it in linear time (`O(n)`) because of the small input given - will show performance testing later. With a larger amount of data (100k+), a KNN (K-nearest neighbor) approach would be more beneficial. In this case, I calculated the distance using the 'Great Circle Distance' formula.

Finally, the algorithm sorts the data based on the distance calculated and then sends the sorted array back and closes the connection.

## Performance
Here is a screenshot of a performance test.

![Alt text](./PerformanceTest.png?raw=true "Performance Test")

As seen above, the algorithm created supports around 405 requests/second, which is an acceptable number for its simplicity. It can be significantly improved, mainly by using a more efficient approach to calculate the closest items.


## Checklist for Challenge
- [x] Duplicate this repo (please do not fork it, see [instructions](https://help.github.com/articles/duplicating-a-repository/)). Bitbucket offers free private repos if you don't want to use a public one. Please do not name your repo 'fat llama' or anything similar (we don't want future candidates copying your code).
- [x] Build API endpoint for Fat Llama search with according to above specifications
- [x] Ensure all code is sufficiently tested
- [x] Write brief summary on the approach you took and the tools you used (max 500 words)
- [x] Include instructions on how to build/ run your solution
- [x] Send us a link to your new repo.
