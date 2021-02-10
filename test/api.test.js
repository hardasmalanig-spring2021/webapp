app = require('../server');
chai = require('chai');
request = require('supertest');

expect = chai.expect;
let user = {
  first_name: "Adam",
  last_name: "Mayo",
  username: "adammayor1995@gmail.com",
  password: "Adam@1995"
}
describe('POST /v1/user ', function () {
  it('should create a user in database', () => {
    request(app).post('/v1/user').send(user).end(function (err, res) {
      expect(res.statusCode).to.equal(200);
      console.log("response message", res.text, res.request)
    });
  });

  it('should not create a user in database with weak password', () => {
    user.password = "adam"
    request(app).post('/v1/user').send(user).end(function (err, res) {
      expect(res.statusCode).to.equal(401);
      expect(res.text).to.match(/Password is too weak/)
    });
  });
}); 
