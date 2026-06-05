---
date: '2026-06-05T20:01:52+02:00'
draft: false
title: 'My first post'
tags: ["hugo", "papermod", "abap", "blog"]
categories: ["General"]
ShowToc: true
---

## Welcome 👋

This is my first post built with **Hugo** and the **PaperMod** theme. As a demo
I'm showing how **ABAP code** can be rendered with syntax highlighting.

## Classic "Hello World" in ABAP

```abap
REPORT z_hello_world.

START-OF-SELECTION.
  WRITE: / 'Hello, World!'.
```

## ABAP Objects: a class with a method

```abap
CLASS zcl_greeter DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    METHODS:
      constructor IMPORTING iv_name TYPE string,
      greet       RETURNING VALUE(rv_text) TYPE string.

  PRIVATE SECTION.
    DATA mv_name TYPE string.
ENDCLASS.

CLASS zcl_greeter IMPLEMENTATION.
  METHOD constructor.
    mv_name = iv_name.
  ENDMETHOD.

  METHOD greet.
    rv_text = |Hello { mv_name }, welcome to the blog!|.
  ENDMETHOD.
ENDCLASS.
```

## Modern ABAP syntax (7.40+)

```abap
DATA(lt_numbers) = VALUE int4_table( ( 1 ) ( 2 ) ( 3 ) ( 4 ) ( 5 ) ).

DATA(lv_sum) = REDUCE i(
  INIT x = 0
  FOR n IN lt_numbers
  NEXT x = x + n ).

cl_demo_output=>display( |Sum: { lv_sum }| ).
```

## SELECT with inline declaration

```abap
SELECT carrid, connid, cityfrom, cityto
  FROM spfli
  INTO TABLE @DATA(lt_flights)
  WHERE carrid = 'LH'.

LOOP AT lt_flights INTO DATA(ls_flight).
  WRITE: / ls_flight-carrid, ls_flight-connid,
           ls_flight-cityfrom, '->', ls_flight-cityto.
ENDLOOP.
```

## Exception handling

```abap
TRY.
    DATA(lo_greeter) = NEW zcl_greeter( iv_name = 'Mario' ).
    WRITE / lo_greeter->greet( ).
  CATCH cx_root INTO DATA(lx_root).
    WRITE / lx_root->get_text( ).
ENDTRY.
```

Happy blogging!
