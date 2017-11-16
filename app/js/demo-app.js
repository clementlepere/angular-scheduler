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

      $scope.model = {
        locale: localeService.$locale.id,
        options: { /*monoSchedule: true*/ }
      };

      getPersons();

      $scope.createVacation = function (ev) {
        var add = $mdDialog.confirm({
          controller: CreateVacation,
          templateUrl: 'js/demo-app.create.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
            persons: this.persons,
          }
        });
        $mdDialog.show(add);

        function CreateVacation($scope, $mdDialog, persons) {
          $scope.persons = persons;
          $scope.getSelectedText = function () {
            console.log($scope.selectedPerson);
            if ($scope.selectedPerson !== undefined) {
              return 'You have selected: ' + $scope.selectedPerson.Name;
            } else {
              return 'Please select a person';
            }
          };

          $scope.cancel = function () {
            $mdDialog.cancel();
          };
        }
      };

      $scope.addNewPerson = function (ev) {
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

        function AddController($scope, persons) {
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
              addPersonInList(person);
              // getPersons();
            });

            $scope.cancel = function () {
              $mdDialog.cancel();
            };
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

          $scope.deletePerson = function (person, index) {
            PersonService.delete(person).then(() => {
              $scope.persons.splice(index, 1);
              deletePersonInList(index);
            });
          };
          
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
        }
      };

      function deletePersonInList(index) {
        $timeout(function () {
          $scope.model.items.splice(index, 1);
        }, 100);
      }

      function addPersonInList(person) {
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
        }, 100);
      }

      function getPersons() {
        PersonService.get()
          .then(function (persons) {
            $scope.persons = persons.data;
            this.Name = '';
            this.persons = persons.data;
            $scope.model.items = [];
            persons.data.forEach(person => {
              addPersonInList(person);
            });
          })
          .catch(function (error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
          });
      }

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