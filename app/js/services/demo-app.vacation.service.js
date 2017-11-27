angular.module('vacationService', []).factory('VacationService', ['$http', function ($http) {

    var urlBase = 'http://localhost:63915/api/vacations/';
    var VacationService = {};

    VacationService.save = function (data) {
        return $http({
            url: urlBase + 'Save',
            method: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    VacationService.get = function () {
        return $http.get(urlBase);
    };

    VacationService.delete = function (vacation) {
        return $http({
            url: urlBase + vacation.Id,
            method: 'DELETE'
        });
    };

    VacationService.update = function (vacation) {
        return $http({
            url: urlBase + vacation.Id,
            method: 'PUT',
            data: vacation
        });
    };

    VacationService.create = function (vacation) {
        return $http({
            url: urlBase,
            method: 'POST',
            data: vacation
        });
    };
    return VacationService;
}]);