import { serialize, logDebugAction } from "aerial-common2";
import { loadedSavedState } from "../actions";
import { put, take, fork, call, select } from "redux-saga/effects";

const PERSIST_DELAY_TIMEOUT = 1000;

const SAVE_KEY = "state";

declare function requestIdleCallback(callback: any): any;

export function* persistStateSaga() {
  yield fork(loadState);
  yield fork(persistState);
}

function* loadState() {
  const savedStateString = localStorage.getItem(SAVE_KEY);
  if (!savedStateString) {
    return;
  }
  const savedState = JSON.parse(savedStateString);
  yield put(loadedSavedState(savedState));
}

function* persistState() {
  while(true) {
    yield take();
    yield call(whenIdle);
    const state = yield select();

    // convert to a POJO object in case there are non serializable
    // object somehow in the application store. For the most part -- everything should be
    // a POJO with very few exceptions. For cases where data cannot be converted into a plain object, the application will need to re-hydrate the non-serializable data on startup. 
    const pojoState = serialize(state);
    localStorage.setItem(SAVE_KEY, JSON.stringify(pojoState));
    console.debug(`Saving app state`);
  }
}

const whenIdle = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, PERSIST_DELAY_TIMEOUT);
});