const app = require('../server');
const chai = require('chai');
const request = require('supertest');
const db = require("../loaders/db.loader");
const User = db.user;

const should = chai.should();

expect = chai.expect;
let user = {
  first_name: "Adam",
  last_name: "Mayo",
  username: "adam@gmail.com",
  password: "Adam@1995"
}
describe('POST /v1/user ', function () {

  beforeEach( function(done) {
      User.destroy({
        where: {
          username: user.username
        }
      });
      done();
  });
 
  it('should create a user in database', function (done) {
    request(app).post('/v1/user').send(user).end(function (err, res) {
      res.status.should.be.equal(201);
      done();
    });
  });

  it('should not create a user in database with weak password', function (done) {
    user.password = "adam";
    request(app).post('/v1/user').send(user).end(function (err, res) {
      expect(res.statusCode).to.equal(400);
      expect(res.text).to.match(/Password is too weak/);
      done();
    });
  });
});