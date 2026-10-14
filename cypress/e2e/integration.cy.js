var Countbase = require("../../lib/countbase");
var hp = require("../support/helper");

/**
 *  init countbase
 */
function initMain() {
    Countbase.init({
        app_key: "YOUR_APP_KEY",
        url: "https://your.domain.count.ly",
        debug: true,
        test_mode: true
    });
}

describe("Integration test", () => {
    it("int, no consent, no offline_mode", () => {
        initMain();
        var consentStatus = Countbase.check_any_consent();
        var remote = Countbase.get_remote_config();
        var id = Countbase.get_device_id();
        var idType = Countbase.get_device_id_type();
        hp.integrationMethods();
        cy.fetch_local_request_queue().then((rq) => {
            cy.log(rq);
            hp.testNormalFlowInt(rq, "/__cypress/iframes/cypress%5Ce2e%5Cintegration.cy.js", hp.appKey);
            expect(consentStatus).to.equal(true); // no consent necessary
            expect(remote).to.eql({}); // deepEqual
            expect(rq[0].device_id).to.equal(id);
            expect(rq[0].t).to.equal(idType);
        });
    });
});