// import {
//   check,
//   RESULTS,
//   requestNotifications,
// } from 'react-native-permissions';
// import { Platform } from 'react-native';

// class AppPermission {
//   checkPermission = async (type): Promise<boolean> => {
//     console.log('AppPermission checkPermission type: ', type);
//     const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
//     console.log('AppPermission checkPermission permissons: ', permissions);
//     if (!permissions) {
//       return true;
//     }
//     try {
//       const result = await check(permissions);
//       console.log('AppPermission checkPermission result: ', permissions);
//       if (result === RESULTS.GRANTED) return true;
//       return this.requestPermission(); // request permission
//     } catch (error) {
//       return false;
//     }
//   };

//   requestPermission = async (permissions): Promise<boolean> => {
//     console.log('AppPermission requestPermission permissions: ', permissions);

//     try {
//       const result = await request(permissions);
//       console.log('AppPermission requestPermission results: ', permissions);

//       return result === RESULTS.GRANTED;
//     } catch (error) {
//       console.log('AppPermission requestPermission error: ', permissions);
//       return false;
//     }
//   };

//   requestNotifyPermission = async (): Promise<boolean> => {
//     if (Platform.OS === 'android') {
//       return true;
//     }
//     const { status, settings } = await requestNotifications([
//       'alert',
//       'sound',
//       'badge',
//     ]);
//     console.log(
//       'AppPermission requestNotifyPermission status settings: ',
//       status,
//       settings,
//     );
//     return status === RESULTS.GRANTED;
//   };
// }

// const Permission = new AppPermission();

// export { Permission };
