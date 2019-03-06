import angular from 'core/angular';

export const TabComponent = angular
    .module('blipComponents.tabComponent', [])
    .component('tab', {
        controller: class {
            isActive: boolean;
            showTab: boolean;
            contentTabsCtrl: any;

            constructor(private $scope) {
                this.showTab = false;
                this.isActive = false;

                $scope.$on('ChangeTab', () => {
                    this.showTab = false;
                    this.isActive = false;
                });
            }

            $onInit() {
                let parentCtrl = this.contentTabsCtrl;
                if (parentCtrl.tabs.length == 0) {
                    this.showTab = true;
                    this.isActive = true;
                }
                parentCtrl.tabs.push(this);
            }
        },
        controllerAs: '$ctrl',
        template: '<div class="tab-content" ng-show="$ctrl.showTab" ng-transclude></div>',
        transclude: true,
        require: {
            contentTabsCtrl: '^^contentTabs'
        },
        bindings: {
            tabTitle: '@',
            tabHref: '@?',
        }
    })
    .name;
