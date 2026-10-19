// Analog clock based on Bootstrap.
// Source entrypoint. `npm run build` writes dist/js/bootstrap-time.js
// and dist/js/bootstrap-time.min.js.

(function () {
  "use strict";

  var INNER_RADIUS = "4.6rem";
  var OUTER_RADIUS = "6.4rem";
  var LEFT = "M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z";
  var RIGHT = "M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z";

  function svg(path) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + path + '"></path></svg>';
  }

  function mount(field) {
    if (field.dataset.bsTime === "ready") return;
    field.dataset.bsTime = "ready";

    var host = field.closest(".form-control") || field;
    var picker = host.closest(".clock-picker");
    if (!picker) {
      picker = document.createElement("div");
      picker.className = "clock-picker";
      host.parentNode.insertBefore(picker, host);
      picker.append(host);
    }

    var widget = picker.querySelector(".clock-widget");
    if (!widget) {
      widget = document.createElement("div");
      widget.className = "clock-widget card bg-body-secondary";
      widget.hidden = true;
      widget.innerHTML =
        '<div class="clock-arrows">' +
          '<button class="btn btn-link clock-arrow clock-hour" type="button" aria-label="Uren">' + svg(LEFT) + "</button>" +
          '<button class="btn btn-link clock-arrow clock-minute" type="button" aria-label="Minuten">' + svg(RIGHT) + "</button>" +
        "</div>" +
        '<div class="clock position-relative mx-auto bg-body-tertiary" role="group" aria-label="Kies een uur"></div>';
      picker.append(widget);
    }

    var clock = widget.querySelector(".clock");
    var hourArrow = widget.querySelector(".clock-hour");
    var minuteArrow = widget.querySelector(".clock-minute");
    if (!clock || !hourArrow || !minuteArrow) return;

    var now = new Date();
    var initial = field.value
      ? field.value.split(":")
      : [now.getHours(), now.getMinutes()];
    var hour = Number(initial[0]) || 0;
    var minute = snapMinute(Number(initial[1]) || 0);
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

    function minuteStep() {
      var step = Number(field.getAttribute("step") || field.step);
      if (!step || step < 60) step = 60;
      return Math.max(1, Math.round(step / 60));
    }

    function snapMinute(value) {
      var step = minuteStep();
      var snapped = Math.round(value / step) * step;
      return ((snapped % 60) + 60) % 60;
    }

    function allowedMinute(value) {
      return value % minuteStep() === 0;
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
      field.value = pad(hour) + ":" + pad(minute);
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
        var disabled = mode === "minute" && !allowedMinute(value);

        button.type = "button";
        button.className = "clock-number";
        button.textContent = value === 0 ? "00" : String(value);
        button.dataset.value = String(value);
        button.disabled = disabled;
        button.setAttribute("aria-pressed", !disabled && value === selected ? "true" : "false");
        button.style.setProperty("--angle", angle + "deg");
        button.style.setProperty("--radius", inner ? INNER_RADIUS : OUTER_RADIUS);
        button.addEventListener("click", function () {
          if (button.disabled) return;
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
      widget.hidden = false;
    }

    function hideWidget() {
      widget.hidden = true;
    }

    function valueFromPoint(event) {
      var rect = clock.getBoundingClientRect();
      var dx = event.clientX - (rect.left + rect.width / 2);
      var dy = event.clientY - (rect.top + rect.height / 2);
      var angle = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
      if (mode === "minute") return snapMinute(Math.round(angle / 6) % 60);
      var hour12 = Math.round(angle / 30) % 12;
      var inner = Math.hypot(dx, dy) < rect.width * 0.32;
      if (inner) return hour12 === 0 ? 0 : hour12 + 12;
      return hour12 === 0 ? 12 : hour12;
    }

    clock.addEventListener("click", function (event) {
      if (event.target.closest(".clock-number")) return;
      var value = valueFromPoint(event);
      if (mode === "minute") minute = value;
      else {
        hour = value;
        mode = "minute";
      }
      writeInput();
      updateArrows();
      renderClock();
    });

    hourArrow.addEventListener("click", function () {
      showMode("hour");
    });
    minuteArrow.addEventListener("click", function () {
      showMode("minute");
    });
    field.addEventListener("focus", showWidget);
    field.addEventListener("blur", hideWidget);
    field.addEventListener("input", function () {
      if (!field.value) return;
      var parts = field.value.split(":");
      var nextHour = Number(parts[0]);
      var nextMinute = Number(parts[1]);
      if (nextMinute !== minute) mode = "minute";
      else if (nextHour !== hour) mode = "hour";
      hour = nextHour;
      minute = nextMinute;
      updateArrows();
      renderClock();
    });
    picker.addEventListener("mousedown", function (event) {
      if (event.target === field) return;
      event.preventDefault();
    });
    document.addEventListener("mousedown", function (event) {
      if (picker.contains(event.target)) return;
      hideWidget();
    });

    function applyStep() {
      minute = snapMinute(minute);
      field.value = pad(hour) + ":" + pad(minute);
      renderClock();
    }

    var stepDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "step");
    if (stepDescriptor && stepDescriptor.set) {
      Object.defineProperty(field, "step", {
        configurable: true,
        get: function () {
          return stepDescriptor.get.call(field);
        },
        set: function (value) {
          stepDescriptor.set.call(field, value);
          applyStep();
        }
      });
    }
    new MutationObserver(applyStep).observe(field, {
      attributes: true,
      attributeFilter: ["step"]
    });

    updateArrows();
    if (!field.value) field.value = pad(hour) + ":" + pad(minute);
    renderClock();
    hideWidget();
  }

  function init() {
    document.querySelectorAll(".bs-time").forEach(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
