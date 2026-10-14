/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable require-jsdoc */
var Countbase = require("../../lib/countbase");
var hp = require("../support/helper");

Countbase.q = Countbase.q || [];

function initMain() {
    Countbase.init({
        app_key: "YOUR_APP_KEY",
        url: "https://your.domain.count.ly",
        test_mode_eq: true,
        test_mode: true
    });
}

const userDetailObj = hp.userDetailObj;

// an event object to use 
const eventObj = {
    key: "in_app_purchase",
    count: 3,
    sum: 2.97,
    dur: 300,
    segmentation: {
        app_version: "1.0",
        country: "Tahiti"
    }
};
const custUP = {
    custom: { "name": "John Doe"}
}

describe("User properties order test", () => {
    it("User details order test", () => {
        hp.haltAndClearStorage(() => {
            initMain();
            Countbase.begin_session();
            Countbase.add_event(eventObj);
            Countbase.user_details(userDetailObj);
            Countbase.add_event(eventObj);
            Countbase.add_event(eventObj);
            Countbase.user_details(userDetailObj);
            cy.fetch_local_event_queue().then((eq) => {
                expect(eq.length).to.equal(0);
            });
            cy.wait(500).then(() => {
            cy.fetch_local_request_queue(hp.appKey).then((rq) => {
                expect(rq.length).to.equal(5);
                cy.log(rq);
                cy.check_session(rq[0]);
                cy.check_event(JSON.parse(rq[1].events)[1], eventObj, undefined, false);
                cy.check_user_details(rq[2], userDetailObj);
                cy.check_event(JSON.parse(rq[3].events)[0], eventObj, undefined, false);
                cy.check_event(JSON.parse(rq[3].events)[1], eventObj, undefined, false);
                cy.check_user_details(rq[4], userDetailObj);
            });
        });
        });
    });
    it("User details order test, async", () => {
        hp.haltAndClearStorage(() => {
            initMain();
            Countbase.q.push(['track_sessions']);
            Countbase.q.push(['add_event', eventObj]);
            Countbase.q.push(['user_details', userDetailObj]);
            Countbase.q.push(['add_event', eventObj]);
            Countbase.q.push(['add_event', eventObj]);
            Countbase.q.push(['user_details', userDetailObj]);
            cy.fetch_local_event_queue().then((eq) => {
                expect(eq.length).to.equal(0);
            });
            cy.wait(500).then(() => {
                cy.fetch_local_request_queue(hp.appKey).then((rq) => {
                    expect(rq.length).to.equal(5);
                    cy.log(rq);
                    cy.check_session(rq[0]);
                    cy.check_event(JSON.parse(rq[1].events)[1], eventObj, undefined, false);
                    cy.check_user_details(rq[2], userDetailObj);
                    cy.check_event(JSON.parse(rq[3].events)[0], eventObj, undefined, false);
                    cy.check_event(JSON.parse(rq[3].events)[1], eventObj, undefined, false);
                    cy.check_user_details(rq[4], userDetailObj);
                });
            });
        });
    });
    it("User data order test", () => {
        hp.haltAndClearStorage(() => {
            initMain();
            Countbase.userData.set("name", "John Doe");
            Countbase.begin_session();
            Countbase.userData.set("name", "John Doe");
            Countbase.add_event(eventObj);
            Countbase.userData.set("name", "John Doe");
            Countbase.user_details(userDetailObj);
            cy.fetch_local_event_queue().then((eq) => {
                expect(eq.length).to.equal(0);
            });
            cy.wait(500).then(() => {
                cy.fetch_local_request_queue(hp.appKey).then((rq) => {
                    expect(rq.length).to.equal(6);
                    cy.log(rq);
                    cy.check_user_details(rq[0], custUP);
                    cy.check_session(rq[1]);
                    cy.check_user_details(rq[2], custUP);
                    cy.check_event(JSON.parse(rq[3].events)[1], eventObj, undefined, false);
                    cy.check_user_details(rq[4], custUP);
                    cy.check_user_details(rq[5], userDetailObj);
                });
            });
        });
    });
    it("User data order test, async", () => {
        hp.haltAndClearStorage(() => {
            initMain();
            Countbase.q.push(['userData.set', "name", "John Doe"]);
            Countbase.q.push(['track_sessions']);
            Countbase.q.push(['userData.set', "name", "John Doe"]);
            Countbase.q.push(['add_event', eventObj]);
            Countbase.q.push(['userData.set', "name", "John Doe"]);
            Countbase.q.push(['user_details', userDetailObj]);
            cy.fetch_local_event_queue().then((eq) => {
                expect(eq.length).to.equal(0);
            });
            cy.wait(500).then(() => {
                cy.fetch_local_request_queue(hp.appKey).then((rq) => {
                    expect(rq.length).to.equal(6);
                    cy.log(rq);
                    cy.check_user_details(rq[0], custUP);
                    cy.check_session(rq[1]);
                    cy.check_user_details(rq[2], custUP);
                    cy.check_event(JSON.parse(rq[3].events)[1], eventObj, undefined, false);
                    cy.check_user_details(rq[4], custUP);
                    cy.check_user_details(rq[5], userDetailObj);
                });
            });
        });
    });
});
