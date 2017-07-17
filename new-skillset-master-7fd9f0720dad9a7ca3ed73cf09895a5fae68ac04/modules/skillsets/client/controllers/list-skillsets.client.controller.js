(function () {
  'use strict';

  angular
    .module('skillsets')
    .controller('SkillsetsListController', SkillsetsListController);

  SkillsetsListController.$inject = ['SkillsetsService'];

  function SkillsetsListController(SkillsetsService) {
    var vm = this;

    vm.skillsets = SkillsetsService.query();
  }
})();
