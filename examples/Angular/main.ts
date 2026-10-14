import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import Countbase from 'countbase-sdk-web';

window.Countbase = Countbase;

const COUNTBASE_SERVER_KEY = "https://your.server.ly";
const COUNTBASE_APP_KEY = "YOUR_APP_KEY";

if (COUNTBASE_APP_KEY === "YOUR_APP_KEY" || COUNTBASE_SERVER_KEY === "https://your.server.ly") {
  console.warn("Please do not use default set of app key and server url")
}
// initializing countbase with params
Countbase.init({
  app_key: COUNTBASE_APP_KEY,
  url: COUNTBASE_SERVER_KEY,
  debug: true
});

// Automatic tracking
Countbase.track_sessions();
Countbase.track_clicks();
Countbase.track_links();
Countbase.track_forms();
Countbase.track_errors();
Countbase.track_scrolls();
Countbase.track_pageview();

// Showing a feedback widget
Countbase.get_available_feedback_widgets(function (widgets, err) {
  console.log('Available feedback widgets:', widgets);
  if (widgets && widgets.length) {
    console.log('Presenting feedback widget:', widgets[0]);
    Countbase.present_feedback_widget(widgets[0]); // Show the first widget
  }
});

// Reporting a feedback widget's result manually
Countbase.get_available_feedback_widgets(function (widgets, err) {
  console.log('Available feedback widgets:', widgets);
  if (widgets && widgets.length) {
    console.log('Reporting feedback widget:', widgets[0]);
    Countbase.getFeedbackWidgetData(widgets[0], function (data, err) {
      console.log('Feedback widget data:', data);
      Countbase.reportFeedbackWidgetManually(widgets[0], data, null); // Report the first widget's data as null
    });
  }
});

// add a custom event
Countbase.add_event({
  key: "test",
  count: 1,
  dur: 50,
  sum: 0.99,
  segmentation: {
    "Country": "Germany",
    "Age": "28"
  }
});

// send some user properties
Countbase.user_details({
  name: "John Doe",
  username: "johndoe",
  organization: "Countbase",
  phone: "1234567890",
  picture: "https://path.to/picture",
});

// set custom user property
Countbase.userData.set("key", "value");
Countbase.userData.save();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
