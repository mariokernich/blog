---
title: "UI5 Has No Touch Controls — So I Built Them"
seoTitle: "Touch Controls for UI5 and SAPUI5"
description: "sap.m is made for mouse and keyboard. ui5.touch.controls rebuilds the most important controls for touch as a drop-in replacement — plus an on-screen keyboard, barcode input and signature pad."
date: 2026-11-06
draft: false
tags: ["UI5", "SAPUI5", "OpenUI5", "touch", "controls", "TypeScript", "open-source"]
categories: ["UI5"]
ShowToc: true
cover:
  image: "thumbnail.png"
  alt: "Overview of the ui5.touch.controls library in a UI5 application"
  caption: "Standard UI5 controls, rebuilt for touch"
  hiddenInSingle: false
---

<!-- TODO(Mario): add a personal hook here — the project / customer situation where you first ran into this. -->

Picture a terminal on the shop floor. A worker in safety gloves wants to confirm a goods receipt. The screen is a 15-inch touch panel, there is no mouse and no keyboard — and the app on it is a perfectly normal UI5 app.

What happens next is something every UI5 developer who has built for the shop floor knows: the worker taps next to the button. Taps again. Hits the neighbouring button instead. The check box is a tiny square that needs a fingertip with surgical precision. And the moment a text field gets the focus, the question comes up: *where am I supposed to type?*

## The Problem: `sap.m` Is Built for Mouse and Keyboard

UI5 calls itself responsive, and it is — the **layout** adapts beautifully from phone to desktop. But the **controls** themselves are designed for an office user with a mouse, a keyboard and a monitor at arm's length.

UI5 does have an answer for touch: the **content density**. *Compact* is meant for mouse and keyboard, *cozy* for touch devices. But cozy is designed for a phone in your hand — not for an industrial terminal, a kiosk, or a tablet mounted on a forklift and operated with gloves. And cozy is exactly **one** step. There is nothing above it.

So what are the usual options?

- **CSS overrides** for `.sapMBtn`, `.sapMCb`, `.sapMSwt` and friends. Works — until the next UI5 update changes the DOM, or the next theme changes the paddings.
- **Scaling the whole page** via `zoom` or `transform`. Everything gets bigger, including the things that should not, and popovers end up in the wrong place.
- **Building your own controls** — in every project, again and again.

And some controls simply cannot be fixed with CSS at all. `sap.m.Switch` is fixed at 4rem × 2rem. The native list of `sap.m.Select` keeps its standard row height no matter how big the field is. `sap.m.TimePicker` uses a slider that has to be *dragged*. And for some things, there is no control in the first place: OpenUI5 does not ship an **on-screen keyboard**.

## The Solution: ui5.touch.controls

Since I kept running into this, I packaged the solution into a UI5 library:

