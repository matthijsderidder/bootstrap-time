// Analog clock based on Bootstrap.
// Source entrypoint. `npm run build` writes dist/js/bootstrap-time.js
// and dist/js/bootstrap-time.min.js.

(function () {
  "use strict";

  var INNER_RADIUS = "4.6rem";
  var OUTER_RADIUS = "6.4rem";

  function init() {
    var picker = document.querySelector(".clock-picker");
    var clock = document.querySelector("#clock");
    var widget = document.querySelector("#clock-widget");
    var timeInput = document.querySelector("#time-input");
    var hourArrow = document.querySelector("#hour-arrow");
    var minuteArrow = document.querySelector("#minute-arrow");
    var clockToggle = document.querySelector("#clock-toggle");
    if (!clock || !timeInput || !hourArrow || !minuteArrow) return;

    var now = new Date();
    var initial = timeInput.value
      ? timeInput.value.split(":")
      : [now.getHours(), now.getMinutes()];
    var hour = Number(initial[0]) || 0;
    var minute = Number(initial[1]) || 0;
    var mode = "hour";
    var handAngle = 150;
    var hand = document.createElement("div");
    var knob = document.createElement("span");

    hand.className = "clock-hand bg-primary";
    knob.className = "clock-knob bg-primary";
    knob.setAttribute("aria-hidden", "true");
    hand.append(knob);
    clock.append(hand);

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function targetAngle() {
      return mode === "hour" ? (hour % 12) * 30 : minute * 6;
    }

    function handLength() {
      var innerHour = hour === 0 || hour > 12;
      return mode === "hour" && innerHour ? INNER_RADIUS : OUTER_RADIUS;
    }

    function moveHand() {
      var target = targetAngle();
      var delta = ((target - handAngle) % 360 + 540) % 360 - 180;
      handAngle += delta;
      hand.style.setProperty("--angle", handAngle + "deg");
      hand.style.setProperty("--hand", handLength());
    }

    function updateArrows() {
      hourArrow.disabled = mode === "hour";
      minuteArrow.disabled = mode === "minute";
    }

    function writeInput() {
      timeInput.value = pad(hour) + ":" + pad(minute);
    }

    function showMode(nextMode) {
      if (mode === nextMode) return;
      mode = nextMode;
      updateArrows();
      renderClock();
    }

    function renderClock() {
      clock.querySelectorAll(".clock-number").forEach(function (node) {
        node.remove();
      });
      clock.setAttribute("aria-label", mode === "hour" ? "Kies een uur" : "Kies de minuten");

      var numbers = mode === "hour"
        ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
        : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      var selected = mode === "hour" ? hour : minute;
      moveHand();

      numbers.forEach(function (value, index) {
        var button = document.createElement("button");
        var inner = mode === "hour" && index >= 12;
        var angle = (mode === "hour" ? index % 12 : index) * 30;

        button.type = "button";
        button.className = "clock-number";
        button.textContent = mode === "hour" && value === 0 ? "00" : String(value);
        button.setAttribute("aria-pressed", value === selected ? "true" : "false");
        button.style.setProperty("--angle", angle + "deg");
        button.style.setProperty("--radius", inner ? INNER_RADIUS : OUTER_RADIUS);
        button.addEventListener("click", function () {
          if (mode === "hour") {
            hour = value;
            mode = "minute";
          } else {
            minute = value;
          }
          writeInput();
          updateArrows();
          renderClock();
        });
        clock.append(button);
      });
    }

    function showWidget() {
      if (!widget) return;
      widget.hidden = false;
      if (clockToggle) clockToggle.setAttribute("aria-pressed", "true");
    }

    function hideWidget() {
      if (!widget) return;
      widget.hidden = true;
      if (clockToggle) clockToggle.setAttribute("aria-pressed", "false");
    }

    function toggleWidget() {
      if (widget && widget.hidden) showWidget();
      else hideWidget();
    }

    hourArrow.addEventListener("click", function () {
      showMode("hour");
    });
    minuteArrow.addEventListener("click", function () {
      showMode("minute");
    });
    if (clockToggle) {
      clockToggle.addEventListener("click", toggleWidget);
    }
    timeInput.addEventListener("focus", showWidget);
    timeInput.addEventListener("input", function () {
      if (!timeInput.value) return;
      var parts = timeInput.value.split(":");
      var nextHour = Number(parts[0]);
      var nextMinute = Number(parts[1]);
      if (nextMinute !== minute) mode = "minute";
      else if (nextHour !== hour) mode = "hour";
      hour = nextHour;
      minute = nextMinute;
      updateArrows();
      renderClock();
    });
    if (picker) {
      picker.addEventListener("mousedown", function (event) {
        if (event.target === timeInput) return;
        if (clockToggle && clockToggle.contains(event.target)) return;
        event.preventDefault();
      });
    }
    document.addEventListener("mousedown", function (event) {
      if (!picker || picker.contains(event.target)) return;
      hideWidget();
    });

    updateArrows();
    writeInput();
    renderClock();
    hideWidget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
