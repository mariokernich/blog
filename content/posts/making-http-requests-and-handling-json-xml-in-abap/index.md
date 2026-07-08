---
title: "Making HTTP Requests and Handling JSON & XML in ABAP"
seoTitle: "HTTP Requests, Headers, Cookies, JSON & XML Serialization in Modern ABAP"
description: "How do HTTP requests work in ABAP, and how can you serialize/deserialize JSON and XML? A beginner-friendly guide with the waiter analogy, cookies/headers explanations, and modern inline code examples."
date: 2026-06-30
draft: false
tags: ["ABAP", "HTTP", "JSON", "XML", "Clean Code", "Integration"]
categories: ["ABAP", "Web"]
ShowToc: true
mermaid: true
cover:
  image: "thumbnail.png"
  alt: "ABAP HTTP JSON XML Integration"
  caption: "Mastering Integration: HTTP, Headers, Cookies, and Data Formats in Modern ABAP"
  hiddenInSingle: false
---

In an interconnected enterprise runtime, SAP is no longer an isolated platform. Modern business processes rarely live inside a single system — they span many cloud services, external partners, and third-party tools. To make them work together, systems need to _talk_ to each other, and the language they use is **HTTP**.

### Why do we need HTTP calls?

Almost every service on the internet exposes its functionality through a **REST API** (a set of web addresses you can call over HTTP). This is fantastic for us as ABAP developers: if a system offers a REST API, we can connect to it directly from our ABAP code. And the two data formats these APIs speak are almost always **JSON** (the modern standard) or **XML** (the classic, still common in SAP-to-SAP and SOAP scenarios) — exactly the two formats we will learn to handle in this guide.

This becomes especially powerful on the **SAP Business Technology Platform (BTP)**. BTP is where companies **centrally bring everything together in the cloud** — connecting their S/4HANA backend, cloud services, and countless external systems in one place. HTTP calls are the glue that makes this central integration possible.

### Real-world business examples

Here are just a few things you could build with HTTP calls from ABAP:

- **Project management (Jira, Azure DevOps):** Automatically create a Jira ticket when a quality issue is posted in SAP, or update the SAP order status when a Jira issue is closed.
- **Communication (Microsoft Teams, Slack):** Send a Teams or Slack notification the moment a critical sales order or a failed payment is detected.
- **Finance & rates:** Fetch **real-time currency exchange rates** or stock prices from an external financial API.
- **Logistics (DHL, UPS):** Request live shipment tracking data and show it directly on the SAP sales order.
- **CRM & Marketing (Salesforce, HubSpot):** Keep customer data in sync between SAP and your CRM system.
- **AI services:** Send a text to an AI service (like translation or sentiment analysis) and process the JSON response.

But how do HTTP requests actually work? What are headers and cookies, and how do we manage them? And how can you easily convert ABAP data objects into JSON or XML (and vice versa)?

In this guide, we break these concepts down into simple, practical terms. We will start with an easy-to-understand **waiter analogy**, examine the role of headers and cookies, and dive straight into ready-to-use code examples utilizing modern ABAP and **inline declarations**.

{{< alert type="info" title="New to JSON or XML? Start here" >}}
We will send and receive a lot of **JSON** and **XML** below. If their syntax still looks unfamiliar, spend five minutes on the basic structure first — it makes everything that follows much easier to read:

