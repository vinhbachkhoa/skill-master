//Skillsets service used to communicate Skillsets REST endpoints
(function () {
  'use strict';

  angular
    .module('skillsets')
    .factory('SkillsetsService', SkillsetsService);

  SkillsetsService.$inject = ['$resource'];

  function SkillsetsService($resource) {
    return $resource('api/skillsets/:skillsetId', {
      skillsetId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
