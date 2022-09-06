
const ROUTE = "http://localhost:3000/"

function sendReq(method, dir) {
    return new Promise((resolve, reject) => {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function() {
            if (httpRequest.status === 200) {
                resolve(httpRequest.responseText);
            }
            else {
                reject(Error("Data didn't load successfully, error code:"+ httpRequest.statusText));
            }
            httpRequest.onerror = function () {
                reject(Error("Network error"))
            };
        }
        httpRequest.open(method,ROUTE+dir);
        httpRequest.send();
    })
}