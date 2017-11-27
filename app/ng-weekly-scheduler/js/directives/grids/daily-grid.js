/* global GRID_TEMPLATE, CLICK_ON_A_CELL */
/*jshint esversion: 6 */

angular.module('weeklyScheduler')
  .directive('dailyGrid', [function () {

    function handleClickEvent(child, nbWeeks, idx, scope) {
      child.bind('click', function () {
        scope.$broadcast(CLICK_ON_A_CELL, {
          nbElements: nbWeeks,
          idx: idx
        });
      });
    }

    function doGrid(scope, element, attrs, model) {
      let i;
      // Calculate week width distribution
      let tickcount = (model.nbWeeks);

      let ticksize = 100 / tickcount;
      let gridItemEl = GRID_TEMPLATE.css({
        width: ticksize / 7 + '%'
      });
      // let now = model.minDate.clone().startOf('week');
  

      let getDaysInMonth = (function () {
        'user strict';

        return function (month, year) {
          return new Date(year, month, 0).getDate();
        };

      })();

      let day = moment(model.minDate).format('D');
      let month = moment(model.minDate).format('M');
      let year = moment(model.minDate).format('Y');
      let limitDays = getDaysInMonth(month, year);

      console.log(limitDays);
      // console.log('day: '+ moment(model.minDate).format('D'));      
      // console.log('month: '+ moment(model.minDate).format('M')); 
      // console.log('year: '+ moment(model.minDate).format('Y'));      
      // Clean element
      element.empty();

      //Display the items in days instead of months 
      for (i = 0; i < tickcount * 7; i++) {
        let child = gridItemEl.clone();
        if (angular.isUndefined(attrs.noText)) {
          handleClickEvent(child, tickcount, i, scope);
          child.text(day);

          if (getDaysInMonth(month, year) - day === 0) {
            day = 0;
            if(month > 12){
              month = 0;
              year++;
            }
            month++;
          }
          day++;          
          // child.text(daysIndex[y]);
          // y++;
          // if (y === 7) {
          //   y = 0;
          // }
        }
        element.append(child);
      }
    }

    return {
      restrict: 'E',
      require: '^weeklyScheduler',
      link: function (scope, element, attrs, schedulerCtrl) {
        if (schedulerCtrl.config) {
          doGrid(scope, element, attrs, schedulerCtrl.config);
        }
        schedulerCtrl.$modelChangeListeners.push(function (newModel) {
          doGrid(scope, element, attrs, newModel);
        });
      }
    };
  }]);