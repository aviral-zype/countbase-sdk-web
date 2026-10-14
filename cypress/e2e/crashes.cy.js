/* eslint-disable require-jsdoc */
var Countbase = require("../../lib/countbase");
var hp = require("../support/helper");

function initMain() {
    Countbase.init({
        app_key: "YOUR_APP_KEY",
        url: "https://your.domain.count.ly",
        test_mode: true
    });
}

function cause_error() {
    // eslint-disable-next-line no-undef
    undefined_function();
}

describe("Crashes tests ", () => {
    it("Checks if a caught crash is reported correctly", () => {
        hp.haltAndClearStorage(() => {
            initMain();
            Countbase.track_errors();
            try {
                cause_error();
            }
            catch (err) {
                Countbase.log_error(err);
            }
            cy.wait(1000).then(() => {
                cy.fetch_local_request_queue().then((rq) => {
                    cy.check_crash(rq[0], hp.appKey);
                });
            });
        });
    });
});
