/**
 * @class CalendarPicker.
 * @description Provides a simple way to get a minimalistic calender in your DOM.
 * @author Mathias Picker - 29 July 2020.
 */

class CalendarPicker {
    constructor(element, options) {
        // Core variables.
        this.date = new Date();
        this._formatDateToInit(this.date);

        this.day = this.date.getDay()
        this.month = this.date.getMonth();
        this.year = this.date.getFullYear();

        // Storing the todays date for practical reasons.
        this.today = this.date;

        // The calendars value should always be the current date.
        this.value = this.date;

        // Ranges for the calendar (optional).
        this.min = options.min;
        this.max = options.max;
        this._formatDateToInit(this.min)
        this._formatDateToInit(this.max)

        // Element to insert calendar in.
        this.userElement = document.querySelector(element);

        // Destructuring current date as readable text.
        [this.dayAsText, this.monthAsText, this.dateAsText, this.yearAsText] = this.date.toString().split(' ')

        // The elements used to build the calendar.
        this.calendarWrapper = document.createElement('div');
        this.calendarElement = document.createElement('div')
        this.calendarHeader = document.createElement('header');
        this.calendarHeaderTitle = document.createElement('h4');
        this.navigationWrapper = document.getElementById("navigation-wrapper");
        this.navigationWrapperHorizontal = document.getElementById("horizontal-arrows");
        this.calendarGridDays = document.createElement('section')
        this.calendarGrid = document.createElement('section');
        this.calendarDayElementType = 'time';

        // Hard-coded list of all days.
        this.listOfAllDaysAsText = [
            'Måndag',
            'Tisdag',
            'Onsdag',
            'Torsdag',
            'Fredag',
            'Lördag',
            'Söndag'
        ];

        // Hard-coded list of all months.
        this.listOfAllMonthsAsText = [
            'Januari',
            'Februari',
            'Mars',
            'April',
            'Maj',
            'Juni',
            'Juli',
            'Augusti',
            'September',
            'Oktober',
            'November',
            'December'
        ];

        // Creating the calendar
        this.calendarWrapper.id = 'calendar-wrapper';
        this.calendarElement.id = 'calendar';
        this.calendarGridDays.id = 'calendar-days';
        this.calendarGrid.id = 'calendar-grid';
        this.previousMonthArrow = document.getElementById("previous-month");
        this.nextMonthArrow = document.getElementById("next-month");
        this.previousMonthArrowHorizontal = document.getElementById("previous-month-horizontal");
        this.nextMonthArrowHorizontal = document.getElementById("next-month-horizontal");

        this._insertHeaderIntoCalendarWrapper();
        this._insertCalendarGridDaysHeader();
        this._insertDaysIntoGrid();
        this._insertNavigationButtons();
        this._insertCalendarIntoWrapper();

        this.userElement.appendChild(this.calendarWrapper);
    }

