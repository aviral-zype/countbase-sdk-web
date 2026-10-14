importScripts("../lib/countbase.js");

const STORE={}; // in-memory storage for worker

const COUNTBASE_SERVER_KEY = "https://your.server.ly";
const COUNTBASE_APP_KEY = "YOUR_APP_KEY";

if(COUNTBASE_APP_KEY === "YOUR_APP_KEY" || COUNTBASE_SERVER_KEY === "https://your.server.ly"){
    console.warn("Please do not use default set of app key and server url")
}

Countbase.init({
    app_key: COUNTBASE_APP_KEY,
    url: COUNTBASE_SERVER_KEY,
    debug: true,
    clear_stored_id: true, // Resets the stored device ID on init
    storage: {
        getItem: function (key) {
            return STORE[key];
        },
        setItem: function (key, value) {
            STORE[key] = value;
        },
        removeItem: function (key) {
            delete STORE[key];
        }
    }
});

onmessage = function (e) {
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
    }
}