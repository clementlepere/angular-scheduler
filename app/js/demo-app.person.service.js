angular.module('personService', []).factory('PersonService', ['$http', function ($http) {

    var urlBase = 'http://localhost:63915/api/persons/';
    var PersonService = {};
    PersonService.get = function () {
        return $http.get(urlBase);
    };  

    PersonService.delete = function (person) {
        return $http({
            url: urlBase + person.Id,
            method: 'DELETE'
        });
    };

    PersonService.update = function (person) {
        return $http({
            url: urlBase + person.Id,
            method: 'PUT',
            data: person
        });
    };

    PersonService.create = function (person) {
        return $http({
            url: urlBase,
            method: 'POST',
            data: person
        });
    };
    return PersonService;
}]);