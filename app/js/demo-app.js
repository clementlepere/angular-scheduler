/*jshint esversion: 6 */
angular.module('demoApp', ['ngAnimate', 'weeklyScheduler', 'weeklySchedulerI18N', 'ngMaterial', 'ngMessages', 'personService'])

  .config(['weeklySchedulerLocaleServiceProvider', function (localeServiceProvider) {
    localeServiceProvider.configure({
      doys: {
        'es-es': 4
      },
      lang: {
        'es-es': {
          month: 'Mes',
          weekNb: 'número de la semana',
          addNew: 'Añadir'
        }
      },
      localeLocationPattern: '/vendor/angular-i18n/angular-locale_{{locale}}.js'
    });
  }])

  .controller('DemoController', ['$scope', '$timeout', 'weeklySchedulerLocaleService', '$log', '$mdDialog', 'PersonService',
    function ($scope, $timeout, localeService, $log, $mdDialog, PersonService) {
      $scope.status = '  ';
      $scope.customFullscreen = false;


      $scope.addItem = function (ev) {
        var add = $mdDialog.confirm({
          controller: AddController,
          templateUrl: 'js/demo-app.add.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
            persons: this.persons,
          }
        });
        $mdDialog.show(add);

        function AddController($scope, $mdDialog, persons) {
          $scope.persons = persons;
          $scope.person = {
            Name: '',
            Email: '',
            Mobile: ''
          };

          $scope.addPerson = function (person) {
            console.log('person:' + person.Name);
            PersonService.create(person).then(() => {
              console.log('person created');
              refreshPersonsList();
            });
          };
        }
      };

      $scope.deletePersons = function (ev) {
        var confirm = $mdDialog.confirm({
          controller: DeleteController,
          templateUrl: 'js/demo-app.delete.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
            persons: this.persons,
          }
        });
        $mdDialog.show(confirm);

        function DeleteController($scope, $mdDialog, persons) {
          $scope.persons = persons;

          $scope.alert = function (person) {
            console.log(person);
          };

          $scope.hide = function () {
            $mdDialog.hide();
          };

          $scope.deletePerson = function (person, index) {
            console.log(index);
            PersonService.delete(person).then(() => {
              $scope.persons.splice(index, 1);
              refreshPersonsList();
            });
          };
          this.personsChanged = -0;
          $scope.$watch('persons', function () {
            this.personsChanged = -0;
            console.log('persons changed');
          }, true);

          $scope.cancel = function () {
            $mdDialog.cancel();
          };
        }
      };

      $scope.model = {
        locale: localeService.$locale.id,
        options: { /*monoSchedule: true*/ }
      };

      getPersons();

      function refreshPersonsList() {
        $scope.model.items = [];
        getPersons();
      }

      function getPersons() {
        PersonService.get()
          .then(function (persons) {
            $scope.persons = persons.data;
            this.Name = '';
            this.persons = persons.data;
            $scope.model.items = [];
            persons.data.forEach(person => {
              $timeout(function () {
                $scope.model.items = $scope.model.items.concat(
                  [{
                    label: person.Name,
                    schedules: [{
                        start: moment('2017-05-03').toDate(),
                        end: moment('2018-02-01').toDate()
                      },
                      // {
                      //   start: moment('2016-11-20').toDate(),
                      //   end: moment('2017-02-01').toDate()
                      // }
                    ]
                  }]);
              }, 1000);
            });
          })
          .catch(function (error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
          });
      }



      // $timeout(function () {
      //   $scope.model.items = $scope.model.items.concat([{
      //       label: 'Pierre',
      //       schedules: [{
      //           start: moment('2016-05-03').toDate(),
      //           end: moment('2017-02-01').toDate()
      //         },
      //         {
      //           start: moment('2015-11-20').toDate(),
      //           end: moment('2016-02-01').toDate()
      //         }
      //       ]
      //     }
      //     , {
      //       label: 'Paul',
      //       schedules: [{
      //           start: moment('2017-08-09').toDate(),
      //           end: moment('2017-08-21').toDate()
      //         },
      //         {
      //           start: moment('2017-09-12').toDate(),
      //           end: moment('2017-10-12').toDate()
      //         }
      //       ]
      //     }
      //   ]);
      // }, 100);

      this.doSomething = function (itemIndex, scheduleIndex, scheduleValue) {
        $log.debug('The model has changed!', itemIndex, scheduleIndex, scheduleValue);
      };

      this.onLocaleChange = function () {
        $log.debug('The locale is changing to', $scope.model.locale);
        localeService.set($scope.model.locale).then(function ($locale) {
          $log.debug('The locale changed to', $locale.id);
        });
      };
    }
  ]);