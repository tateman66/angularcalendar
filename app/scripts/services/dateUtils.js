'use strict';

angular.module('angularcalendarApp').factory('dateUtils', function(){
	return {
		getVisibleMonths : function(){
			var today = new Date(),
			currentMonth = today.getMonth(),
			currentYear = today.getFullYear(),
			months = [];

			for (var i=0; i<12; i++){
				months.push({
                    weeks: this.getVisibleWeeks(new Date(currentYear, currentMonth, 1))
                });

				currentYear = (currentMonth > 11) ? currentYear + 1 : currentYear;
				currentMonth = (currentMonth > 11) ? currentMonth-12 : ++currentMonth;
			}

			return months;
		},
		getVisibleWeeks : function(date) {
			date = new Date(date || new Date());
			var startMonth = date.getMonth(), startYear = date.getYear();
			date.setDate(1);
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);

			if (date.getDay() === 0) {
				date.setDate(-5);
			} else {
				date.setDate(date.getDate() - (date.getDay()));
			}
			if (date.getDate() === 1) {
				date.setDate(-6);
			}

			var weeks = [];
			while (weeks.length < 6) {
				/*jshint -W116 */
				if(date.getYear()=== startYear && date.getMonth() > startMonth) break;
				var week = [];
				for (var i = 0; i < 7; i++) {
					week.push(new Date(date));
					date.setDate(date.getDate() + 1);
				}
				weeks.push(week);
			}
			return weeks;
		},
		getDaysOfWeek : function(date) {
			date = new Date(date || new Date());
			date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
			date.setDate(date.getDate() - (date.getDay()));
			var days = [];
			for (var i = 0; i < 7; i++) {
				days.push(new Date(date));
				date.setDate(date.getDate() + 1);
			}
			return days;
		},
		isAfter : function(model, date) {
			return model && model.getTime() <= date.getTime();
		},
		isBefore : function(model, date) {
			return model.getTime() >= date.getTime();
		},
		isSameYear :   function(model, date) {
			return model && model.getFullYear() === date.getFullYear();
		},
		isSameMonth : function(model, date) {
			return this.isSameYear(model, date) && model.getMonth() === date.getMonth();
		},
		isSameDay : function(model, date) {
			return this.isSameMonth(model, date) && model.getDate() === date.getDate();
		}
	};
});
