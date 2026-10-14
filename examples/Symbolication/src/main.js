import Countbase from "countbase-sdk-web";

const COUNTBASE_SERVER_KEY = "https://your.server.ly";
const COUNTBASE_APP_KEY = "YOUR_APP_KEY";

if (COUNTBASE_APP_KEY === "YOUR_APP_KEY" || COUNTBASE_SERVER_KEY === "https://your.server.ly") {
  console.warn("Please do not use default set of app key and server url")
}
// initializing countbase with params
Countbase.init({
  app_key: COUNTBASE_APP_KEY,
  url: COUNTBASE_SERVER_KEY, //your server goes here
  app_version: "1.0",
  debug: true
});

//track sessions automatically
Countbase.track_sessions();

//track pageviews automatically
Countbase.track_pageview();

//track any clicks to webpages automatically
Countbase.track_clicks();

//track link clicks automatically
Countbase.track_links();

//track form submissions automatically
Countbase.track_forms();

//track javascript errors
Countbase.track_errors();

//let's cause some errors
function cause_error() {
  undefined_function();
}

window.onload = function () {
  document.getElementById("handled_error").onclick = function handled_error() {
    Countbase.add_log('Pressed handled button');
    try {
      cause_error();
    } catch (err) {
      Countbase.log_error(err)
    }
  };

  document.getElementById("unhandled_error").onclick = function unhandled_error() {
    Countbase.add_log('Pressed unhandled button');
    cause_error();
  };
}
