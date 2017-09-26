const assert = require('assert');
const mock = require('egg-mock');
describe('test/app/middleware/robot.test.js', () => {
	let app;
	before(()=>{
		app = mock.app();
		return app.ready();
	});
	afterEach(mock.restore);
	it('should block robot', ()=> {
		return app.httpRequest()
			.get('/')
			.set('User-Agent', "Baiduspider")
			.expect(403);
	});
})