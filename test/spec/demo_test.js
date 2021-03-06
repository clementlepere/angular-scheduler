describe('weeklyScheduler module', function () {
  'use strict';

  var scope, createController;

  beforeEach(module('demoApp'));

  beforeEach(inject(function ($rootScope, $controller, $timeout) {
    scope = $rootScope.$new();

    createController = function () {
      return $controller('DemoController', {
        '$scope': scope,
        '$timeout': $timeout
      });
    };
  }));

  describe('demo controller', function () {

    it('should be defined', inject(function () {
      //spec body
      var demoController = createController();
      expect(demoController).toBeDefined();
    }));
  });

  describe('demo controller', function () {

    it('should be defined', inject(function () {
      //spec body
      var demoController = createController();
      expect(demoController).toBeDefined();
    }));
  });

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  
  if(dd<10) {
      dd = '0'+dd;
  } 
  
  if(mm<10) {
      mm = '0'+mm;
  } 
  
  today = mm + '/' + dd + '/' + yyyy;

  moment.locale('test', {week: {dow: 0, doy: 6}});
  var minDateUs = moment('2016-11-20');
  var stUs = minDateUs.clone().startOf('week');
  var wkNbUs = stUs.week();
  console.log('wkNbUs', stUs, wkNbUs);

  moment.locale('fr', {week: {dow: 1, doy: 4}});
  var minDateFr = moment('2016-11-20');
  var stFr = minDateFr.clone().startOf('week');
  var wkNbFr = stFr.week();
  console.log('wkNbFr', stFr, wkNbFr);

  moment.locale('en');
  var minDateUs2 = moment('2016-11-20');
  var stUs2 = minDateUs2.clone().startOf('week');
  var wkNbUs2 = stUs2.week();
  console.log('wkNbUs2', stUs2, wkNbUs2);
});