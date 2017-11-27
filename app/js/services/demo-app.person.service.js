angular.module('personService', []).factory('PersonService', ['$http', function ($http) {

    var urlBase = 'http://localhost:63915/api/persons/';
    var PersonService = {};
    
    PersonService.save = function (data) {
        return $http({
            url: urlBase + 'Save',
            method: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

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