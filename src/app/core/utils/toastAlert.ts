import { ToastController, ToastOptions } from '@ionic/angular';

export const toastAlert = async (
  toastController: ToastController,
  message: string,
  color?: ToastOptions['color'],
  toastPosition?: 'top' | 'middle' | 'bottom',
  toastDuration?: number
) => {
  const duration = toastDuration ? toastDuration : 1200;
  const position = toastPosition ? toastPosition : 'top';
  const toast = await toastController.create({
    message,
    duration,
    position,
    color,
  });
  await toast.present();
};
