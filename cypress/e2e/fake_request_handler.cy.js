/* eslint-disable require-jsdoc */
var Countbase = require("../../lib/countbase");
var hp = require("../support/helper");

/**
 * Tests for the fake_request_handler feature
 * This allows injecting a mock server in tests for controlled request/response handling
 */
describe("Fake request handler", () => {
    it("captures requests and provides custom responses via init config", () => {
        hp.haltAndClearStorage(() => {
            var capturedRequests = [];
            
            Countbase.init({
                app_key: hp.appKey,
                url: "https://test.count.ly",
                debug: true,
                fake_request_handler: function(req) {
                    capturedRequests.push(req);
                    // Return success response
                    return { status: 200, responseText: '{"result":"Success"}' };
                }
            });
            
            Countbase.add_event({ key: "test_event", count: 1 });
            Countbase.begin_session();
            
            cy.wait(500).then(() => {
                // Verify requests were captured
                expect(capturedRequests.length).to.be.greaterThan(0);
                
                // Check that we have different request types
                var functionNames = capturedRequests.map(r => r.functionName);
                expect(functionNames).to.include("send_request_queue");
                
                // Verify request structure
                var hasBeginSession = capturedRequests.some(r => 
                    r.params && r.params.begin_session === 1
                );
                expect(hasBeginSession).to.be.true;
            });
        });
    });

    it("allows simulating error responses", () => {
        hp.haltAndClearStorage(() => {
            var requestCount = 0;
            
            Countbase.init({
                app_key: hp.appKey,
                url: "https://test.count.ly",
                debug: true,
                fake_request_handler: function() {
                    requestCount++;
                    // Simulate server error
                    return { status: 500, responseText: 'Internal Server Error' };
                }
            });
            
            Countbase.begin_session();
            
            cy.wait(300).then(() => {
                // Requests should still be captured even on error
                expect(requestCount).to.be.greaterThan(0);
            });
        });
    });

    it("can be set at runtime via _internals", () => {
        hp.haltAndClearStorage(() => {
            var capturedRequests = [];
            
            Countbase.init({
                app_key: hp.appKey,
                url: "https://test.count.ly",
                debug: true,
                test_mode: true // prevent queue processing initially
            });
            
            // Set handler at runtime
            Countbase._internals.setFakeRequestHandler(function(req) {
                capturedRequests.push(req);
                return { status: 200, responseText: '{"result":"Success"}' };
            });
            
            // Verify it was set
            var handler = Countbase._internals.getFakeRequestHandler();
            expect(handler).to.be.a("function");
            
            // Enable request processing
            Countbase.test_mode_rq(false);
            
            Countbase.add_event({ key: "runtime_event", count: 1 });
            
            cy.wait(500).then(() => {
                expect(capturedRequests.length).to.be.greaterThan(0);
            });
        });
    });

    it("returns default success when handler returns undefined", () => {
        hp.haltAndClearStorage(() => {
            Countbase.init({
                app_key: hp.appKey,
                url: "https://test.count.ly",
                debug: true,
                fake_request_handler: function() {
                    // Return nothing - should default to success
                    return undefined;
                }
            });
            
            Countbase.begin_session();
            
            cy.wait(300).then(() => {
                // Session should start successfully with default response
                expect(Countbase._internals.testingGetRequests().length).to.be.greaterThan(0);
            });
        });
    });

    it("skips callback when handler returns false", () => {
        hp.haltAndClearStorage(() => {
            var capturedRequests = [];
            
            Countbase.init({
                app_key: hp.appKey,
                url: "https://test.count.ly",
                debug: true,
                fake_request_handler: function(req) {
                    capturedRequests.push(req);
                    // Return false to skip callback entirely
                    return false;
                }
            });
            
            Countbase.begin_session();
            
            cy.wait(300).then(() => {
                // Requests should still be captured
                expect(capturedRequests.length).to.be.greaterThan(0);
            });
        });
    });

    it("works with helper createFakeRequestHandler utility", () => {
        hp.haltAndClearStorage(() => {
            // Use the helper utility for cleaner test setup
            var fakeServer = hp.createFakeRequestHandler({
                onRequest: function(req) {
                    // Custom logic per request
                    if (req.params && req.params.begin_session) {
                        return { status: 200, responseText: '{"result":"Session started"}' };
                    }
                    return { status: 200, responseText: '{"result":"OK"}' };
                }
            });
            
            Countbase.init({
                app_key: hp.appKey,
                url: "https://test.count.ly",
                debug: true,
                fake_request_handler: fakeServer.handler
            });
            
            Countbase.begin_session();
            Countbase.add_event({ key: "helper_event", count: 1 });
            
            cy.wait(500).then(() => {
                // Use helper methods for easy querying
                var sessionReqs = fakeServer.findByParam("begin_session", 1);
                expect(sessionReqs.length).to.equal(1);
                
                var allReqs = fakeServer.getRequests();
                expect(allReqs.length).to.be.greaterThan(0);
                
                // Clear for next test section
                fakeServer.clear();
                expect(fakeServer.getRequests().length).to.equal(0);
            });
        });
    });

    it("provides full request details for validation", () => {
        hp.haltAndClearStorage(() => {
            var lastRequest = null;
            
            Countbase.init({
                app_key: hp.appKey,
                url: "https://test.count.ly",
                debug: true,
                fake_request_handler: function(req) {
                    lastRequest = req;
                    return { status: 200, responseText: '{"result":"Success"}' };
                }
            });
            
            Countbase.begin_session();
            
            cy.wait(300).then(() => {
                expect(lastRequest).to.not.be.null;
                
                // Verify request structure has all expected fields
                expect(lastRequest).to.have.property("functionName");
                expect(lastRequest).to.have.property("url");
                expect(lastRequest).to.have.property("params");
                
                // URL should match configured server
                expect(lastRequest.url).to.include("test.count.ly");
                
                // Params should have app_key
                expect(lastRequest.params).to.have.property("app_key", hp.appKey);
            });
        });
    });
});
