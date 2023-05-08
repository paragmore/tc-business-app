import { createAction, props } from '@ngrx/store';
import { ScreenModel } from '../models/screen.models';

export enum ScreenActionType {
  UPDATE_SCREEN = '[SCREEN] Update Screen',
}
export const setScreen = createAction(
  ScreenActionType.UPDATE_SCREEN,
  props<{ screen: ScreenModel }>()
);
