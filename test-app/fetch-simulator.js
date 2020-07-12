const
    config = require("./config"),
    util = require("./utilities"),
    http = require("http");


const fetchOptions = {
    host: config.HOST,
    port: config.PORT,
    path: config.FETCH_URL + "?count=" + config.FETCH_COUNT,
    method: "GET",
};

function startFetching() {
    setInterval(setTimeout, 2000, fetchMessages, util.randInt(1, 100) * 100);
}

function fetchMessages() {
    const request = http.request(fetchOptions, (response) => {
        let responseString = "";

        response.on("error", (err) => {
            console.error(err);
        }).on("data", function (data) {
            responseString += data;
        }).on("end", function () {
            if (response.statusCode === 200) {
                const obj = JSON.parse(responseString);
                Object.keys(obj).forEach((key) => {
                    jobQueueGlobal.push(obj[key].id);
                    console.log("Fetched message: " + JSON.stringify(obj[key]));

                })
            }
        });
    });
    request.end();
}

module.exports = startFetching;