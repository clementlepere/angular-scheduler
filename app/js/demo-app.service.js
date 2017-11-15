angular.module('personService', []).factory('PersonService', ['$http', function ($http) {

    var urlBase = 'http://localhost:63915/api';
    var PersonService = {};
    PersonService.get = function () {
        return $http.get(urlBase + '/Persons');
    };  

    

    PersonService.delete = function (person) {
        return $http({
            url: urlBase + '/Persons/' + person.Id,
            method: 'DELETE'
        });
    };

    PersonService.update = function (person) {
        return $http({
            url: urlBase + '/Persons/' + person.Id,
            method: 'PUT',
            data: person
        });
    };

    PersonService.create = function (person) {
        return $http({
            url: urlBase + '/Persons/',
            method: 'POST',
            data: person
        });
    };
    return PersonService;
}]);