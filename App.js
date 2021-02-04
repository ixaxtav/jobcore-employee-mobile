import React from 'react';
import {
  createSwitchNavigator,
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import { YellowBox } from 'react-native';

import { Root } from 'native-base';
import LoginScreen from './src/components/Account/LoginScreen';
import RegisterScreen from './src/components/Account/RegisterScreen';
import ValidationCodeScreen from './src/components/Account/ValidationCodeScreen';
import EditProfile from './src/components/Account/EditProfile';
import UploadDocumentScreen from './src/components/Account/UploadDocumentScreen';
import FederalW4tScreen from './src/components/Account/FederalW4tScreen';
import I9FormScreen from './src/components/Account/I9FormScreen';
import BackgroundCheckScreen from './src/components/Account/BackgroundCheckScreen';
import BankAccounts from './src/components/BankAccounts/BankAccounts';
import AddBankAccount from './src/components/BankAccounts/AddBankAccount';
import ForgotScreen from './src/components/Account/ForgotScreen';
import TermsAndConditionsScreen from './src/components/Account/TermsAndConditionsScreen';
import ChangePassword from './src/components/Account/ChangePassword';
import PublicProfile from './src/components/Account/PublicProfile';
import Profile from './src/components/Account/Profile';
import DashboardScreen from './src/components/Dashboard';
import JobInvites from './src/components/Invite/JobInvites';
import InviteDetailsV2 from './src/components/Invite/InviteDetailsV2';
import JobPreferences from './src/components/Invite/JobPreferences';
//ONBOARDING
import JobPreferencesOnboarding from './src/components/Invite/JobPreferencesOnboardingScreen';
import PositionOnboarding from './src/components/EmployeeOnboarding/PositionOnboarding';
import ResumeOnboarding from './src/components/EmployeeOnboarding/ResumeOnboarding';
import PictureOnboarding from './src/components/EmployeeOnboarding/PictureOnboarding';
import LocationOnboarding from './src/components/EmployeeOnboarding/LocationOnboarding';
import AvailabilityOnboarding from './src/components/EmployeeOnboarding/AvailabilityOnboarding';
import DOBOnboarding from './src/components/EmployeeOnboarding/DOBOnboarding';
import Position from './src/components/Invite/Position';
import Availability from './src/components/Invite/Availability';
import MyJobs from './src/components/MyJobs';
import RateEmployer from './src/components/MyJobs/RateEmployer';
import UpcomingJobScreen from './src/components/MyJobs/UpcomingJobScreen';
import JobDetailsNewOneScreen from './src/components/MyJobs/WorkModeScreen';
import JobDetailsNewTwoScreen from './src/components/MyJobs/JobDetailsNewTwo';
import JobPaymentsScreen from './src/components/MyJobs/JobPayments';
import WorkModeScreen from './src/components/MyJobs/WorkModeScreen';
import Reviews from './src/components/MyJobs/Reviews';
import Help from './src/components/Help';
import {
  DASHBOARD_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  VALIDATION_CODE_ROUTE,
  FORGOT_ROUTE,
  JOB_INVITES_ROUTE,
  JOB_PREFERENCES_ROUTE,
  MYJOBS_ROUTE,
  SETTING_ROUTE,
  APP_ROUTE,
  AUTH_ROUTE,
  POSITION_ONBOARDING_ROUTE,
  AVAILABILITY_ONBOARDING_ROUTE,
  RESET_ROUTE,
  AVAILABILITY_ROUTE,
  JOB_PREFERENCES_ONBOARDING_ROUTE,
  PICTURE_ONBOARDING_ROUTE,
  INVITE_DETAILS_ROUTE_V2,
  POSITION_ROUTE,
  EDIT_LOCATION_ROUTE,
  RATE_EMPLOYER_ROUTE,
  REVIEWS_ROUTE,
  JOB_DETAILS_NEW_ONE_ROUTE,
  JOB_DETAILS_NEW_TWO_ROUTE,
  JOB_PAYMENTS_ROUTE,
  HELP_ROUTE,
  DOB_ONBOARDING_ROUTE,
  RESUME_ONBOARDING_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
  UPDATE_APP_ROUTE,
  LOCATION_ONBOARDING_ROUTE,
} from './src/constants/routes';
import {
  BLUE_DARK,
  BLUE_LIGHT,
  GRAY_MAIN,
  BLUE_SEMI_LIGHT,
} from './src/shared/colorPalette';

import SettingScreen from './src/components/Setting';
import Splash from './src/components/Splash';
import EditLocation from './src/components/Invite/EditLocation';
import ApplicationDetailScreen from './src/components/MyJobs/ApplicationDetailScreen';
import JobCompletedScreen from './src/components/MyJobs/JobCompletedScreen';
import UpdateApp from './src/components/UpdateApp';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Warning: Failed prop type',
  'Module RCTImageLoader',
]);
window.DEBUG = false;

