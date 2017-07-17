'use strict';

describe('Skillsets E2E Tests:', function () {
  describe('Test Skillsets page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/skillsets');
      expect(element.all(by.repeater('skillset in skillsets')).count()).toEqual(0);
    });
  });
});
