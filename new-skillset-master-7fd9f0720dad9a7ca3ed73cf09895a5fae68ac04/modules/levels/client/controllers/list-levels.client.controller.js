(function () {
  'use strict';

  angular
    .module('levels')
    .controller('LevelsListController', LevelsListController);

  LevelsListController.$inject = ['LevelsService'];

  function LevelsListController(LevelsService) {
    var vm = this;

    vm.levels = LevelsService.query();
  }
})();