export const AuthStack = createStackNavigator({
  [LOGIN_ROUTE]: {
    screen: LoginScreen,
    path: 'login/:email',
  },
  [REGISTER_ROUTE]: {
    screen: RegisterScreen,
    path: 'register',
  },
  [VALIDATION_CODE_ROUTE]: ValidationCodeScreen,
  [FORGOT_ROUTE]: ForgotScreen,
  [TERMS_AND_CONDITIONS_ROUTE]: TermsAndConditionsScreen,
});

export const Tabs = createBottomTabNavigator(
  {
    [DASHBOARD_ROUTE]: { screen: DashboardScreen },
    [JOB_INVITES_ROUTE]: { screen: JobInvites },
    [JOB_PREFERENCES_ROUTE]: { screen: JobPreferences },
    [MYJOBS_ROUTE]: { screen: MyJobs },
    [Profile.routeName]: { screen: Profile },
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeBackgroundColor: 'white',
      inactiveBackgroundColor: 'white',
      activeTintColor: 'black',
      inactiveTintColor: '#D3D3D3',
      showLabel: true,
      showIcon: true,
      labelStyle: {
        fontSize: 10,
      },
      style: {
        backgroundColor: 'white',
        height: 60,
        borderTopColor: 'transparent',
      },
      tabStyle: {
        width: 100,
      },
    },
  },
);

export const AppStack = createStackNavigator(
  {
    Tabs,
    [SETTING_ROUTE]: SettingScreen,
    [RESET_ROUTE]: ChangePassword,
    [UploadDocumentScreen.routeName]: UploadDocumentScreen,
    [FederalW4tScreen.routeName]: FederalW4tScreen,
    [BackgroundCheckScreen.routeName]: BackgroundCheckScreen,
    [BankAccounts.routeName]: BankAccounts,
    [AddBankAccount.routeName]: AddBankAccount,
    [EditProfile.routeName]: EditProfile,
    [PublicProfile.routeName]: PublicProfile,
    [JOB_PREFERENCES_ONBOARDING_ROUTE]: { screen: JobPreferencesOnboarding },
    [POSITION_ONBOARDING_ROUTE]: { screen: PositionOnboarding },
    [LOCATION_ONBOARDING_ROUTE]: { screen: LocationOnboarding },
    [AVAILABILITY_ONBOARDING_ROUTE]: { screen: AvailabilityOnboarding },
    [PICTURE_ONBOARDING_ROUTE]: { screen: PictureOnboarding },
    [DOB_ONBOARDING_ROUTE]: { screen: DOBOnboarding },
    [RESUME_ONBOARDING_ROUTE]: { screen: ResumeOnboarding },
    [EDIT_LOCATION_ROUTE]: EditLocation,
    [AVAILABILITY_ROUTE]: Availability,
    [POSITION_ROUTE]: Position,
    [RATE_EMPLOYER_ROUTE]: RateEmployer,
    [REVIEWS_ROUTE]: Reviews,
    // [INVITE_DETAILS_ROUTE]: {
    //   screen: InviteDetails,
    //   path: 'invite/:inviteId',
    // },
    [INVITE_DETAILS_ROUTE_V2]: {
      screen: InviteDetailsV2,
      path: 'invite/:inviteId',
    },
    [UpcomingJobScreen.routeName]: {
      screen: UpcomingJobScreen,
      path: 'shift/:shiftId',
    },
    [WorkModeScreen.routeName]: {
      screen: WorkModeScreen,
    },
    [JOB_DETAILS_NEW_ONE_ROUTE]: {
      screen: JobDetailsNewOneScreen,
    },
    [JOB_DETAILS_NEW_TWO_ROUTE]: {
      screen: JobDetailsNewTwoScreen,
    },
    [JOB_PAYMENTS_ROUTE]: {
      screen: JobPaymentsScreen,
    },
    [ApplicationDetailScreen.routeName]: {
      screen: ApplicationDetailScreen,
      path: 'application/:applicationId',
    },
    [JobCompletedScreen.routeName]: {
      screen: JobCompletedScreen,
      path: 'job-completed/:shiftId',
    },
    [HELP_ROUTE]: {
      screen: Help,
    },
  },
  { navigationOptions: { header: null } },
);

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: Splash,
    [AUTH_ROUTE]: AuthStack,
    [APP_ROUTE]: AppStack,
    [UPDATE_APP_ROUTE]: UpdateApp,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

const prefix = 'https://talent.jobcore.co/';

export default () => (
  <Root>
    <SwitchNavigator uriPrefix={prefix} />
  </Root>
);
