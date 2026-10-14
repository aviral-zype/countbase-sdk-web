importScripts("../../lib/countbase.js");

const COUNTBASE_SERVER_KEY = "https://your.server.ly";
const COUNTBASE_APP_KEY = "YOUR_APP_KEY";

if(COUNTBASE_APP_KEY === "YOUR_APP_KEY" || COUNTBASE_SERVER_KEY === "https://your.server.ly"){
    console.warn("Please do not use default set of app key and server url")
}
// initializing countbase with params
Countbase.init({
    app_key: COUNTBASE_APP_KEY,
    url: COUNTBASE_SERVER_KEY, //your server goes here
    debug: true,
    test_mode: true
});

onmessage = function(e) {
    console.log(`Worker: Message received from main script:[${JSON.stringify(e.data)}]`);
    const data = e.data.data; const type = e.data.type;
    if (type === "event") {
        Countbase.add_event(data);
    } else if (type === "view") {
        Countbase.track_pageview(data);
    } else if (type === "session") {
        if (data === "begin_session") {
            Countbase.begin_session();
            return;
        }
        Countbase.end_session(null, true);
    } else if (type === "get") {
        const queues = Countbase._internals.getLocalQueues();
        postMessage(queues);
    }
};