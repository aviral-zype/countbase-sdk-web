/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable require-jsdoc */
var Countbase = require("../../lib/countbase");
var hp = require("../support/helper.js");
const SDK_NAME = "javascript_native_web";
const SDK_VERSION = "26.1.2";

function initMain(name, version) {
    Countbase.init({
        app_key: "YOUR_APP_KEY",
        url: "https://your.domain.count.ly",
        test_mode: true,
        debug: true,
        sdk_name: name,
        sdk_version: version
    });
}

describe("SDK name and version methods", () => {
    it("sdk_name and sdk_version return default values when not overridden", () => {
        hp.haltAndClearStorage(() => {
            initMain(undefined, undefined);
            const name = Countbase.sdk_name();
            const version = Countbase.sdk_version();
            expect(name).to.equal(SDK_NAME);
            expect(version).to.equal(SDK_VERSION);
        });
    });

    it("sdk_name and sdk_version return overridden values", () => {
        hp.haltAndClearStorage(() => {
            initMain("custom_sdk_name", "1.2.3");
            const name = Countbase.sdk_name();
            const version = Countbase.sdk_version();
            expect(name).to.equal("custom_sdk_name");
            expect(version).to.equal("1.2.3");
        });
    });
});
