(function () {
  'use strict';

  describe('Skillsets Route Tests', function () {
    // Initialize global variables
    var $scope,
      SkillsetsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SkillsetsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SkillsetsService = _SkillsetsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('skillsets');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/skillsets');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SkillsetsController,
          mockSkillset;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('skillsets.view');
          $templateCache.put('modules/skillsets/client/views/view-skillset.client.view.html', '');

          // create mock Skillset
          mockSkillset = new SkillsetsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Skillset Name'
          });

          //Initialize Controller
          SkillsetsController = $controller('SkillsetsController as vm', {
            $scope: $scope,
            skillsetResolve: mockSkillset
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:skillsetId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.skillsetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            skillsetId: 1
          })).toEqual('/skillsets/1');
        }));

        it('should attach an Skillset to the controller scope', function () {
          expect($scope.vm.skillset._id).toBe(mockSkillset._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/skillsets/client/views/view-skillset.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SkillsetsController,
          mockSkillset;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('skillsets.create');
          $templateCache.put('modules/skillsets/client/views/form-skillset.client.view.html', '');

          // create mock Skillset
          mockSkillset = new SkillsetsService();

          //Initialize Controller
          SkillsetsController = $controller('SkillsetsController as vm', {
            $scope: $scope,
            skillsetResolve: mockSkillset
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.skillsetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/skillsets/create');
        }));

        it('should attach an Skillset to the controller scope', function () {
          expect($scope.vm.skillset._id).toBe(mockSkillset._id);
          expect($scope.vm.skillset._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/skillsets/client/views/form-skillset.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SkillsetsController,
          mockSkillset;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('skillsets.edit');
          $templateCache.put('modules/skillsets/client/views/form-skillset.client.view.html', '');

          // create mock Skillset
          mockSkillset = new SkillsetsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Skillset Name'
          });

          //Initialize Controller
          SkillsetsController = $controller('SkillsetsController as vm', {
            $scope: $scope,
            skillsetResolve: mockSkillset
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:skillsetId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.skillsetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            skillsetId: 1
          })).toEqual('/skillsets/1/edit');
        }));

        it('should attach an Skillset to the controller scope', function () {
          expect($scope.vm.skillset._id).toBe(mockSkillset._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/skillsets/client/views/form-skillset.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
