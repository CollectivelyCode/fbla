'use strict';
exports.config = {
    /**
     * Array of application names.
     */
    app_name: ['RapidAttend API'],
    license_key: 'b4fecff25d52e0621ad15c7fab194b89FFFFNRAL',
    distributed_tracing: {
        /**
         * Enables/disables distributed tracing.
         *
         * @env NEW_RELIC_DISTRIBUTED_TRACING_ENABLED
         */
        enabled: true,
    },
    logging: {
        level: 'trace',
    },
    allow_all_headers: true,
    attributes: {
        /**
         * Prefix of attributes to exclude from all destinations. Allows * as wildcard
         * at end.
         *
         * NOTE: If excluding headers, they must be in camelCase form to be filtered.
         *
         * @env NEW_RELIC_ATTRIBUTES_EXCLUDE
         */
        exclude: [
            'request.headers.cookie',
            'request.headers.authorization',
            'request.headers.proxyAuthorization',
            'request.headers.setCookie*',
            'request.headers.x*',
            'response.headers.cookie',
            'response.headers.authorization',
            'response.headers.proxyAuthorization',
            'response.headers.setCookie*',
            'response.headers.x*',
        ],
    },
};