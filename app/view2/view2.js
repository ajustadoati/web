'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [function() {

}]);

angular.module('myApp')
.component('myContent', {
    template: 'I am content! <button type="button" class="btn btn-default" ng-click="$ctrl.open()">Open Modal</button>',
    controller: function($uibModal) {
        $ctrl = this;
        $ctrl.dataForModal = {
            name: 'NameToEdit',
            value: 'ValueToEdit'
        }
        $ctrl.open = function() {
            $uibModal.open({
                template: '<my-modal greeting="$ctrl.greeting" modal-data="$ctrl.modalData" $close="$close(result)" $dismiss="$dismiss(reason)"></my-modal>',
                controller: ['modalData', function(modalData) {
                    var $ctrl = this;
                    $ctrl.greeting = 'I am a modal!'
                    $ctrl.modalData = modalData;
                }],
                controllerAs: '$ctrl',
                resolve: {
                    modalData: $ctrl.dataForModal
                }
            }).result.then(function(result) {
                console.info("I was closed, so do what I need to do myContent's controller now and result was->");
                console.info(result);
            }, function(reason) {
                console.info("I was dimissed, so do what I need to do myContent's controller now and reason was->" + reason);
            });
        };
    }
});

angular.module('myApp')
.component('myModal', {
    template: `<div class="modal-body"><div>{{$ctrl.greeting}}</div> 
<label>Name To Edit</label> <input ng-model="$ctrl.modalData.name"><br>
<label>Value To Edit</label> <input ng-model="$ctrl.modalData.value"><br>
<button class="btn btn-warning" type="button" ng-click="$ctrl.handleClose()">Close Modal</button>
<button class="btn btn-warning" type="button" ng-click="$ctrl.handleDismiss()">Dimiss Modal</button>
</div>`,
    bindings: {
        $close: '&',
        $dismiss: '&',
        greeting: '<',
        modalData: '<'
    },
    controller: [function() {
        var $ctrl = this;
        $ctrl.handleClose = function() {
            console.info("in handle close");
            $ctrl.$close({
                result: $ctrl.modalData
            });
        };
        $ctrl.handleDismiss = function() {
            console.info("in handle dismiss");
            $ctrl.$dismiss({
                reason: 'cancel'
            });
        };
    }],
});