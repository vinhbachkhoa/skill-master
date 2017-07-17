//Levels service used to communicate Levels REST endpoints
(function () {
  'use strict';

  angular
    .module('levels')
    .factory('LevelsService', LevelsService);

  LevelsService.$inject = ['$resource'];

  function LevelsService($resource) {
    return $resource('api/levels/:levelId', {
      levelId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
