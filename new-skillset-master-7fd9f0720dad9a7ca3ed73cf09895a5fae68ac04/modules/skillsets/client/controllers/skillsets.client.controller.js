(function () {
  'use strict';

  // Skillsets controller
  angular
    .module('skillsets')
    .controller('SkillsetsController', SkillsetsController);

  SkillsetsController.$inject = ['$scope', '$state', 'Authentication', 'skillsetResolve'];

  function SkillsetsController ($scope, $state, Authentication, skillset) {
    var vm = this;

    vm.authentication = Authentication;
    vm.skillset = skillset;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Skillset
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.skillset.$remove($state.go('skillsets.list'));
      }
    }

    // Save Skillset
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.skillsetForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.skillset._id) {
        vm.skillset.$update(successCallback, errorCallback);
      } else {
        vm.skillset.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('skillsets.view', {
          skillsetId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
