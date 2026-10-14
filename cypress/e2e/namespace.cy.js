/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable require-jsdoc */
var Countbase = require("../../lib/countbase");
var hp = require("../support/helper");

const c1 = ['sessions', 'events', 'views', 'users', 'scrolls', 'clicks'];
const c2 = ['events', 'users', 'location'];

describe("-", () => {
    it("-", () => {
        hp.haltAndClearStorage(() => {
            Countbase.init({
                app_key: "YOUR_APP_KEY1",
                url: "https://your.domain.count.ly",
                namespace: "namespace1",
                clear_stored_id: true,
                device_id: "test-device-id1",
                require_consent: true,
                enable_orientation_tracking: false,
            });
            Countbase.add_consent(c1);
            Countbase.user_details({organization: "Test Organization1", custom: {"Test User1": "Test User1"}});
            Countbase.track_sessions();
            Countbase.track_pageview();
            Countbase.track_clicks();
            Countbase.track_scrolls();
            Countbase.add_event({
                key: "test_event1",
                count: 1,
                segmentation: {test: "test1"},
            });

            Countbase.q.push(["init", {
                app_key: "YOUR_APP_KEY2", //must have different APP key
                url: "https://your.domain.count.ly",
                namespace: "namespace2",
                clear_stored_id: true,
                device_id: "test-device-id2",
                require_consent: true,
                enable_orientation_tracking: false,
            }])
            Countbase.q.push(["YOUR_APP_KEY2", "add_consent", c2]);
            Countbase.q.push(["YOUR_APP_KEY2", "user_details", {organization: "Test Organization2", custom: {"Test User2": "Test User2"}}]);
            Countbase.q.push(["YOUR_APP_KEY2", "track_sessions"]);
            Countbase.q.push(["YOUR_APP_KEY2", "track_pageview", undefined, undefined, {test: "test2"}]);
            Countbase.q.push(["YOUR_APP_KEY2", "track_clicks"]);
            Countbase.q.push(["YOUR_APP_KEY2", "track_scrolls"]); 
            Countbase.q.push(["YOUR_APP_KEY2", "add_event", {
                key: "test_event2",
                count: 1,
                segmentation: {test: "test2"},
            }]);

            cy.wait(1000).then(() => {
                var queues = Countbase._internals.getLocalQueues();
                var requests = Countbase._internals.testingGetRequests();
                cy.log(queues);
                cy.log(requests);
            });
        });
    });
});