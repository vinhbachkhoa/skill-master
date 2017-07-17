(function () {
  'use strict';

  angular
    .module('levels')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Levels',
      state: 'levels',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'levels', {
      title: 'List Levels',
      state: 'levels.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'levels', {
      title: 'Create Level',
      state: 'levels.create',
      roles: ['user']
    });
  }
})();
