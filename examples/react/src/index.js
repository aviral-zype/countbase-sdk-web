import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App-WithEffect';
import * as serviceWorker from './serviceWorker';
import Countbase from 'countbase-sdk-web';

//Exposing Countbase to the DOM as a global variable
//Usecase - Heatmaps
window.Countbase = Countbase;

const COUNTBASE_SERVER_KEY = "https://your.server.ly";
const COUNTBASE_APP_KEY = "YOUR_APP_KEY";

if (COUNTBASE_APP_KEY === "YOUR_APP_KEY" || COUNTBASE_SERVER_KEY === "https://your.server.ly") {
  console.warn("Please do not use default set of app key and server url")
}
// initializing countbase with params
Countbase.init({
  app_key: COUNTBASE_APP_KEY,
  url: COUNTBASE_SERVER_KEY, //your server goes here
  debug: true
});

Countbase.q.push(['track_sessions']);
Countbase.q.push(['track_scrolls']);
Countbase.q.push(['track_clicks']);
Countbase.q.push(['track_links']);
Countbase.q.push(["track_errors"]);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
