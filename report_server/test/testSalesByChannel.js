const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;

process.env.NODE_ENV = 'test';  // Set environment to test

describe('Testing Sales ByChannel API', function () {
	let server;
	beforeEach(function () {
		server = require('../bin/www' );
	});
	afterEach(function (done) {
		delete require.cache[require.resolve('../bin/www')];
		done();
	});
	describe('GET /untapped/sales-by-channel - missing kioskID', function() {
		it('Should fail with 400 error code', (done) => {
			chai.request(server)
				.get('/untapped/sales-by-channel')
				.end(function(err, res) {
					res.should.have.status(400);
					done(err);
				});
		});
	});
	describe('GET /untapped/sales-by-channel - unknown kioskID', function() {
		it('Should succed with sales by channel info becuase the kioskID does not exist', (done) => {
			chai.request(server)
				.get('/untapped/sales-by-channel?kioskID=9999&groupby=month')
				.end(function(err, res) {
					res.should.have.status(200);
					expect(res.body.salesByChannel.datasets).to.be.an('array');
					expect(res.body.salesByChannel.datasets).to.be.empty;

					done(err);
				});
		});
	});

	describe('GET /untapped/sales-by-channel- UnitTest KioskID', function() {
		it('Should get info for one customer with one sale', (done) => {
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					res.body.kiosks[0].should.have.property('name').eql('UnitTest');
					let url = "/untapped/sales-by-channel?kioskID=%d&groupby=month";
					url = sprintf( url, res.body.kiosks[0].id)
					chai.request(server)
						.get(url)
						.end(function (err, res) {
							res.should.have.status(200);
							expect(res.body.salesByChannel.datasets).to.be.an('array');
							expect(res.body.salesByChannel.datasets.length).to.be.equal(1);
							expect(res.body.salesByChannel.datasets[0].data.length).to.be.equal(4);
							done(err);
						});
				});
		});
	});


});