    /**
     * @param {Number} The month number, 0 based.
     * @param {Number} The year, not zero based, required to account for leap years.
     * @return {Array<Date>} List with date objects for each day of the month.
     * @author Juan Mendes - 30th October 2012.
     */
    _getDaysInMonth(month, year) {
        if ((!month && month !== 0) || (!year && year !== 0)) return;

        const date = new Date(year, month, 1);
        const days = [];

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    /**
     * @param {DateObject} date.
     * @description Sets the clock of a date to 00:00:00 to be consistent.
     */
    _formatDateToInit(date) {
        if (!date) return;
        date.setHours(0, 0, 0);
    }

    /**
     * @description Inserts the calendar into the wrapper and adds eventListeners for the calender-grid.
     */
    _insertCalendarIntoWrapper() {
        this.calendarWrapper.appendChild(this.calendarElement);

        /**
         * @param {Event} event An event from an eventListener.
         */
        const handleSelectedElement = (event) => {
            if (event.target.nodeName.toLowerCase() === this.calendarDayElementType && !event.target.classList.contains('disabled')) {

                // Removes the 'selected' class from all elements that have it.
                Array.from(document.querySelectorAll('.selected')).forEach(element => element.classList.remove('selected'));

                // Adds the 'selected'-class to the selected date.
                event.target.classList.add('selected');

                this.value = event.target.value;

                // Fires the onValueChange function with the provided callback.
                this.onValueChange(this.callback);
            }
        }

        this.calendarGrid.addEventListener('click', handleSelectedElement, true);

        this.calendarGrid.addEventListener('keydown', (keyEvent) => {
            if (keyEvent.key !== 'Enter') return;

            handleSelectedElement(keyEvent);
        }, false);
    }

    /**
     * @description Adds the "main" calendar-header.
     */
    _insertHeaderIntoCalendarWrapper() {
        this.calendarHeaderTitle.textContent = `${this.listOfAllMonthsAsText[this.month]} - ${this.year}`;
        this.calendarHeader.appendChild(this.calendarHeaderTitle);
        this.calendarWrapper.appendChild(this.calendarHeader);
    }

    /**
     * @description Inserts the calendar-grid header with all the weekdays.
     */
    _insertCalendarGridDaysHeader() {
        this.listOfAllDaysAsText.forEach(day => {
            const dayElement = document.createElement('span');
            dayElement.textContent = day;
            this.calendarGridDays.appendChild(dayElement);
        })

        this.calendarElement.appendChild(this.calendarGridDays);
    }

    /**
     * @description Adds the "Previous" and "Next" arrows on the side-navigation.
     * Also inits the click-events used to navigating.
     */
    _insertNavigationButtons() {
        // Ugly long string, but at least the svg is pretty.
        this.previousMonthArrow.setAttribute('aria-label', 'Go to previous month');
        this.nextMonthArrow.setAttribute('aria-label', 'Go to next month');
        this.previousMonthArrowHorizontal.setAttribute('aria-label', 'Go to previous month');
        this.nextMonthArrowHorizontal.setAttribute('aria-label', 'Go to next month');

        this.navigationWrapper.addEventListener('click', (clickEvent) => {
            if (clickEvent.target.closest(`#${this.previousMonthArrow.id}`)) {
                if (this.month === 0) {
                    this.month = 11;
                    this.year -= 1;
                } else {
                    this.month -= 1;
                }
                this._updateCalendar();
            }

            if (clickEvent.target.closest(`#${this.nextMonthArrow.id}`)) {
                if (this.month === 11) {
                    this.month = 0;
                    this.year += 1;
                } else {
                    this.month += 1;
                }
                this._updateCalendar();
            }
        }, false)
        this.navigationWrapperHorizontal.addEventListener('click', (clickEvent) => {
            if (clickEvent.target.closest(`#${this.previousMonthArrowHorizontal.id}`)) {
                if (this.month === 0) {
                    this.month = 11;
                    this.year -= 1;
                } else {
                    this.month -= 1;
                }
                this._updateCalendar();
            }

            if (clickEvent.target.closest(`#${this.nextMonthArrowHorizontal.id}`)) {
                if (this.month === 11) {
                    this.month = 0;
                    this.year += 1;
                } else {
                    this.month += 1;
                }
                this._updateCalendar();
            }
        }, false)
    }

    /**
     * @description Adds all the days for current month into the calendar-grid.
     * Takes into account which day the month starts on, so that "empty/placeholder" days can be added
     * in case the month for example starts on a Thursday.
     * Also disables the days that are not within the provided.
     */
    _insertDaysIntoGrid() {
        this.calendarGrid.innerHTML = '';

        let arrayOfDays = this._getDaysInMonth(this.month, this.year);
        let firstDayOfMonth = arrayOfDays[0].getDay();

        // Converting Sunday (0 when using getDay()) to 7 to make it easier to work with.
        firstDayOfMonth = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

        if (1 < firstDayOfMonth) {
            arrayOfDays = Array(firstDayOfMonth - 1).fill(false, 0).concat(arrayOfDays);
        }

        arrayOfDays.forEach(date => {
            const dateElement = document.createElement(date ? this.calendarDayElementType : 'span');
            const [Day, Month, Date, Year] = date.toString().split(' ');

            const dateIsTheCurrentValue = this.value.toString() === date.toString();
            if (dateIsTheCurrentValue) this.activeDateElement = dateElement;

            const dateIsBetweenAllowedRange = (this.min || this.max) && (date.toString() !== this.today.toString() && (date < this.min || date > this.max))
            if (dateIsBetweenAllowedRange) {
                dateElement.classList.add('disabled');
            } else {
                dateElement.tabIndex = 0;
                dateElement.value = date;
            }

            dateElement.textContent = date ? `${Date}` : '';
            this.calendarGrid.appendChild(dateElement);
        })

        this.calendarElement.appendChild(this.calendarGrid);
        this.activeDateElement.classList.add('selected');
    }

    /**
     * @description Updates the core-values for the calendar based on the new month and year
     * given by the navigation. Also updates the UI with the new values.
     */
    _updateCalendar() {
        this.date = new Date(this.year, this.month);

        [this.dayAsText, this.monthAsText, this.dateAsText, this.yearAsText] = this.date.toString().split(' ');
        this.day = this.date.getDay();
        this.month = this.date.getMonth();
        this.year = this.date.getFullYear();

        window.requestAnimationFrame(() => {
            this.calendarHeaderTitle.textContent = `${this.listOfAllMonthsAsText[this.month]} - ${this.year}`;
            this._insertDaysIntoGrid();
            runScriptOnUpdate();
        })

        const runScriptOnUpdate = () => {
            let month = this.month;
            var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
            let times = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]
            let days = document.querySelectorAll("time");
            let currentDay;
            let ridlektionerFärg = "rgb(219 96 96 / 35%)";
            let öppenRidningFärg = "rgb(15 255 36 / 15%)";
            const createTimes = () => {
                for (let j = 0; j < times.length - 1; j++) {
                    let option = document.createElement("a");
                    option.classList.add("option-item");
                    option.classList.add("list-group-item");
                    option.classList.add("list-group-item-action");
                    option.classList.add("list-group-item-light");
                    option.innerHTML = times[j];
                    option.innerHTML += "-" + times[j + 1];
                    $("#sel1").append(option);
                }
                addClickToOptions();
            }

            function addClickToOptions() {
                let options = document.querySelectorAll(".option-item");
                options.forEach(option => {
                    option.addEventListener("click", function() {
                        unToggleAll(options);
                        if (!this.classList.contains("disabled")) {
                            this.classList.toggle("selected");
                        }
                    })
                });
            }

            const unToggleAll = (elements) => {
                elements.forEach(el => {
                    el.classList.remove("selected");
                })
            }


            days.forEach(function(d) {
                d.addEventListener("click", function() {
                    if (!d.classList.contains("disabled")) {
                        $('#myModal').modal('show');
                        $('#modal-title').text(this.value.toDateString());
                        let day = this.value.toString().split(" ")[2].replace(/^0+/, '');
                        currentDay = day;
                        createTimes($('#sel1'));
                        hämtaTider();
                        changeTimes(currentDay);
                        hämtaBokadeTider(currentDay);
                    }
                });
            });

            function matchStartTimes(time1, time2) {
                return time1.split("-")[0] == time2.split("-")[0];
            }

            function matchEndTimes(time1, time2) {
                return time1.split("-")[1] == time2.split("-")[1];
            }

            hämtaTider();

            jQuery.ajax({
                url: '../php/get_bokade_tider.php', // give complete url here'
                type: "GET",
                success: function(data) {
                    var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
                    jQuery(myArray).each(function(index, element) {
                        for (let i = 0; i < days.length; i++) {
                            console.log(element.dag.split(" ")[1] && month + " " + months.indexOf(element.dag.split(" ")[0]))
                            if (days[i].innerHTML.replace(/^0+/, '') == element.dag.split(" ")[1] && month == months.indexOf(element.dag.split(" ")[0])) {
                                if (!days[i].classList.contains("öppenRidbana") && !days[i].classList.contains("ridlektion")) {
                                    days[i].style.background = "rgb(208 151 151)";
                                }
                            }
                        }
                    });
                },
                error: function(err) {
                    console.log(err);
                }
            });

            function hämtaTider(select) {
                jQuery.ajax({
                    url: '../php/get_tid.php', // give complete url here'
                    type: "GET",
                    success: function(data) {
                        var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
                        jQuery(myArray).each(function(index, element) {
                            for (let i = 0; i < days.length; i++) {
                                if (days[i].innerHTML == element.dag.split("-")[2] && month == element.dag.split("-")[1].replace(/[^1-9.]/g, "") - 1) {
                                    if (element.kategori == "Öppen ridning") {
                                        days[i].classList.add("öppenRidbana");
                                        days[i].style.color = "white";
                                    } else if (element.kategori == "Ridlektioner") {
                                        days[i].classList.add("ridlektion");
                                        days[i].style.color = "white";
                                    }
                                }
                            }
                        });
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }

            function hämtaBokadeTider(day) {
                let options = document.querySelectorAll(".option-item");
                jQuery.ajax({
                    url: '../php/get_bokade_tider.php', // give complete url here'
                    type: "GET",
                    success: function(data) {
                        var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
                        jQuery(myArray).each(function(index, element) {
                            if (day == element.dag.split(" ")[1] && month == months.indexOf(element.dag.split(" ")[0])) {
                                for (let i = 0; i < options.length; i++) {
                                    if (options[i].innerHTML == element.tid) {
                                        options[i].classList.add("ridlektion");
                                        options[i].classList.add("disabled");
                                        options[i].innerHTML += " - Bokad av " + element.namn;
                                    }
                                }
                            }
                        });
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
            const changeTimes = (day) => {
                if (document.querySelectorAll(".option-item").length > 0) {
                    let start;
                    let end;
                    let options = document.querySelectorAll(".option-item");
                    jQuery.ajax({
                        url: '../php/get_tid.php', // give complete url here'
                        type: "GET",
                        success: function(data) {
                            var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
                            jQuery(myArray).each(function(index, element) {
                                if (element.dag.split("-")[2] == day && month == element.dag.split("-")[1].replace(/[^1-9.]/g, "") - 1) {
                                    switch (element.kategori) {
                                        case "Öppen ridning":
                                            /*
                                            
                                            Funktionen kollar efter start och slut tid, är sluttiden uppbokad så
                                            fungerar inte funktionen, då options[i].innerHTML blir "- Bokad av blabla"
        
                                            */
                                            for (let i = 0; i < options.length; i++) {
                                                if (matchStartTimes(options[i].innerHTML, element.tid)) {
                                                    start = i;
                                                }
                                                if (matchEndTimes(options[i].innerHTML, element.tid)) {
                                                    end = i;
                                                }
                                            }
                                            for (let i = start; i < end + 1; i++) {
                                                options[i].classList.add("öppenRidbana");
                                            }
                                            break;
                                        case "Ridlektioner":
                                            for (let i = 0; i < options.length; i++) {
                                                if (matchStartTimes(options[i].innerHTML, element.tid)) {
                                                    start = i;
                                                }
                                                if (matchEndTimes(options[i].innerHTML, element.tid)) {
                                                    end = i;
                                                }
                                            }
                                            for (let i = start; i < end + 1; i++) {
                                                options[i].classList.add("ridlektion");
                                                options[i].classList.add("disabled");
                                            }
                                            break;
                                    }
                                }
                            });
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });
                }
            }
        }
    }

    /**
     * @param {Function} callback
     * @description A "listener" that lets the user do something everytime the value changes.
     */
    onValueChange(callback) {
        if (this.callback) return this.callback(this.value);
        this.callback = callback;
    }
}