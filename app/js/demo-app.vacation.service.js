angular.module('vacationService', []).factory('VacationService ', ['$http', function ($http) {

    var urlBase = 'http://localhost:63915/api/vacations/';
    var VacationService = {};
    VacationService.get = function () {
        return $http.get(urlBase);
    };  

    VacationService.delete = function (person) {
        return $http({
            url: urlBase + person.Id,
            method: 'DELETE'
        });
    };

    VacationService.update = function (person) {
        return $http({
            url: urlBase + person.Id,
            method: 'PUT',
            data: person
        });
    };

    VacationService.create = function (person) {
        return $http({
            url: urlBase,
            method: 'POST',
            data: person
        });
    };
    return VacationService;
}]);