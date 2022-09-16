
const ROUTE = "http://localhost:3000/"

function sendReq(method, dir, body) {
    return new Promise((resolve, reject) => {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function() {
            if (httpRequest.status === 200) {
                resolve(httpRequest.response);
            }
            else {
                reject(Error("Data didn't load successfully, error code: "+ httpRequest.status + ", reason: " + httpRequest.responseText));
            }
            httpRequest.onerror = function () {
                reject(Error("Network error"))
            };
        }
        httpRequest.open(method,ROUTE+dir);
        if (body) httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(body);
    })
}