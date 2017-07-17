(function () {
  'use strict';

  angular
    .module('skillsets')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('skillsets', {
        abstract: true,
        url: '/skillsets',
        template: '<ui-view/>'
      })
      .state('skillsets.list', {
        url: '',
        templateUrl: 'modules/skillsets/client/views/list-skillsets.client.view.html',
        controller: 'SkillsetsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Skillsets List'
        }
      })
      .state('skillsets.create', {
        url: '/create',
        templateUrl: 'modules/skillsets/client/views/form-skillset.client.view.html',
        controller: 'SkillsetsController',
        controllerAs: 'vm',
        resolve: {
          skillsetResolve: newSkillset
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Skillsets Create'
        }
      })
      .state('skillsets.edit', {
        url: '/:skillsetId/edit',
        templateUrl: 'modules/skillsets/client/views/form-skillset.client.view.html',
        controller: 'SkillsetsController',
        controllerAs: 'vm',
        resolve: {
          skillsetResolve: getSkillset
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Skillset {{ skillsetResolve.name }}'
        }
      })
      .state('skillsets.view', {
        url: '/:skillsetId',
        templateUrl: 'modules/skillsets/client/views/view-skillset.client.view.html',
        controller: 'SkillsetsController',
        controllerAs: 'vm',
        resolve: {
          skillsetResolve: getSkillset
        },
        data:{
          pageTitle: 'Skillset {{ articleResolve.name }}'
        }
      });
  }

  getSkillset.$inject = ['$stateParams', 'SkillsetsService'];

  function getSkillset($stateParams, SkillsetsService) {
    return SkillsetsService.get({
      skillsetId: $stateParams.skillsetId
    }).$promise;
  }

  newSkillset.$inject = ['SkillsetsService'];

  function newSkillset(SkillsetsService) {
    return new SkillsetsService();
  }
})();