- **JSON structure:** [json.org — the official reference](https://www.json.org/json-en.html) (objects, arrays, key-value pairs)
- **XML structure:** [W3Schools — XML introduction](https://www.w3schools.com/xml/xml_whatis.asp) (elements, tags, nesting)
  {{< /alert >}}

---

## 1. Deconstructing an HTTP Request (The Waiter Analogy)

To understand HTTP communication, imagine dining at a restaurant. There are four primary actors:

1. **The Guest (Client):** You (or your ABAP program) wanting to request something.
2. **The Order (Request):** Your message outlining what you want.
3. **The Waiter (HTTP Client):** The messenger carrying your order to the kitchen and bringing the food back.
4. **The Kitchen (Web Server / API):** The backend processing your request and preparing the response.

### Core Anatomy of a Request

Every HTTP request is made up of a few simple building blocks. Using our restaurant analogy, here is what each part means:

- **The URL (Endpoint Address):** The street address or table location that tells the waiter _where_ to deliver your order (e.g., `https://api.example.com/v1/products`).
- **The Method (The Verb):** The action you want to perform — get something, create something, change something, or delete something (see the table below).
- **The Headers (Extra Instructions):** Small notes attached to your order, such as "I only accept JSON" or "here is my membership card" (more on this in Section 2).
- **The Query Parameters (Filters):** Optional add-ons in the URL that refine your request, like _"only bring me desserts under 10€"_ (e.g., `?userId=1&status=open`).
- **The Body (The Payload):** The actual content you send along, for example the details of a new order. Usually only needed for `POST`, `PUT`, and `PATCH`.

### HTTP Methods (The Active Verbs)

To define what action we want the server to perform, we use specific HTTP methods. Here is how they map to our restaurant analogy and database operations:

| HTTP Method         | Restaurant Analogy                                | Database Action (CRUD) | Description                                                                   |
| :------------------ | :------------------------------------------------ | :--------------------- | :---------------------------------------------------------------------------- |
| **`GET`**           | "Bring me the menu" or "Serve the soup"           | Read (Retrieve)        | Fetches existing resource details from the server without modifying anything. |
| **`POST`**          | "Place a new custom order"                        | Create (Insert)        | Submits new data payloads to the server to create a brand new resource.       |
| **`PUT` / `PATCH`** | "Replace my steak with fish" / "Add extra pepper" | Update (Modify)        | Overwrites a resource entirely (`PUT`) or updates specific fields (`PATCH`).  |
| **`DELETE`**        | "Cancel my order" / "Take away the empty plate"   | Delete (Remove)        | Permanently deletes a specific resource from the server.                      |

This entire interaction is mapped in the **Mermaid sequence diagram** below:

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Guest (ABAP Client)
    participant Waiter as Waiter (HTTP Client)
    participant Kitchen as Kitchen (Web Server)

    Note over Guest,Kitchen: The HTTP Request-Response Lifecycle

    Guest->>Waiter: 1. Place order (HTTP Method, URL, Headers, Body)
    activate Waiter
    Waiter->>Kitchen: 2. Carry order to kitchen (Send Request)
    activate Kitchen
    Note over Kitchen: Process payload,<br/>Query DB, Compute
    Kitchen-->>Waiter: 3. Return prepared dish (HTTP Response: Status 200 + Payload)
    deactivate Kitchen
    Waiter-->>Guest: 4. Deliver dish to table (Receive & process response)
    deactivate Waiter
```

---

## 2. Understanding Headers and Cookies

When communicating over HTTP, the request and response do not just consist of raw payloads. They also contain metadata: **Headers** and **Cookies**.

### What are HTTP Headers?

Headers are **key-value pairs** sent in both requests and responses. Think of request headers as your "special dining instructions" or "ID verification" when placing an order:

- **`Accept: application/json`**: Telling the kitchen, _"I only understand JSON. Please serve my data format accordingly."_
- **`Content-Type: application/json; charset=utf-8`**: Telling the kitchen, _"The payload body I am handing over is written in UTF-8-encoded JSON."_
- **`Authorization: Bearer <token>`**: Your exclusive membership card allowing you access to VIP dining areas.

### What are Cookies?

Cookies are small pieces of stateful data that a server sends to your client via a response header (`Set-Cookie`). Your client then stores them and automatically attaches them to subsequent outgoing requests (`Cookie` header).

Think of cookies as a physical **cloakroom ticket** the restaurant hands you on your first visit:

- On your response, the waiter says: _"Keep this ticket locally."_ (`Set-Cookie: session_id=XYZ123`)
- On your next request, you automatically show that ticket back to the waiter: _"Remember me? Here is my ticket."_ (`Cookie: session_id=XYZ123`)
- This is crucial for **Session Management**, keeping track of logged-in states, or preserving user preferences across stateless HTTP calls.

---

## 3. Understanding Status Codes (Did the Order Work?)

After the kitchen processes your order, the waiter always comes back with a short status message telling you whether everything went fine. In HTTP, this message is a three-digit **status code**. As a beginner, you only need to remember the five families:

| Range     | Meaning         | Restaurant Analogy                    | Common Examples                                                         |
| :-------- | :-------------- | :------------------------------------ | :---------------------------------------------------------------------- |
| **`1xx`** | Informational   | "I'm working on it, please wait."     | `100 Continue`                                                          |
| **`2xx`** | Success ✅      | "Here is your dish, enjoy!"           | `200 OK`, `201 Created`, `204 No Content`                               |
| **`3xx`** | Redirection     | "That dish moved to another table."   | `301 Moved`, `304 Not Modified`                                         |
| **`4xx`** | Client Error ❌ | "_You_ made a mistake in your order." | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found` |
| **`5xx`** | Server Error 🔥 | "The _kitchen_ broke down."           | `500 Internal Server Error`, `503 Service Unavailable`                  |

{{< alert type="info" title="Rule of Thumb" >}}
A quick way to remember: **`2xx` = good news**, **`4xx` = your fault** (fix your request), **`5xx` = their fault** (the server has a problem). Always check the status code before trusting the response body!
{{< /alert >}}

---

## 4. Understanding Where to Send Requests (URLs vs. Destinations)

In the examples below we use `create_by_url( )` with a full URL. This is perfect for **learning and quick tests**. But in real projects, hard-coding URLs, users, and passwords into your code is a bad idea — if the endpoint changes, you would have to modify and re-transport your program.

Instead, SAP lets you store connection details (URL, authentication, certificates) **outside** your code in a reusable configuration:

- **On-Premise:** Use an **RFC Destination** (transaction `SM59`) and connect with `cl_http_destination_provider=>create_by_destination( )`.
- **SAP BTP / S/4HANA Cloud:** Use a **Communication Arrangement** and connect with `cl_http_destination_provider=>create_by_comm_arrangement( )`.

{{< alert type="info" title="Best Practice" >}}
Use `create_by_url( )` while experimenting, but switch to a **Destination** or **Communication Arrangement** for anything that goes to production. It keeps secrets out of your code and is fully Clean Core-compliant.
{{< /alert >}}

---

## 5. Try the API First: DummyJSON & Postman

Before we write a single line of ABAP, it pays to know **what our target looks like** and to **poke at it by hand**. Throughout this guide we call a free, public test API called **[DummyJSON](https://dummyjson.com)**.

DummyJSON is a fake REST API that serves realistic sample data — users, posts, carts, **products**, and **todos** — over HTTPS. It needs no sign-up and no API key, and its `add`/`update`/`delete` endpoints only _simulate_ writes: they return a proper response with a freshly generated `id` but never actually persist anything. That makes it perfect for safe experimentation. In this guide we mostly work with **todos**, but you can swap in **products** (or users, posts, …) the exact same way.

👉 Full endpoint list and response schemas: **[dummyjson.com/docs](https://dummyjson.com/docs)**

A single **todo** from DummyJSON looks like this:

```json
{
  "id": 1,
  "todo": "Do something nice for someone you care about",
  "completed": false,
  "userId": 26
}
```

The endpoints we will use below:

| Purpose              | Method | Endpoint                           |
| :------------------- | :----- | :--------------------------------- |
| Get all todos        | `GET`  | `https://dummyjson.com/todos`      |
| Get a single todo    | `GET`  | `https://dummyjson.com/todos/1`    |
| Create a todo        | `POST` | `https://dummyjson.com/todos/add`  |
| Get all products     | `GET`  | `https://dummyjson.com/products`   |
| Get a single product | `GET`  | `https://dummyjson.com/products/1` |

### Test it in Postman before writing any ABAP

When you integrate a new API, resist the urge to jump straight into ABAP. First fire the request by hand with a REST client like **[Postman](https://www.postman.com/downloads/)** — a free desktop app for sending HTTP requests and inspecting the raw response. This lets you confirm the URL, headers, and payload actually work _before_ you start debugging them inside SAP, where every round-trip is slower.

Trying our first call takes less than a minute:

1. Download and install [Postman](https://www.postman.com/downloads/) (free).
2. Set the method to `GET` and the URL to `https://dummyjson.com/todos`.
3. Hit **Send** and inspect the JSON that comes back.

![GET request to https://dummyjson.com/todos in Postman returning a 200 OK response with a todos array](postman-get-todos.png)

As the screenshot shows, Postman confirms a green **`200 OK`** status and pretty-prints the response body: an object with a `todos` array, where each entry has exactly the `id`, `todo`, `completed`, and `userId` fields we listed above. That is the same payload our ABAP code will receive — so once the request behaves here, translating it into ABAP (which we do next) is almost mechanical: you already know exactly what to send and what to expect back.

{{< alert type="info" title="Why test in Postman first?" >}}
Postman separates **"is the API working?"** from **"is my ABAP working?"**. If the call succeeds in Postman but fails in ABAP, the problem is on your side (headers, encoding, CSRF, certificates). If it fails in both, the problem is the request itself. That distinction saves hours of guessing.
{{< /alert >}}

---

## 6. Execution of HTTP Requests in ABAP

In modern ABAP instances (such as SAP S/4HANA Cloud or modern On-Premise systems), we use the `IF_WEB_HTTP_CLIENT` interface. It is the Clean Core-compliant successor to the legacy `CL_HTTP_CLIENT` class.

Here is an example demonstrating how to initialize a client, set headers, manage cookies, and retrieve a response:

```abap
TRY.
    " 1. Instantiate the HTTP Client (here with a direct URL for simplicity)
    DATA(lo_http_client) = cl_web_http_client_manager=>create_by_http_destination(
      cl_http_destination_provider=>create_by_url( 'https://dummyjson.com/todos/add' )
    ).

    " 2. Obtain the request object so we can configure it
    DATA(lo_request) = lo_http_client->get_http_request( ).

    " 3. Set HTTP Headers (our "extra instructions")
    lo_request->set_header_field( i_name = 'Accept'       i_value = 'application/json' ).
    lo_request->set_header_field( i_name = 'Content-Type' i_value = 'application/json' ).

    " 4. Add a query parameter -> results in ...?userId=1
    lo_request->set_query_parameter( name = 'userId' value = '1' ).

    " 5. Set a cookie (for state tracking / session handling)
    lo_request->set_cookie(
      i_name  = 'sap-user-context'
      i_value = 'language=EN&client=100'
    ).

    " 6. Set the request payload (JSON body)
    lo_request->set_text( `{"todo": "Learn modern ABAP HTTP", "completed": false, "userId": 1}` ).

    " 7. Execute the request using the POST method
    DATA(lo_response) = lo_http_client->execute( if_web_http_client=>post ).

    " 8. Evaluate the response status and payload
    DATA(ls_status)       = lo_response->get_status( ).
    DATA(lv_response_txt) = lo_response->get_text( ).

    IF ls_status-code = 201. " 201 = Created successfully
      cl_demo_output=>write( 'Successfully created new entry!' ).
      cl_demo_output=>write( lv_response_txt ).
    ELSE.
      cl_demo_output=>write( |Error: { ls_status-code } - { ls_status-reason }| ).
    ENDIF.

    " 9. Always close the connection when you are done
    lo_http_client->close( ).

  CATCH cx_web_http_client_error cx_http_dest_provider_error INTO DATA(lx_error).
    cl_demo_output=>write( |Exception caught: { lx_error->get_text( ) }| ).
ENDTRY.
cl_demo_output=>display( ).
```

{{< alert type="info" title="Beginner Tip: Setting a Timeout" >}}
Network calls can hang forever if the other server is slow or unreachable. You can protect your program by setting a timeout **before** executing the request:

```abap
lo_http_client->set_timeout( 30 ). " wait at most 30 seconds
```

{{< /alert >}}

---

## 7. Authentication (Proving Who You Are)

Most real APIs will not talk to anonymous strangers — you must prove your identity, just like showing an ID card or membership card at the restaurant. Here are the three most common ways, all set via a simple header:

**1. Basic Authentication (username + password)**
The username and password are combined and Base64-encoded. ABAP can build this header for you:

```abap
DATA(lv_credentials) = cl_http_utility=>encode_base64( `myUser:myPassword` ).
lo_request->set_header_field(
  i_name  = 'Authorization'
  i_value = |Basic { lv_credentials }|
).
```

**2. Bearer Token / OAuth 2.0 (a temporary access token)**
Very common for cloud APIs. You send a token you received earlier from a login/token service:

```abap
lo_request->set_header_field(
  i_name  = 'Authorization'
  i_value = |Bearer eyJhbGciOiJIUzI1NiIsInR5c...|
).
```

**3. API Key (a simple secret key)**
Some APIs just want a secret key in a custom header:

```abap
lo_request->set_header_field( i_name = 'X-API-Key' i_value = 'my-secret-api-key' ).
```

{{< alert type="info" title="Security Tip" >}}
**Never** hard-code passwords or tokens in your source code! Store them in a **Destination** or **Communication Arrangement** (see Section 4). SAP then adds the authentication automatically, and your secrets stay out of the code and out of transports.
{{< /alert >}}

---

## 8. Working with SAP OData Services (The CSRF Token)

If you call an **SAP OData service** and want to **change** data (`POST`, `PUT`, `DELETE`), there is one extra step that trips up almost every beginner: the **CSRF token** (pronounced "sea-surf"). It is a security check that prevents malicious websites from performing actions on your behalf.

The rule is simple and always the same:

1. First, send a `GET` request with the special header `X-CSRF-Token: Fetch`. The server replies with a token.
2. Then, send your actual `POST`/`PUT`/`DELETE` request and include that token in the `X-CSRF-Token` header.

```abap
" STEP 1: Fetch the CSRF token with a harmless GET request
DATA(lo_request) = lo_http_client->get_http_request( ).
lo_request->set_header_field( i_name = 'X-CSRF-Token' i_value = 'Fetch' ).

DATA(lo_response) = lo_http_client->execute( if_web_http_client=>get ).

" Read the token the server sent back to us
DATA(lv_csrf_token) = lo_response->get_header_field( 'X-CSRF-Token' ).

" STEP 2: Reuse the SAME client and send the token back with our change request
lo_request->set_header_field( i_name = 'X-CSRF-Token' i_value = lv_csrf_token ).
lo_request->set_text( `{"MaterialId": "4711", "Description": "New Material"}` ).

DATA(lo_post_response) = lo_http_client->execute( if_web_http_client=>post ).
```

{{< alert type="info" title="Why does my POST return 403?" >}}
A `403 Forbidden` error on an SAP OData `POST`/`PUT`/`DELETE` is almost always a **missing or invalid CSRF token**. Make sure you fetch the token first **and reuse the same HTTP client** (so the session cookie stays intact), otherwise the token will be rejected.
{{< /alert >}}

{{< alert type="info" title="Providing REST APIs in ABAP Cloud & SAP BTP" >}}
So far we have focused on _consuming_ REST APIs. But what if you want to _expose_ your own data as a REST/OData service in a modern environment like **ABAP Cloud** or **SAP BTP**? In the **ABAP RESTful Application Programming Model (RAP)**, **custom CDS views (CDS entities)** are the go-to approach for building exactly these kinds of services.

👉 Learn how to build them in the dedicated guide: [Building Custom CDS Entities with Unmanaged Queries in ABAP RAP](/posts/custom-cds-views-with-unmanaged-queries-in-abap-rap)
{{< /alert >}}

---

## 9. Handling JSON Payloads (The Modern Standard)

JSON (_JavaScript Object Notation_) is the de-facto data serialization standard for modern API endpoints. ABAP makes parsing and creating JSON extremely seamless using `/UI2/CL_JSON` combined with **inline data declarations**.

### JSON Deserialization (JSON to ABAP)

Let's parse incoming JSON data directly into an inline-defined ABAP structure without pre-creating global dictionary structures:

```abap
" Raw JSON response (a todo from https://dummyjson.com/todos/1)
DATA(lv_json_string) = `{ "id": 1, "todo": "Buy groceries", "completed": false }`.

" Define target structure inline on the fly
DATA: BEGIN OF ls_todo,
        id        TYPE i,
        todo      TYPE string,
        completed TYPE abap_bool,
      END OF ls_todo.

" De-serialize
/UI2/CL_JSON=>deserialize(
  EXPORTING
    json        = lv_json_string
  CHANGING
    data        = ls_todo
).

" Display structural attributes
cl_demo_output=>write( |ID: { ls_todo-id }| ).
cl_demo_output=>write( |Todo: { ls_todo-todo }| ).
cl_demo_output=>write( |Completed: { ls_todo-completed }| ).
cl_demo_output=>display( ).
```

### JSON Serialization (ABAP to JSON)

Generating modern JSON structures out of internal ABAP objects is just as fast:

```abap
" Build data structure inline
DATA(ls_payload) = VALUE #(
  id        = 999
  todo      = 'Todo created via ABAP'
  completed = abap_true
).

" Serialize ABAP structure into formatted JSON
DATA(lv_json_output) = /UI2/CL_JSON=>serialize(
  data        = ls_payload
  compress    = abap_true
).

cl_demo_output=>write( lv_json_output ).
cl_demo_output=>display( ).
```

### Alternative for ABAP Cloud: the XCO Library

`/UI2/CL_JSON` is great and widely used, but it is **not released for ABAP Cloud** (e.g. on BTP or in S/4HANA Cloud Public Edition). There, SAP gives you the modern **XCO library** instead:

```abap
" Serialize an ABAP structure to JSON using XCO
DATA(lv_json) = xco_cp_json=>data->from_abap( ls_payload )->to_string( ).

" Deserialize JSON back into an ABAP structure
xco_cp_json=>data->from_string( lv_json )->write_to( REF #( ls_payload ) ).
```

{{< alert type="info" title="Which one should I use?" >}}
On a **classic On-Premise** system, `/UI2/CL_JSON` is perfectly fine and offers convenient options. In **ABAP Cloud**, use `XCO` — it is the officially released, Clean Core-compliant option.
{{< /alert >}}

---

## 10. Handling XML Payloads (The Standard Classic)

For older legacy platforms, SOAP-based systems, or explicit SAP-to-SAP background messaging, XML is the typical vehicle. We manipulate XML using ABAP's identity transformation: `CALL TRANSFORMATION id`.

### XML Deserialization (XML to ABAP)

We want to parse the following hierarchical XML into a structured ABAP record:

```xml
<post>
  <id>404</id>
  <title>XML Parsing</title>
</post>
```

We do this easily using an inline structure:

```abap
" Raw XML text string
DATA(lv_xml_payload) = `<post><id>404</id><title>XML Parsing</title></post>`.

" Inline defined structure matching the hierarchy
DATA: BEGIN OF ls_post_data,
        id    TYPE i,
        title TYPE string,
      END OF ls_post_data.

TRY.
    " Parse XML using the system identity (ID) transformation
    CALL TRANSFORMATION id
      SOURCE xml lv_xml_payload
      RESULT post = ls_post_data. " Matches the XML root tag 'post'

    cl_demo_output=>write( |Parsed Title: { ls_post_data-title } (ID: { ls_post_data-id })| ).
  CATCH cx_transformation_error INTO DATA(lx_xml_err).
    cl_demo_output=>write( |Error parsing XML: { lx_xml_err->get_text( ) }| ).
ENDTRY.
cl_demo_output=>display( ).
```

### XML Serialization (ABAP to XML)

To wrap records back into an XML format:

```abap
" Fill an inline structure
DATA(ls_invoice) = VALUE #(
  invoice_id = 'INV-5501'
  purchaser  = 'Wayne Enterprises'
).

DATA lv_xml_output TYPE string.

" Convert structural data to raw XML string
CALL TRANSFORMATION id
  SOURCE data = ls_invoice
  RESULT xml lv_xml_output.

cl_demo_output=>write( lv_xml_output ).
cl_demo_output=>display( ).
```

{{< alert type="info" title="Complex XML Structures" >}}
When simple ID mapping is insufficient for deeply nested schemas or advanced namespaces, you should create a dedicated **Simple Transformation (ST)** or **XSLT** object in Eclipse ADT and trigger it inside your `CALL TRANSFORMATION` statement.
{{< /alert >}}

---

## 11. Pro Tip: Wrap your HTTP Requests in a Helper Class

If you find yourself making HTTP requests in multiple places, writing boilerplate code to handle headers, cookies, query parameters, destinations, and clients gets repetitive and messy. Wrapping these calls into a clean, reusable utility class simplifies your application logic significantly.

Here is a robust helper class `ZCL_HTTP_HANDLER` that supports modern REST methods (`GET`, `POST`, `PUT`, `DELETE`), handles query parameter tables, tracks stateful headers/cookies, and manages client lifecycle cleanly:

```abap
CLASS zcl_http_handler DEFINITION
  PUBLIC
  CREATE PUBLIC.

  PUBLIC SECTION.
    TYPES:
      BEGIN OF ty_name_value,
        name  TYPE string,
        value TYPE string,
      END OF ty_name_value,
      tt_name_value TYPE STANDARD TABLE OF ty_name_value WITH DEFAULT KEY,

      " Response now carries BOTH the status code and the body,
      " so the caller can react to errors (e.g. 404 or 500).
      BEGIN OF ty_response,
        code   TYPE i,
        reason TYPE string,
        body   TYPE string,
      END OF ty_response.
    METHODS:
      constructor
        RAISING
          cx_web_http_client_error,

      set_header
        IMPORTING
          iv_name  TYPE string
          iv_value TYPE string,

      set_cookie
        IMPORTING
          iv_name  TYPE string
          iv_value TYPE string,

      get
        IMPORTING
          iv_url         TYPE string
          it_query_params TYPE tt_name_value OPTIONAL
        RETURNING
          VALUE(rs_response) TYPE ty_response
        RAISING
          cx_web_http_client_error
          cx_http_dest_provider_error,

      post
        IMPORTING
          iv_url         TYPE string
          it_query_params TYPE tt_name_value OPTIONAL
          iv_body        TYPE string OPTIONAL
        RETURNING
          VALUE(rs_response) TYPE ty_response
        RAISING
          cx_web_http_client_error
          cx_http_dest_provider_error,

      put
        IMPORTING
          iv_url         TYPE string
          it_query_params TYPE tt_name_value OPTIONAL
          iv_body        TYPE string OPTIONAL
        RETURNING
          VALUE(rs_response) TYPE ty_response
        RAISING
          cx_web_http_client_error
          cx_http_dest_provider_error,

      delete
        IMPORTING
          iv_url         TYPE string
          it_query_params TYPE tt_name_value OPTIONAL
        RETURNING
          VALUE(rs_response) TYPE ty_response
        RAISING
          cx_web_http_client_error
          cx_http_dest_provider_error.

  PRIVATE SECTION.
    DATA:
      mt_headers TYPE tt_name_value,
      mt_cookies TYPE tt_name_value.

    METHODS:
      create_client
        IMPORTING
          iv_url           TYPE string
        RETURNING
          VALUE(ro_client) TYPE REF TO if_web_http_client
        RAISING
          cx_web_http_client_error
          cx_http_dest_provider_error,

      prepare_request
        IMPORTING
          io_client        TYPE REF TO if_web_http_client
          it_query_params  TYPE tt_name_value OPTIONAL
          iv_body          TYPE string OPTIONAL
        RAISING
          cx_web_http_client_error,

      " Collects the status code AND body from the response into one structure
      collect_response
        IMPORTING
          io_response        TYPE REF TO if_web_http_response
        RETURNING
          VALUE(rs_response) TYPE ty_response
        RAISING
          cx_web_http_client_error.
ENDCLASS.


CLASS zcl_http_handler IMPLEMENTATION.

  METHOD constructor.
    " Initialization if needed
  ENDMETHOD.

  METHOD set_header.
    DELETE mt_headers WHERE name = iv_name.
    APPEND VALUE #( name = iv_name value = iv_value ) TO mt_headers.
  ENDMETHOD.

  METHOD set_cookie.
    DELETE mt_cookies WHERE name = iv_name.
    APPEND VALUE #( name = iv_name value = iv_value ) TO mt_cookies.
  ENDMETHOD.

  METHOD create_client.
    DATA(lo_destination) = cl_http_destination_provider=>create_by_url( iv_url ).
    ro_client = cl_web_http_client_manager=>create_by_http_destination( lo_destination ).
  ENDMETHOD.

  METHOD prepare_request.
    DATA(lo_request) = io_client->get_http_request( ).

    " Set header fields
    LOOP AT mt_headers ASSIGNING FIELD-SYMBOL(<fs_header>).
      lo_request->set_header_field(
        i_name  = <fs_header>-name
        i_value = <fs_header>-value
      ).
    ENDLOOP.

    " Set cookies
    LOOP AT mt_cookies ASSIGNING FIELD-SYMBOL(<fs_cookie>).
      lo_request->set_cookie(
        i_name  = <fs_cookie>-name
        i_value = <fs_cookie>-value
      ).
    ENDLOOP.

    " Set query parameters
    LOOP AT it_query_params ASSIGNING FIELD-SYMBOL(<fs_param>).
      lo_request->set_query_parameter(
        name  = <fs_param>-name
        value = <fs_param>-value
      ).
    ENDLOOP.

    " Set the body content if provided
    IF iv_body IS NOT INITIAL.
      lo_request->set_text( iv_body ).
    ENDIF.
  ENDMETHOD.

  METHOD collect_response.
    DATA(ls_status) = io_response->get_status( ).
    rs_response-code   = ls_status-code.
    rs_response-reason = ls_status-reason.
    rs_response-body   = io_response->get_text( ).
  ENDMETHOD.

  METHOD get.
    DATA(lo_client) = create_client( iv_url ).
    prepare_request(
      io_client       = lo_client
      it_query_params = it_query_params
    ).

    DATA(lo_response) = lo_client->execute( if_web_http_client=>get ).
    rs_response = collect_response( lo_response ).
    lo_client->close( ).
  ENDMETHOD.

  METHOD post.
    DATA(lo_client) = create_client( iv_url ).
    prepare_request(
      io_client       = lo_client
      it_query_params = it_query_params
      iv_body         = iv_body
    ).

    DATA(lo_response) = lo_client->execute( if_web_http_client=>post ).
    rs_response = collect_response( lo_response ).
    lo_client->close( ).
  ENDMETHOD.

  METHOD put.
    DATA(lo_client) = create_client( iv_url ).
    prepare_request(
      io_client       = lo_client
      it_query_params = it_query_params
      iv_body         = iv_body
    ).

    DATA(lo_response) = lo_client->execute( if_web_http_client=>put ).
    rs_response = collect_response( lo_response ).
    lo_client->close( ).
  ENDMETHOD.

  METHOD delete.
    DATA(lo_client) = create_client( iv_url ).
    prepare_request(
      io_client       = lo_client
      it_query_params = it_query_params
    ).

    DATA(lo_response) = lo_client->execute( if_web_http_client=>delete ).
    rs_response = collect_response( lo_response ).
    lo_client->close( ).
  ENDMETHOD.

ENDCLASS.
```

### How to use the ZCL_HTTP_HANDLER Wrapper Class

Using this wrapper class makes your main business logic short, clean, and extremely readable. Here are practical examples demonstrating how to use it for different HTTP operations:

#### 1. A Simple GET Request with Query Parameters

Instead of instantiating destinations, clients, and requests manually, you simply call the wrapper class:

```abap
TRY.
    DATA(lo_http) = NEW zcl_http_handler( ).

    " Inline query parameter table -> results in ...?limit=10&skip=0
    DATA(lt_params) = VALUE zcl_http_handler=>tt_name_value(
      ( name = 'limit' value = '10' )
      ( name = 'skip'  value = '0' )
    ).

    " Fetch the first 10 todos
    DATA(ls_response) = lo_http->get(
      iv_url          = 'https://dummyjson.com/todos'
      it_query_params = lt_params
    ).

    " Check the status code before trusting the body
    IF ls_response-code = 200.
      cl_demo_output=>write( ls_response-body ).
    ELSE.
      cl_demo_output=>write( |Request failed: { ls_response-code } { ls_response-reason }| ).
    ENDIF.

  CATCH cx_web_http_client_error cx_http_dest_provider_error INTO DATA(lx_err).
    cl_demo_output=>write( lx_err->get_text( ) ).
ENDTRY.
cl_demo_output=>display( ).
```

#### 2. A Stateful POST Request with Headers and Cookies

If you need to pass authentication tokens, context headers, or cookies alongside a payload:

```abap
TRY.
    DATA(lo_http) = NEW zcl_http_handler( ).

    " Set headers and cookies (which are stored in the object state)
    lo_http->set_header( iv_name = 'Authorization' iv_value = 'Bearer s0me-secr3t-asdf-t0k3n' ).
    lo_http->set_header( iv_name = 'Content-Type'  iv_value = 'application/json' ).
    lo_http->set_cookie( iv_name = 'mysessionid'   iv_value = '987654321' ).

    DATA(lv_json_payload) = `{"service": "active", "status": "completed"}`.

    " Execute POST request with state active
    DATA(ls_response) = lo_http->post(
      iv_url  = 'https://api.example.com/v1/status'
      iv_body = lv_json_payload
    ).

    " 2xx means success
    IF ls_response-code BETWEEN 200 AND 299.
      cl_demo_output=>write( |Success ({ ls_response-code }): { ls_response-body }| ).
    ELSE.
      cl_demo_output=>write( |Request failed: { ls_response-code } { ls_response-reason }| ).
    ENDIF.

  CATCH cx_web_http_client_error cx_http_dest_provider_error INTO DATA(lx_err).
    cl_demo_output=>write( lx_err->get_text( ) ).
ENDTRY.
cl_demo_output=>display( ).
```

---

## 12. Real-World Example: Creating a Jira Issue from ABAP

Let's put everything together in a genuinely useful scenario — the very first one from our intro: **automatically creating a Jira ticket when a quality issue is posted in SAP**. This example builds directly on the `ZCL_HTTP_HANDLER` wrapper from Section 11 and calls the real **[Jira Cloud REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)**.

### How Jira wants the data

To create an issue, Jira expects a `POST` to `/rest/api/3/issue` with a JSON body where all fields live under a `fields` object. Here is how the pieces you asked about map to that contract:

| What you want to set | JSON path                   | Example value                              |
| :------------------- | :-------------------------- | :----------------------------------------- |
| **Project**          | `fields.project.key`        | `"SAP"`                                    |
| **Title**            | `fields.summary`            | `"Quality issue on production order 4711"` |
| **Issue type**       | `fields.issuetype.name`     | `"Task"`, `"Bug"`, `"Story"`               |
| **Assignee**         | `fields.assignee.accountId` | `"5b10ac8d82e05b22cc7d4ef5"`               |
| **Priority**         | `fields.priority.name`      | `"High"`, `"Medium"`, `"Low"`              |
| **Labels**           | `fields.labels`             | `["sap", "integration"]`                   |
| **Description**      | `fields.description`        | An **ADF** document (see the note below)   |

{{< alert type="info" title="Two things you need from Jira first" >}}

1. **An API token** — create one at [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens). Jira Cloud authenticates with **Basic Auth** using your account e-mail + this token (never your password).
2. **The assignee's account ID** — in Jira Cloud you no longer assign by username but by a stable **`accountId`**. You can look it up via `GET /rest/api/3/users/search` or from the user's profile URL.
   {{< /alert >}}

### The sample class: `ZCL_JIRA_CLIENT`

This small class wraps authentication and payload building, so the calling program stays a one-liner. It **reuses `ZCL_HTTP_HANDLER`** internally — a nice example of composing small helpers.

```abap
CLASS zcl_jira_client DEFINITION
  PUBLIC
  CREATE PUBLIC.

  PUBLIC SECTION.
    TYPES:
      " What we hand back to the caller after a create attempt
      BEGIN OF ty_result,
        success TYPE abap_bool,
        code    TYPE i,
        id      TYPE string,   " internal Jira ID,   e.g. "10042"
        key     TYPE string,   " readable issue key, e.g. "SAP-123"
        url     TYPE string,   " REST self-link to the new issue
        message TYPE string,   " Jira's error payload when success = abap_false
      END OF ty_result.

    METHODS:
      constructor
        IMPORTING
          iv_base_url  TYPE string   " e.g. https://your-domain.atlassian.net
          iv_email     TYPE string   " your Atlassian account e-mail
          iv_api_token TYPE string   " API token from id.atlassian.com
        RAISING
          cx_web_http_client_error,

      create_issue
        IMPORTING
          iv_project_key TYPE string              " e.g. "SAP"
          iv_summary     TYPE string              " the issue title
          iv_issue_type  TYPE string DEFAULT `Task`
          iv_assignee_id TYPE string OPTIONAL     " Jira account ID of the assignee
          iv_priority    TYPE string DEFAULT `Medium`
          iv_description TYPE string OPTIONAL
        RETURNING
          VALUE(rs_result) TYPE ty_result
        RAISING
          cx_web_http_client_error
          cx_http_dest_provider_error.

  PRIVATE SECTION.
    " ABAP data definitions that mirror the Jira "create issue" JSON.
    " We fill these and let /UI2/CL_JSON serialize them (see Section 9) -
    " no hand-written JSON strings, no manual escaping.
    TYPES:
      BEGIN OF ty_key,
        key TYPE string,
      END OF ty_key,

      BEGIN OF ty_name,
        name TYPE string,
      END OF ty_name,

      BEGIN OF ty_assignee,
        account_id TYPE string,   " camelCase serialization -> "accountId"
      END OF ty_assignee,

      " --- Atlassian Document Format (ADF) for the description ---
      BEGIN OF ty_text_node,
        type TYPE string,
        text TYPE string,
      END OF ty_text_node,
      tt_text_node TYPE STANDARD TABLE OF ty_text_node WITH DEFAULT KEY,

      BEGIN OF ty_para_node,
        type    TYPE string,
        content TYPE tt_text_node,
      END OF ty_para_node,
      tt_para_node TYPE STANDARD TABLE OF ty_para_node WITH DEFAULT KEY,

      BEGIN OF ty_doc,
        type    TYPE string,
        version TYPE i,
        content TYPE tt_para_node,
      END OF ty_doc,

      tt_labels TYPE STANDARD TABLE OF string WITH DEFAULT KEY,

      " --- the "fields" object Jira expects ---
      BEGIN OF ty_fields,
        project     TYPE ty_key,
        summary     TYPE string,
        issuetype   TYPE ty_name,
        priority    TYPE ty_name,
        labels      TYPE tt_labels,
        assignee    TYPE REF TO ty_assignee,  " bound only if an ID is supplied
        description TYPE ty_doc,
      END OF ty_fields,

      BEGIN OF ty_issue,
        fields TYPE ty_fields,
      END OF ty_issue.

    DATA:
      mv_base_url TYPE string,
      mo_http     TYPE REF TO zcl_http_handler.

    METHODS:
      build_payload
        IMPORTING
          iv_project_key TYPE string
          iv_summary     TYPE string
          iv_issue_type  TYPE string
          iv_assignee_id TYPE string
          iv_priority    TYPE string
          iv_description TYPE string
        RETURNING
          VALUE(rv_json) TYPE string.
ENDCLASS.


CLASS zcl_jira_client IMPLEMENTATION.

  METHOD constructor.
    mv_base_url = iv_base_url.
    mo_http     = NEW zcl_http_handler( ).

    " Jira Cloud uses Basic Auth: "email:api_token", Base64-encoded.
    DATA(lv_credentials) = cl_http_utility=>encode_base64( |{ iv_email }:{ iv_api_token }| ).

    " Stored in the handler once and reused for every subsequent request.
    mo_http->set_header( iv_name = `Authorization` iv_value = |Basic { lv_credentials }| ).
    mo_http->set_header( iv_name = `Content-Type`  iv_value = `application/json` ).
    mo_http->set_header( iv_name = `Accept`        iv_value = `application/json` ).
  ENDMETHOD.

  METHOD build_payload.
    " Fill the ABAP structure that mirrors the Jira contract. The description
    " is wrapped in the Atlassian Document Format (doc -> paragraph -> text).
    DATA(ls_issue) = VALUE ty_issue(
      fields = VALUE #(
        project   = VALUE #( key  = iv_project_key )
        summary   = iv_summary
        issuetype = VALUE #( name = iv_issue_type )
        priority  = VALUE #( name = iv_priority )
        labels    = VALUE #( ( `sap` ) ( `integration` ) )
        description = VALUE #(
          type    = `doc`
          version = 1
          content = VALUE #(
            ( type    = `paragraph`
              content = VALUE #( ( type = `text` text = iv_description ) ) ) )
        )
      )
    ).

    " The assignee is optional -> bind the reference only when an ID is given.
    " Thanks to compress = abap_true an unbound reference is simply omitted.
    IF iv_assignee_id IS NOT INITIAL.
      ls_issue-fields-assignee = NEW #( account_id = iv_assignee_id ).
    ENDIF.

    " Serialize the structure to JSON (see Section 9). camelCase maps the
    " ABAP component account_id -> the JSON key "accountId" that Jira expects,
    " while single-word names such as issuetype stay lower-case.
    rv_json = /ui2/cl_json=>serialize(
      data        = ls_issue
      compress    = abap_true
      pretty_name = /ui2/cl_json=>pretty_mode-camel_case
    ).
  ENDMETHOD.

  METHOD create_issue.
    " 1. Build the JSON body
    DATA(lv_body) = build_payload(
      iv_project_key = iv_project_key
      iv_summary     = iv_summary
      iv_issue_type  = iv_issue_type
      iv_assignee_id = iv_assignee_id
      iv_priority    = iv_priority
      iv_description = iv_description
    ).

    " 2. POST it to the Jira REST API
    DATA(ls_response) = mo_http->post(
      iv_url  = |{ mv_base_url }/rest/api/3/issue|
      iv_body = lv_body
    ).

    rs_result-code = ls_response-code.

    " 3. Jira answers 201 Created on success and echoes back id + key
    IF ls_response-code = 201.
      DATA: BEGIN OF ls_created,
              id   TYPE string,
              key  TYPE string,
              self TYPE string,
            END OF ls_created.

      /ui2/cl_json=>deserialize(
        EXPORTING json = ls_response-body
        CHANGING  data = ls_created
      ).

      rs_result-success = abap_true.
      rs_result-id      = ls_created-id.
      rs_result-key     = ls_created-key.
      rs_result-url     = ls_created-self.
    ELSE.
      " On errors Jira returns { "errorMessages": [...], "errors": { ... } }
      rs_result-success = abap_false.
      rs_result-message = ls_response-body.
    ENDIF.
  ENDMETHOD.

ENDCLASS.
```

### Using it: one clean call

With the class in place, creating a Jira task from anywhere in your SAP logic is short and readable:

```abap
TRY.
    " 1. Point the client at your Jira Cloud site and authenticate
    DATA(lo_jira) = NEW zcl_jira_client(
      iv_base_url  = `https://your-domain.atlassian.net`
      iv_email     = `integration.bot@your-company.com`
      iv_api_token = `ATATT3xFfGF0...your-api-token...`
    ).

    " 2. Create the task: title, type, assignee, priority and description
    DATA(ls_result) = lo_jira->create_issue(
      iv_project_key = `SAP`
      iv_summary     = `Quality issue on production order 4711`
      iv_issue_type  = `Task`
      iv_assignee_id = `5b10ac8d82e05b22cc7d4ef5`
      iv_priority    = `High`
      iv_description = `Automatically raised from SAP after a QM notification was posted.`
    ).

    " 3. React to the outcome
    IF ls_result-success = abap_true.
      cl_demo_output=>write( |✅ Jira issue created: { ls_result-key }| ).
      cl_demo_output=>write( |Link: { ls_result-url }| ).
    ELSE.
      cl_demo_output=>write( |❌ Jira rejected the request (HTTP { ls_result-code }):| ).
      cl_demo_output=>write( ls_result-message ). " contains Jira's validation errors
    ENDIF.

  CATCH cx_web_http_client_error cx_http_dest_provider_error INTO DATA(lx_err).
    cl_demo_output=>write( lx_err->get_text( ) ).
ENDTRY.
cl_demo_output=>display( ).
```

A successful run returns something like `SAP-123` — the key of the freshly created Jira issue, ready to store back on your SAP document.

{{< alert type="info" title="Why is the description so nested? (ADF)" >}}
Since REST API **v3**, Jira no longer accepts a plain description string. It expects the **Atlassian Document Format (ADF)** — a JSON tree of `doc` → `paragraph` → `text` nodes. That is why our payload wraps the text in that little structure. For a single paragraph the snippet above is all you need; richer formatting (bold, lists, links) just adds more nodes.
{{< /alert >}}

{{< alert type="info" title="Production hardening" >}}
This example builds the body from string literals so you can see the exact Jira contract. In production, remember two things:

- **Escape user input:** if `iv_summary` or `iv_description` can contain quotes or newlines, build the payload from an ABAP structure with `/UI2/CL_JSON` or `XCO` (Section 9) instead of concatenating strings, so the JSON stays valid.
- **Keep the token out of your code:** store the Jira URL and API token in a **Destination** / **Communication Arrangement** (Section 4) rather than passing them as literals.
  {{< /alert >}}

---

## 13. Troubleshooting: Common Beginner Errors

Even with perfect code, HTTP calls can fail for reasons _outside_ your program. Here are the errors you will most likely run into — and how to fix them:

| Symptom                                       | Likely Cause                                                               | How to Fix                                                                                                                         |
| :-------------------------------------------- | :------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **SSL handshake failed** / certificate error  | The target server's **SSL certificate** is not trusted by your SAP system. | Import the server's certificate into transaction **`STRUST`** (SSL client PSE). This is the #1 reason HTTPS calls fail on-premise. |
| **`403 Forbidden`** on POST/PUT/DELETE to SAP | Missing or invalid **CSRF token**.                                         | Fetch the token first and reuse the same client (see Section 8).                                                                   |
| **`401 Unauthorized`**                        | Missing or wrong **credentials/token**.                                    | Check your `Authorization` header or the Destination configuration (Section 7).                                                    |
| Program **hangs forever**                     | The remote server is slow or unreachable.                                  | Set a **timeout** with `set_timeout( )` (Section 6).                                                                               |
| **Garbled special characters** (é, ü, ...)    | Wrong **encoding**.                                                        | Make sure you send/read UTF-8 and set `Content-Type: application/json; charset=utf-8`.                                             |

{{< alert type="info" title="Certificates (STRUST) — Read This!" >}}
When calling an **HTTPS** endpoint, your SAP system must trust the remote server. If the certificate (or its root/intermediate certificate) is not in **`STRUST`**, the connection is refused _before_ any data is sent. Ask your Basis team to import the certificate chain into the **SSL Client (Standard)** PSE — this solves the vast majority of HTTPS connection problems.
{{< /alert >}}

---

## Summary & Integration Best Practices

By following these fundamental practices, you write clean, reliable integration logic every time:

1. **Use the modern `IF_WEB_HTTP_CLIENT` API:** It is secure, decoupled, and Clean Core-compliant — the successor to the legacy `CL_HTTP_CLIENT`.
2. **Keep secrets out of your code:** Use **Destinations** (`SM59`) or **Communication Arrangements** (BTP) instead of hard-coding URLs, users, and passwords.
3. **Always check the status code:** A `2xx` means success. Never trust the response body before you have confirmed the status.
4. **Handle the CSRF token for SAP OData:** Fetch it first, then send it back with every change request.
5. **Use inline declarations:** Declaring data containers and target records directly in your (de)serialization blocks keeps your code clean and free of redundant Dictionary overhead.
6. **Pick the right JSON tool:** `/UI2/CL_JSON` on classic On-Premise, **`XCO`** in ABAP Cloud.
7. **Always wrap calls in `TRY-CATCH`:** Network calls, timeouts, and corrupted payloads _will_ happen — defensive code keeps your jobs from crashing.
8. **Reuse a helper class:** A small wrapper like `ZCL_HTTP_HANDLER` removes boilerplate and makes your business logic short and readable.

---

{{< faq >}}

{{< faq-item question="How do I make an HTTP request in modern ABAP?" >}}
Use the `IF_WEB_HTTP_CLIENT` interface. Create a client with `cl_web_http_client_manager=>create_by_http_destination( )`, configure the request (headers, body, query parameters), call `execute( )` with the desired method (`get`, `post`, `put`, `delete`), and read the response. It is the Clean Core-compliant successor to the legacy `CL_HTTP_CLIENT` class.
{{< /faq-item >}}

{{< faq-item question="What is the difference between CL_HTTP_CLIENT and IF_WEB_HTTP_CLIENT?" >}}
`CL_HTTP_CLIENT` is the older, legacy HTTP client. `IF_WEB_HTTP_CLIENT` is the modern, secure, and Clean Core-compliant API available in SAP S/4HANA and ABAP Cloud. For any new development you should always use `IF_WEB_HTTP_CLIENT`.
{{< /faq-item >}}

{{< faq-item question="Which class should I use to parse JSON in ABAP?" >}}
On classic On-Premise systems, `/UI2/CL_JSON` is convenient and widely used. In ABAP Cloud (BTP or S/4HANA Cloud Public Edition), `/UI2/CL_JSON` is not released — use the modern `XCO` library (`xco_cp_json`) instead, which is the officially released, Clean Core-compliant option.
{{< /faq-item >}}

{{< faq-item question="Why does my ABAP OData POST request return a 403 Forbidden error?" >}}
A `403 Forbidden` on an SAP OData `POST`, `PUT`, or `DELETE` almost always means a missing or invalid CSRF token. First send a `GET` request with the header `X-CSRF-Token: Fetch` to obtain a token, then send it back in the `X-CSRF-Token` header of your change request — and make sure you reuse the same HTTP client so the session cookie stays valid.
{{< /faq-item >}}

{{< faq-item question="How do I fix SSL handshake or certificate errors when calling an HTTPS API?" >}}
Your SAP system must trust the remote server's SSL certificate. Import the server's certificate (including its root and intermediate certificates) into transaction `STRUST` under the SSL Client (Standard) PSE. Missing certificates are the number one reason HTTPS calls fail on-premise.
{{< /faq-item >}}

{{< faq-item question="How do I send authentication credentials with an ABAP HTTP request?" >}}
Set an `Authorization` header: use `Basic` with Base64-encoded `user:password` for Basic Auth, `Bearer <token>` for OAuth 2.0, or a custom header like `X-API-Key` for API keys. In production, store credentials in a Destination (`SM59`) or Communication Arrangement instead of hard-coding them, so SAP adds authentication automatically and secrets stay out of your code.
{{< /faq-item >}}

{{< faq-item question="Should I use JSON or XML for ABAP integrations?" >}}
Prefer JSON for modern REST APIs — it is lightweight and the de-facto standard. Use XML for SOAP-based services, legacy platforms, or explicit SAP-to-SAP background messaging. ABAP handles JSON with `/UI2/CL_JSON` or `XCO`, and XML with `CALL TRANSFORMATION id`.
{{< /faq-item >}}

{{< faq-item question="How do I create a Jira issue from ABAP?" >}}
Send a `POST` to the Jira Cloud REST API endpoint `/rest/api/3/issue` with a JSON body containing a `fields` object (`project.key`, `summary` for the title, `issuetype.name`, `assignee.accountId`, `priority.name`, and a `description` in Atlassian Document Format). Authenticate with Basic Auth using your Atlassian e-mail plus an API token from `id.atlassian.com`. Jira returns `201 Created` with the new issue `key` (e.g. `SAP-123`). See the `ZCL_JIRA_CLIENT` sample class in Section 12 for a complete implementation.
{{< /faq-item >}}

{{< /faq >}}
