# bootstrap-time

Analog clock based on Bootstrap.

The package is available on [npm](https://www.npmjs.com/package/bootstrap-time) and [jsDelivr](https://www.jsdelivr.com/package/npm/bootstrap-time).

## What's included

```
src/                         source
  js/bootstrap-time.js      script entrypoint
  scss/bootstrap-time.scss  style entrypoint
dist/                        generated, do not edit
  css/bootstrap-time.css
  css/bootstrap-time.min.css
  js/bootstrap-time.js
  js/bootstrap-time.min.js
examples/                    HTML that points at dist
```

`npm run build` compiles `src` into `dist`. Bootstrap 6 is required. The time field uses [form adornments](https://getbootstrap.com/docs/6.0/forms/form-adorn/), which Bootstrap 5.3 does not have. Bootstrap 5.3 can only place an addon beside the input with `input-group`, not inside it. The clock icon comes from bootstrap-icons.

## Usage

Install from npm:

```bash
npm install bootstrap-time bootstrap@6 bootstrap-icons
```

Or load the published files from jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.2/font/bootstrap-icons.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-time@0.1.0/dist/css/bootstrap-time.min.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap-time@0.1.0/dist/js/bootstrap-time.min.js"></script>
```

Local builds use the same paths under `dist/`:

```html
<link rel="stylesheet" href="dist/css/bootstrap-time.min.css">
<script src="dist/js/bootstrap-time.min.js"></script>
```

The script initializes the clock when `.clock-picker`, `#clock`, `#time-input`, `#hour-arrow` and `#minute-arrow` are present. The widget overlays the form under the time input. See `examples/bootstrap-time.html`.
