(function () {
  'use strict';

  // Levels controller
  angular
    .module('levels')
    .controller('LevelsController', LevelsController);

  LevelsController.$inject = ['$scope', '$state', 'Authentication', 'levelResolve'];

  function LevelsController ($scope, $state, Authentication, level) {
    var vm = this;

    vm.authentication = Authentication;
    vm.level = level;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Level
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.level.$remove($state.go('levels.list'));
      }
    }

    // Save Level
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.levelForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.level._id) {
        vm.level.$update(successCallback, errorCallback);
      } else {
        vm.level.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('levels.view', {
          levelId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
