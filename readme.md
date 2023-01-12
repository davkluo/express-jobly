# Jobly Backend

This is the Express backend for Jobly, version 2.

To run this:

    node server.js

To run the tests:

    jest -i

Include the following line in node_modules/pg-types/lib/textParsers.js:

    var init = function(register) {
        ...
        register(1700, parseFloat);
    };