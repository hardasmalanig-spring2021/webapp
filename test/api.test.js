const app = require("../server");
const chai = require("chai");
const should = chai.should();
const httpMocks = require('node-mocks-http');
const { validation } = require("../middleware");

const request = httpMocks.createRequest({
  body: {
    first_name:'Gunjan1234'
  }
});

let response = httpMocks.createResponse();

describe("Check first name should not contain characters", function () {
  it("should return status 400 & message: First name should only contain characters", function(done) {
    const next = function() {done();}
    validation.validateUserRequest(request,response,next)
    const message = response._getData().firstNameError;
    const expectedMessage = "First name should only contain characters"
    message.should.include(expectedMessage);
    response.statusCode.should.be.equal(400);
    done();
  });
});
