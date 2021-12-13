// @ts-check

import {APIWrapper, API_EVENT_TYPE} from "./api.js";
import {addMessage, animateGift, isAnimatingGiftUI} from "./dom_updates.js";

const api = new APIWrapper();
let eventsList = [];
const EVENT_DELAY = 500
const MILLISECONDS = 20 * 1000;

const removeEvents = () => {
    eventsList = eventsList.filter(e => Date.now() - e.timestamp < MILLISECONDS);
};

const sortEvents = () => {
    eventsList.sort((a, b) => {
        if (a.type === API_EVENT_TYPE.ANIMATED_GIFT) {
            return -1;
        }
        if (b.type === API_EVENT_TYPE.ANIMATED_GIFT) {
            return 1;
        }
        return 0;
    });
};

const showEvents = (event) => {
    if (event.type === API_EVENT_TYPE.ANIMATED_GIFT) {
        addMessage(event);
        animateGift(event);
    } else if (event.type === API_EVENT_TYPE.GIFT) {
        addMessage(event);
    }
};

setInterval(() => {
    if (eventsList.length === 0) return;

    removeEvents();
    sortEvents();

    let event = null;
    let index = 0;
    if (isAnimatingGiftUI()) {
        event = eventsList.find((e, i) => {
            index = i;
            return e.type !== API_EVENT_TYPE.ANIMATED_GIFT;
        });
    } else {
        event = eventsList[0];
    }
    if (event === undefined) return;

    showEvents(event);
    eventsList.splice(index, 1);
}, EVENT_DELAY);

api.setEventHandler((events) => {
    if (events.length === 0) return;
    eventsList = eventsList.concat(events);
});
