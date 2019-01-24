import template from './ThreadMessagesView.html';
import { debounce } from 'data/function';
import { EventEmitter } from 'modules/shared/EventEmitter';
import { IComponentController, IOnChangesObject } from 'angular';

class ThreadMessages implements IComponentController {
    private scrollToBottom: boolean;
    private isLoadingThread: boolean = true; //True so placeholder appears first
    loadMore: (obj: any) => void;
    wrapper: HTMLDivElement;
    constructor(
        private $element
    ) {
        this.wrapper = this.$element[0].querySelector(
            '#thread-wrapper',
        ) as HTMLDivElement;
    }

    $onChanges(changesObj: IOnChangesObject) {
        const { messages } = changesObj;

        if (messages && this.wrapper) {
            const scrollDiff = Math.abs(
                (this.wrapper.scrollTop + this.wrapper.clientHeight) - this.wrapper.scrollHeight
            );
            const isChangedAndNearBottom = scrollDiff < this.wrapper.clientHeight;

            if (!messages.isFirstChange() && isChangedAndNearBottom) {
                setTimeout(() => this.scrollViewToBottom());
            }
        }
    }

    $onInit() {
        setTimeout(() => {
            const scroll = async (event) => {
                if (event.srcElement.scrollTop === 0) {
                    if (this.loadMore) {
                        this.loadMore(EventEmitter({ wrapper: this.wrapper }));
                    }
                }
            };
            const debouncedScroll = debounce(scroll);
            this.wrapper.addEventListener('scroll', debouncedScroll);
        });
    }

    scrollViewToBottom() {
        if (this.scrollToBottom) {
            this.wrapper.scrollTop = this.wrapper.scrollHeight;
        }
    }
}

export const ThreadMessagesComponent = {
    template,
    controller: ThreadMessages,
    controllerAs: '$ctrl',
    bindings: {
        messages: '<',
        loadMore: '&',
        scrollToBottom: '<',
        isLoadingThread: '<'
    },
};
