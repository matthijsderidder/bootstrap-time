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
npm install bootstrap-time
```

Or load the published files from jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.2/font/bootstrap-icons.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-time@0.1.5-beta/dist/css/bootstrap-time.min.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap-time@0.1.5-beta/dist/js/bootstrap-time.min.js"></script>
```

Local builds use the same paths under `dist/`:

```html
<link rel="stylesheet" href="dist/css/bootstrap-time.min.css">
<script src="dist/js/bootstrap-time.min.js"></script>
```

The script initializes the clock when `.clock-picker`, `#clock`, `#time-input`, `#hour-arrow` and `#minute-arrow` are present. The widget overlays the form under the time input. See `examples/bootstrap-time.html`.

## Changelog

### 0.1.5-beta

- Release title uses `<version>-beta`.

### 0.1.4-beta

- Bootstrap 6 is a dependency.

### 0.1.3-beta

- Added a version changelog to the README.

### 0.1.2-beta

- Published as a beta. It does not replace the `latest` tag.
- Prerelease publishes use their npm dist-tag.

### 0.1.1

- Published release after the repository reset.

### 0.1.0

- Initial release.
- Analog clock under a time input, with a clock icon.
- Hour and minute arrows. The hand follows hour and minute changes.
- Hand and selection knob use Bootstrap primary.
- Widget uses `theme-secondary theme-subtle`. The clock face uses `theme-inverse theme-subtle`.
- Requires Bootstrap 6 for form adornments.