[**→ GitHub Repository: ui5-touch-controls**](https://github.com/mariokernich/ui5-touch-controls)

[**→ Live Demo & Documentation**](https://mariokernich.github.io/ui5-touch-controls/test-resources/ui5/touch/controls/index.html)

The library does two things:

1. **It rebuilds the most important `sap.m` controls** on their original structure and opens them up for sizing through **one central `size` property** that works the same way on every control.
2. **It adds the controls `sap.m` is missing** — for situations that only come up on touch devices: an on-screen keyboard, a barcode input, a signature pad.

It runs on **OpenUI5 and SAPUI5 from 1.102 upwards**, is written in TypeScript and published on npm as [`ui5.touch.controls`](https://www.npmjs.com/package/ui5.touch.controls).

---

## Drop-in Replacement: Add `tc:`, Set a Size

The most important design goal: **you don't have to rebuild your app.** The touch controls keep the properties, aggregations and events of their originals for the common cases. So migrating a view means three things — add the namespace, put `tc:` in front of the control, set a size.

Here is a standard footer:

```xml
<Page title="Order">
	<footer>
		<OverflowToolbar>
			<Button text="Save" type="Emphasized" icon="sap-icon://save" press=".onSave" />
			<Button text="Cancel" icon="sap-icon://decline" press=".onCancel" />
			<ToolbarSpacer />
			<Button text="Approve" type="Accept" icon="sap-icon://accept" press=".onApprove" />
		</OverflowToolbar>
	</footer>
</Page>
```

And the touch version:

```xml
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls">
	<Page title="Order">
		<footer>
			<tc:OverflowToolbar size="XL">
				<tc:Button text="Save" type="Emphasized" icon="sap-icon://save" size="XL" press=".onSave" />
				<tc:Button text="Cancel" icon="sap-icon://decline" size="XL" press=".onCancel" />
				<ToolbarSpacer />
				<tc:Button text="Approve" type="Accept" icon="sap-icon://accept" size="XL" press=".onApprove" />
			</tc:OverflowToolbar>
		</footer>
	</Page>
</mvc:View>
```

Same aggregations, same properties, same event handlers — `press=".onSave"` still calls the same method in your controller. Standard controls like `ToolbarSpacer` stay exactly where they are, and everything that does not fit moves behind the overflow button, just like in `sap.m`.

{{< figure src="overflowtoolbar.png" alt="Touch-sized OverflowToolbar with the overflow popover opened" caption="tc:OverflowToolbar with size XL and its overflow popover" >}}

### One Size Property to Rule Them All

Every control has the same `size` property with nine steps:

`S` · `M` (default) · `L` · `XL` · `2XL` · `3XL` · `4XL` · `5XL` · `6XL`

The size scales font, icon, padding and height **together**, so the controls stay proportional at every step. A check box doesn't just get a bigger box — the check mark, the label and the hit area grow with it.

Because it is a normal property, you can bind it. One model value, and the whole app switches between "office" and "gloves":

```xml
<tc:Button text="Save" size="{settings>/touchSize}" press=".onSave" />
```

All sized controls also implement the marker interface `ui5.touch.controls.ISized`, so you can handle them generically — for example to apply a user setting to a whole view:

```ts
if (control.isA<ISized>("ui5.touch.controls.ISized")) {
	control.setSize(SizeMode.XL);
}
```

### What's Included

The library currently ships touch versions of these `sap.m` controls:

| Touch control | Replaces |
| --- | --- |
| `tc:Button`, `tc:SegmentedButton` | `sap.m.Button`, `sap.m.SegmentedButton` |
| `tc:CheckBox`, `tc:RadioButton(Group)`, `tc:Switch` | `sap.m.CheckBox`, `sap.m.RadioButton(Group)`, `sap.m.Switch` |
| `tc:Input`, `tc:TextArea`, `tc:StepInput` | `sap.m.Input`, `sap.m.TextArea`, `sap.m.StepInput` |
| `tc:Select`, `tc:ComboBox` | `sap.m.Select`, `sap.m.ComboBox` |
| `tc:DatePicker`, `tc:TimePicker` | `sap.m.DatePicker`, `sap.m.TimePicker` |
| `tc:Text`, `tc:Link` | `sap.m.Text`, `sap.m.Link` |
| `tc:Toolbar`, `tc:OverflowToolbar` | `sap.m.Toolbar`, `sap.m.OverflowToolbar` |
| `QuickDialog` | `sap.m.MessageBox` |

A few of them are more than a bigger version of the original. `tc:DatePicker` brings its own calendar where a day is a square that grows with `size`, instead of the fixed grid of `sap.ui.unified.Calendar`. `tc:TimePicker` replaces the slider with two columns of buttons — one tap for the hour, one for the minute. And `tc:Select` opens a list whose rows are as big as the field itself.

---

## The Controls `sap.m` Is Missing

### On-Screen Keyboards

On a terminal there is often no hardware keyboard — and the on-screen keyboard of the operating system is either not available, or it covers half the screen. UI5 has no control for this, so the library brings three, built from its own buttons and without any third-party dependency:

| Control | What it is |
| --- | --- |
| `tc:Keyboard` | Letters in the arrangement of a country — QWERTY, QWERTZ, AZERTY and more, twelve languages in total |
| `tc:NumberPad` | Digits in a computer, phone or calculator layout |
| `tc:CustomKeyboard` | Your own keys, row by row — including multiple sets that switch between each other |

{{< figure src="keyboard.png" alt="On-screen keyboard with an English QWERTY layout" caption="tc:Keyboard in English mode" >}}

The keyboard can sit directly on the page, be **docked** to the bottom edge of the screen like on a phone, or live inside a field. Put it into the `keyboard` aggregation of a `tc:Input`, and it opens in a popover while the field has the focus:

```xml
<tc:Input value="{/quantity}" size="XL" showKeyboard="true">
	<tc:keyboard>
		<tc:NumberPad size="XL" mode="Simple" showDecimalSeparator="true" />
	</tc:keyboard>
</tc:Input>
```

{{< figure src="keyboard-aggregation.png" alt="Input field with an attached on-screen keyboard in a popover" caption="A keyboard in the keyboard aggregation of tc:Input" >}}

The keyboard types into the field and fires `liveChange`, `change` and `submit` exactly as a user typing would — so your existing event handlers just keep working. With `hardwareKeys="true"` it additionally accepts input from a real keyboard, which helps when the same app runs both on a terminal and on a desktop.

### Barcode Input

In a warehouse, most input doesn't come from a keyboard at all, but from a barcode scanner in keyboard wedge mode. It "types" the code into the focused field within a few milliseconds and finishes with <kbd>Enter</kbd>. A normal input can't tell that apart from a person typing.

`tc:BarcodeInput` measures the time between the keystrokes. A fast run closed by <kbd>Enter</kbd> fires `scan`, everything else is manual input and fires `change`:

```xml
<tc:BarcodeInput
	value="{/code}"
	placeholder="Scan a pallet..."
	size="XL"
	clearOnScan="true"
	scan=".onScan"
	change=".onManualEntry" />
```

So a scanned code can go straight to the backend, while a typed one gets a confirmation first.

{{< figure src="barcode-input.png" alt="Barcode input field with a scan placeholder" caption="tc:BarcodeInput" >}}

### Signature Pad

Goods handover, repair confirmation, safety briefing — many processes on a tablet end with a signature. `tc:SignaturePad` draws on a canvas and puts the result as a PNG data URL into `value`, so it can be bound to a model and sent to the backend like any other field:

```xml
<tc:SignaturePad value="{/signature}" placeholder="Sign here" height="12rem" size="XL" />
```

{{< figure src="signature-pad.png" alt="Signature pad with a handwritten signature" caption="tc:SignaturePad" >}}

---

## Fits Right In: Themes and Standard Controls

Touch controls are worthless if they look like a foreign body in the app. That's why the library ships its own theme library and takes colours, borders and shadows from the **theme parameters** of the active theme. Supported out of the box: **Horizon** (incl. Dark and both High Contrast variants) and **Fiori 3** (Quartz Light and Dark).

The controls also work inside standard containers — a `tc:Button` in a `sap.m.Table` cell, or a `tc:OverflowToolbar` in the footer of a `sap.m.Dialog`:

{{< figure src="dialog.png" alt="sap.m.Dialog with a touch-sized footer toolbar" caption="A touch toolbar in the footer of a standard sap.m.Dialog" >}}

{{< alert type="warning" title="Aggregations typed to sap.m.Button" >}}
Some standard aggregations — most notably `buttons`, `beginButton` and `endButton` of `sap.m.Dialog` — only accept `sap.m.Button`, so UI5 rejects a `tc:Button` there at runtime. Use the dialog's `footer` aggregation with a `tc:OverflowToolbar` instead. For simple message-box style dialogs, `QuickDialog` does exactly that for you.
{{< /alert >}}

---

## Tested Against Eight UI5 Releases

A library that is supposed to run in existing apps — some of them on older SAPUI5 releases — has to be tested on exactly those releases. The GitHub workflow runs the unit tests (QUnit) and the UI tests ([wdi5](https://ui5-community.github.io/wdi5/)) on **UI5 1.102, 1.108, 1.116, 1.120, 1.124, 1.130, 1.140 and the latest release** in parallel. Where a newer API exists, the library uses it; on older releases it falls back to the Core.

The test page also renders every touch control **side by side with its `sap.m` original**, so differences are visible at a glance.

---

## Getting Started

Install the package as a regular dependency:

```bash
npm install ui5.touch.controls
```

Add the library to your `manifest.json`:

```json
{
	"sap.ui5": {
		"dependencies": {
			"libs": {
				"ui5.touch.controls": {}
			}
		}
	}
}
```

Add the namespace to your view — and start replacing:

```xml
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls">
	<tc:Button text="Hello Touch" size="XL" />
</mvc:View>
```

For TypeScript projects, add `ui5.touch.controls` to the `types` in your `tsconfig.json` — the package ships its own type definitions. The [README](https://github.com/mariokernich/ui5-touch-controls#installation) covers the alternative setup via `ui5-middleware-servestatic` as well.

---

## Conclusion

UI5 is a great framework for business apps — as long as the user sits at a desk. As soon as the app moves to a tablet, a kiosk or a shop floor terminal, `sap.m` reaches its limits, and every project ends up building its own workarounds.

With **ui5.touch.controls**, that's no longer necessary: the familiar controls in touch size, a single `size` property for the whole app, and the controls that touch scenarios need on top — without rewriting a single controller.

Give it a try in the [live demo](https://mariokernich.github.io/ui5-touch-controls/test-resources/ui5/touch/controls/index.html), and if something is missing or doesn't work on your device, feel free to open an [issue](https://github.com/mariokernich/ui5-touch-controls/issues) or a pull request. And if the library helps you, a ⭐ on GitHub is always appreciated!

[**→ GitHub Repository: ui5-touch-controls**](https://github.com/mariokernich/ui5-touch-controls)
