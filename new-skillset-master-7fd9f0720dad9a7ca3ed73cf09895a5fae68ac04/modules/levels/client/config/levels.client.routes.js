(function () {
  'use strict';

  angular
    .module('levels')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('levels', {
        abstract: true,
        url: '/levels',
        template: '<ui-view/>'
      })
      .state('levels.list', {
        url: '',
        templateUrl: 'modules/levels/client/views/list-levels.client.view.html',
        controller: 'LevelsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Levels List'
        }
      })
      .state('levels.create', {
        url: '/create',
        templateUrl: 'modules/levels/client/views/form-level.client.view.html',
        controller: 'LevelsController',
        controllerAs: 'vm',
        resolve: {
          levelResolve: newLevel
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Levels Create'
        }
      })
      .state('levels.edit', {
        url: '/:levelId/edit',
        templateUrl: 'modules/levels/client/views/form-level.client.view.html',
        controller: 'LevelsController',
        controllerAs: 'vm',
        resolve: {
          levelResolve: getLevel
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Level {{ levelResolve.name }}'
        }
      })
      .state('levels.view', {
        url: '/:levelId',
        templateUrl: 'modules/levels/client/views/view-level.client.view.html',
        controller: 'LevelsController',
        controllerAs: 'vm',
        resolve: {
          levelResolve: getLevel
        },
        data:{
          pageTitle: 'Level {{ articleResolve.name }}'
        }
      });
  }

  getLevel.$inject = ['$stateParams', 'LevelsService'];

  function getLevel($stateParams, LevelsService) {
    return LevelsService.get({
      levelId: $stateParams.levelId
    }).$promise;
  }

  newLevel.$inject = ['LevelsService'];

  function newLevel(LevelsService) {
    return new LevelsService();
  }
})();
