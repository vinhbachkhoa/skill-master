'use strict';

describe('Levels E2E Tests:', function () {
  describe('Test Levels page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/levels');
      expect(element.all(by.repeater('level in levels')).count()).toEqual(0);
    });
  });
});
