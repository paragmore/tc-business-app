// import the interface
import { ScreenModel } from '../models/screen.models';
import {
  setScreen,
} from '../actions/screen.action';
import { createReducer, on } from '@ngrx/store';
//create a dummy initial state
const initialState: ScreenModel = {
  isMobile: false,
};

export const screenReducer = createReducer(
  initialState,
  on(setScreen, (state, {screen}) => ({ ...screen }))
);
