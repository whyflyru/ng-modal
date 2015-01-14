(function () {
    'use strict';

    angular
        .module('ngModal')
        .factory('ngModal', ngModal);

    function ngModal($rootScope, $controller, $animate,
                     $compile, $q, $http, $templateCache) {

        return factory;

        function factory(config) {
            var element;
            var scope;
            var html;
            var service = {
                activate: activate,
                deactivate: deactivate,
                active: active
            };

            config = getNormalizeConfig(config);
            html = getTemplatePromise(config);

            return service;

            function attach(html, params) {
                element = angular.element(html);
                if (element.length === 0) {
                    throw new Error('The template contains no elements; you need to wrap text nodes')
                }
                $animate.enter(element, config.container);
                scope = $rootScope.$new();
                if (params) {
                    for (var param in params) {
                        scope[param] = params[param];
                    }
                }
                $controller(config.controller, {$scope: scope});
                $compile(element)(scope);
            }

            function activate(locals) {
                return html
                    .then(success);

                function success(html) {
                    if (!element) {
                        attach(html, locals);
                    }
                }
            }

            function deactivate() {
                var deferred = $q.defer();
                if (element) {
                    $animate
                        .leave(element)
                        .then(success);
                } else {
                    deferred.resolve();
                }
                return deferred.promise;

                function success() {
                    scope.$destroy();
                    element = null;
                    deferred.resolve();
                }
            }

            function active() {
                return !!element;
            }

            function getTemplatePromise(config) {
                var deferred;
                if (config.template) {
                    deferred = $q.defer();
                    deferred.resolve(config.template);
                    return deferred.promise;
                }
                return $http
                    .get(config.templateUrl, {cache: $templateCache})
                    .then(success);

                function success(response) {
                    return response.data;
                }
            }

            function getNormalizeConfig(config) {
                config.controller = config.controller || angular.noop;
                config.container = angular.element(config.container || document.body);
                return config;
            }

        }

    }
})();
