/*jshint esversion: 6 */
angular.module('demoApp', ['ngAnimate', 'weeklyScheduler', 'weeklySchedulerI18N', 'ngMaterial', 'ngMessages', 'vacationService', 'personService'])

  .controller('DemoController', ['$scope', '$timeout', 'weeklySchedulerLocaleService', '$log', '$mdDialog', 'VacationService', 'PersonService',
    function ($scope, $timeout, localeService, $log, $mdDialog, VacationService, PersonService) {
      $scope.status = '  ';
      $scope.customFullscreen = false;

      $scope.model = {
        locale: localeService.$locale.id,
        options: { /*monoSchedule: true*/ }
      };

      getPersons();

      $scope.selectedFile = null;
      $scope.msg = '';


      // $scope.loadFile = function (files) {

      //   $scope.$apply(function () {

      //     $scope.selectedFile = files[0];

      //   });

      // };

      // $scope.handleFile = function () {

      //   var file = $scope.selectedFile;

      //   if (file) {

      //     var reader = new FileReader();

      //     reader.onload = function (e) {

      //       var data = e.target.result;

      //       var workbook = XLSX.read(data, {
      //         type: 'binary'
      //       });

      //       var first_sheet_name = workbook.SheetNames[0];

      //       var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);

      //       //console.log(excelData);  

      //       if (dataObjects.length > 0) {


      //         $scope.save(dataObjects);


      //       } else {
      //         $scope.msg = "Error : Something Wrong !";
      //       }

      //     }

      //     reader.onerror = function (ex) {

      //     }

      //     reader.readAsBinaryString(file);
      //   }
      // }


      $scope.createVacation = function (ev) {
        let add = $mdDialog.confirm({
          controller: CreateVacationController,
          templateUrl: 'js/demo-app.create.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
            persons: this.persons,
          }
        });
        $mdDialog.show(add);

        function CreateVacationController($scope, $mdDialog, persons) {
          $scope.persons = persons;
          $scope.vacation = {
            StartDate: '',
            EndDate: '',
            PersonId: ''
          };
          $scope.getSelectedText = function () {
            if ($scope.selectedPerson !== undefined) {
              $scope.vacation.PersonId = $scope.selectedPerson.Id;
              return 'You have selected: ' + $scope.selectedPerson.Name;
            } else {
              return 'Please select a person';
            }
          };

          this.vacation = $scope.vacation;
          $scope.myDate = new Date();
          this.myDate = $scope.myDate;
          $scope.minDate = new Date(
            this.myDate.getFullYear(),
            this.myDate.getMonth() - 2,
            this.myDate.getDate()
          );

          $scope.maxDate = new Date(
            this.myDate.getFullYear(),
            this.myDate.getMonth() + 2,
            this.myDate.getDate()
          );

          $scope.noWeekendsPredicate = function (date) {
            let day = date.getDay();
            return !(day === 0 || day === 6);
          };

          $scope.endDateAfterStartDatePredicate = function (startDate, endDate) {
            if (endDate < startDate) {
              return -0;
            } else {
              return 0;
            }
          };

          $scope.addVacation = function (vacation) {
            if (vacation.EndDate > vacation.StartDate) {
              moment(vacation.EndDate).format('YYYY-MM-DD');
              moment(vacation.StartDate).format('YYYY-MM-DD');
              VacationService.create(vacation).then(() => {
                console.log('vacation created');
                // addPersonInList(person);
                getPersons();
              });
            } else {
              return 'End date must be superior to start date';
            }
          };

          $scope.cancel = function () {
            $mdDialog.cancel();
          };
        }
      };

      $scope.addNewPerson = function (ev) {
        let add = $mdDialog.confirm({
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

          $scope.cancel = function () {
            $mdDialog.cancel();
          };

          $scope.addPerson = function (person) {
            PersonService.create(person).then(() => {
              console.log('person created');
              getPersons();
            });
          };
        }
      };

      $scope.deletePersons = function (ev) {
        let confirm = $mdDialog.confirm({
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

      function addVacationInPerson(person) {
        if (person.Vacation && person.Vacation.length > 0) {
          for (let y = 0; y < $scope.model.items.length; y++) {
            if ($scope.model.items[y].id === person.Id) {
              for (let i = 0; i < person.Vacation.length; i++) {
                $scope.model.items[y].schedules[i] = {
                  editable: true,
                  start: moment(person.Vacation[i].StartDate).toDate(),
                  end: moment(person.Vacation[i].EndDate).toDate()
                };
              }
            }
          }
        }
      }

      function addPersonInList(person) {
        $timeout(function () {
          $scope.model.items = $scope.model.items.concat(
            [{
              id: person.Id,
              label: person.Name,
              editable: true,
              schedules: [{
                start: moment('2017-05-30').toDate(),
                end: moment('2050-06-01').toDate()
              }]
            }]
          );
          addVacationInPerson(person);
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