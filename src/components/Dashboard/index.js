/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import {
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import { Label, ListItem, Text, Thumbnail, Button, Icon } from 'native-base';
import styles from './style';
import {
  // VIOLET_MAIN,
  LOW_RED,
  BLUE_MAIN,
  BLACK_MAIN,
} from '../../shared/colorPalette';
import {
  AUTH_ROUTE,
  INVITE_DETAILS_ROUTE_V2,
  JOB_INVITES_ROUTE,
  JOB_PREFERENCES_ONBOARDING_ROUTE,
  MYJOBS_ROUTE,
  REVIEWS_ROUTE,
  JOB_PAYMENTS_ROUTE,
  EMPLOYEE_ONBOARDING_ROUTE,
} from '../../constants/routes';
import moment from 'moment';
import accountStore from '../Account/AccountStore';
import * as accountActions from '../Account/actions';
import * as inviteActions from '../Invite/actions';
import inviteStore from '../Invite/InviteStore';
import * as fcmActions from './actions';
import fcmStore from './FcmStore';
import * as jobActions from '../MyJobs/actions';
import jobStore from '../MyJobs/JobStore';
import { JOB_PREFERENCES_ROUTE } from '../../constants/routes';
import {
  // BackgroundHeader,
  CustomToast,
  Loading,
} from '../../shared/components';
import { LOG, WARN } from '../../shared';
import StarComponent from './starsComponent';
import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
import firebase from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';
import PROFILE_IMG from '../../assets/image/profile.png';
import { TabHeader } from '../../shared/components/TabHeader';
import { Permission, PERMISSION_TYPE } from '../../shared/permission';
// import preferencesStyles from '../Invite/JobPreferencesStyle';
import JobCompletedScreen from '../MyJobs/JobCompletedScreen';
import WorkModeScreen from '../MyJobs/WorkModeScreen';
import { getOpenClockIns } from '../MyJobs/actions';
import EditProfile from '../Account/EditProfile';
import Profile from '../Account/Profile';
import UpcomingJobScreen from '../MyJobs/UpcomingJobScreen';
import ApplicationDetailScreen from '../MyJobs/ApplicationDetailScreen';
import { fetchActiveShiftsV2, getCompletedJobs } from '../MyJobs/actions';
import { log } from 'pure-logger';
import UploadDocumentScreen from '../Account/UploadDocumentScreen';
import FederalW4tScreen from '../Account/FederalW4tScreen';

/**
 *
 */
class DashboardScreen extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: i18next.t('DASHBOARD.dashboard'),
    tabBarIcon: ({ tintColor }) => (
      <Icon
        type="MaterialCommunityIcons"
        style={{ color: tintColor || 'black' }}
        name="view-dashboard"
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      user: (accountStore.getState('Login') || {}).user || {},
      isLoading: false,
      filterSelected: 'getPendingPayments',
      isRefreshing: false,
      stopReceivingInvites: false,
      rating: 0,
      payments: 0,
      invites: [],
      upcomingJobs: [],
      positions: [],
      jobs: [],
      tomorrowDay: false,
      status: '',
      location: '',
      todayDay: false,
      nextShift: null,
      jobsCompleted: [],
      activeShift: null,
      tabs: 1,
    };
  }

  async componentDidMount() {
    Permission.requestNotifyPermission();

    this.logoutSubscription = accountStore.subscribe(
      'Logout',
      this.logoutHandler,
    );
    this.getPendingPaymentsSubscription = jobStore.subscribe(
      'GetPendingPayments',
      this.getPaymentsHandler,
    );
    this.logoutSubscription = accountStore.subscribe(
      'ActiveShifts',
      (shifts) => {
        if (shifts) this.setState({ activeShift: shifts[0] });
      },
    );
    this.loginSubscription = accountStore.subscribe('Login', (data) => {
      this.loginHandler(data);
    });
    this.getEmployeeSubscribe = jobStore.subscribe('GetEmployee', (data) => {
      this.getEmployeeHandler(data);
    });

    this.stopReceivingInvitesSubscription = inviteStore.subscribe(
      'StopReceivingInvites',
      (data) => {
        this.stopReceivingInvitesHandler(data);
      },
    );
    this.I9FormSubscription = inviteStore.subscribe('I9Form', (data) => {
      this.i9Handler(data);
    });
    this.getJobInvitesSubscription = inviteStore.subscribe(
      'JobInvites',
      (jobInvites) => {
        this.getJobInvitesHandler(jobInvites);
      },
    );
    this.getUpcomingJobsSubscription = jobStore.subscribe(
      'GetUpcomingJobsDash',
      (data) => {
        this.getJobsHandler(data);
      },
    );
    this.getCompletedJobsSubscription = jobStore.subscribe(
      'GetCompletedJobsDash',
      (data) => {
        this.getJobsHandler(data);
      },
    );

    this.updateTokenSubscription = fcmStore.subscribe(
      'UpdateFcmToken',
      (data) => {
        const session = accountStore.getState('Login');
        session.fcmToken = data.registration_id;
        accountActions.setStoredUser(session);
        LOG(this, `fcmToken updated ${data.registration_id}`);
      },
    );
    this.fcmStoreError = fcmStore.subscribe('FcmStoreError', (err) => {
      this.errorHandler(err);
    });
    this.inviteStoreError = inviteStore.subscribe('InviteStoreError', (err) => {
      this.errorHandler(err);
    });

    this.accountStoreError = accountStore.subscribe(
      'AccountStoreError',
      this.errorHandler,
    );

    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh((fcmToken) => {
        let fcmTokenStored;

        try {
          fcmTokenStored = accountStore.getState('Login').fcmToken;
        } catch (e) {
          return WARN(this, 'failed to get fcmToken from Store');
        }

        if (!fcmTokenStored) return WARN(this, 'No Token on state');

        this.updateFcmToken(fcmTokenStored, fcmToken);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        if (notificationOpen) {
          // const action = notificationOpen.action;
          const notification = notificationOpen.notification;
          this.pushNotificationHandler(notification.data);
        }
      });

    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          // const action = notificationOpen.action;
          const notification = notificationOpen.notification;
          this.pushNotificationHandler(notification.data);
        }
      });

    this.hasFcmMessagePermission();
    this.firstLoad();
    this.getFcmToken();
    fetchActiveShiftsV2();

    let openClockIns = [];
    try {
      openClockIns = await getOpenClockIns();
      this.setState({ openClockIns: openClockIns });
    } catch (e) {
      console.log(`SPLASH:openClockins`, e);
    }

    if (openClockIns.length > 0) {
      const shift = openClockIns[0].shift;
      return this.props.navigation.navigate(WorkModeScreen.routeName, {
        shiftId: shift.id,
      });
    }
    getCompletedJobs('dashboard');

    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.refreshOnAction();
      },
    );

    this.loadData();
    this.getEmployeeData();
  }

  componentWillUnmount() {
    this.logoutSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
    this.getEmployeeSubscribe.unsubscribe();
    this.stopReceivingInvitesSubscription.unsubscribe();
    this.I9FormSubscription.unsubscribe();
    this.getJobInvitesSubscription.unsubscribe();
    this.getUpcomingJobsSubscription.unsubscribe();
    this.getCompletedJobsSubscription.unsubscribe();
    this.getPendingPaymentsSubscription.unsubscribe();
    this.getJobPreferencesSubscription.unsubscribe();
    this.getLocationSubscription.unsubscribe();
    this.saveLocationSubscription.unsubscribe();
    this.updateTokenSubscription.unsubscribe();
    this.fcmStoreError.unsubscribe();
    this.inviteStoreError.unsubscribe();
    this.accountStoreError.unsubscribe();
    this.willFocusSubscription.unsubscribe();
    this.onTokenRefreshListener();
    this.notificationOpenedListener();
    //
    navigator.geolocation.getCurrentPosition(
      (data) => {
        console.log('geolocatoin', data);
        log(`Dashboard:`, data);
      },
      { maximumAge: 0, enableHighAccuracy: true },
    );
  }

  logoutHandler = () => {
    this.props.navigation.navigate(AUTH_ROUTE);
  };

  getPaymentsHandler = (payments) => {
    let emptyPayments = false;
    let totalAmount = 0,
      totalHours = 0;
    if (Array.isArray(payments) && !payments.length) emptyPayments = true;
    payments.forEach((payment) => {
      totalAmount += parseFloat(payment.total_amount);
      totalHours += parseFloat(payment.regular_hours);
    });
    this.setState({
      isLoading: false,
      isRefreshing: false,
      emptyPayments,
      payments: totalAmount,
    });
  };

  loadData = () => {
    this.setState({ isLoading: true }, () => {
      this.getPayments();
    });
  };

  loginHandler = (data) => {
    let user;

    try {
      user = data.user;
    } catch (e) {
      return LOG(this, data);
    }

    this.setState({ user: user });
  };

  // getJobPreferencesHandler = (data) => {
  //   console.log('job prefrence handler', data);
  //   // if(Array.isArray(data.positions) && data.positions.length == 0 )  this.props.navigation.navigate(JOB_PREFERENCES_ONBOARDING_ROUTE);
  //   // else if(!this.state.status && this.state.user.profile.bio != "" ) this.props.navigation.navigate(UploadDocumentScreen.routeName)

  //   // else{
  //     this.setState({
  //       isLoading: false,
  //       isRefreshing: false,
  //       positions: data.positions,
  //     });
  //   // }
  // };

  getEmployeeHandler = (data) => {
    let status;

    if (data.employment_verification_status == 'APPROVED') status = 'Approved';
    else {
      status = 'Not Approved';
    }

    this.setState({
      isLoading: false,
      isRefreshing: false,
      stopReceivingInvites: data.stop_receiving_invites,
      rating: Math.round(data.rating) || 'N/A',
      // payments: data.total_pending_payments,
      status: status,
      employee: data,
    });
  };

  stopReceivingInvitesHandler = (data) => {
    this.setState({
      stopReceivingInvites: data.stop_receiving_invites,
      isRefreshing: false,
    });
  };
  i9Handler = (data) => {
    this.setState((prevState) => {
      let employee = Object.assign({}, prevState.employee);
      employee.i9form = data;
      return { employee };
    });
  };

  getJobInvitesHandler = (invites) => {
    this.setState({
      invites,
      isRefreshing: false,
    });

    // set invitationCount param for the badge on invitations tab
    if (Array.isArray(invites)) {
      const setParamsAction = NavigationActions.setParams({
        params: { invitationCount: invites.length },
        key: JOB_INVITES_ROUTE,
      });

      this.props.navigation.dispatch(setParamsAction);
    }
  };

  getJobsHandler = async (jobsData) => {
    let nextShift =
      (await jobsData) &&
      jobsData.filter(
        (job) =>
          moment(job.starting_at)
            .tz(moment.tz.guess())
            .format() >
          moment(new Date())
            .tz(moment.tz.guess())
            .format(),
      )[0];

    if (nextShift) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowEntry = moment(tomorrow)
        .tz(moment.tz.guess())
        .format('MMM DD YY');
      const shiftDayNext = moment(nextShift.starting_at)
        .tz(moment.tz.guess())
        .format('MMM DD YY');

      if (tomorrowEntry === shiftDayNext) {
        this.setState({
          tomorrowDay: true,
          todayDay: false,
        });
      }
      if (moment(today).format('MMM DD YY') === shiftDayNext) {
        this.setState({
          todayDay: true,
          tomorrowDay: false,
        });
      }
    }
    this.setState({
      jobs: [...jobsData],
      isRefreshing: false,
      isLoading: false,
      nextShift,
    });
  };

  pushNotificationHandler = (notificationData) => {
    if (!notificationData) {
      return LOG(this, 'no notification data');
    }

    if (notificationData.type === 'shift' && notificationData.id) {
      this.props.navigation.navigate(UpcomingJobScreen.routeName, {
        shiftId: notificationData.id,
      });

      this.getUpcomingJobs('dashboard');
    }

    if (notificationData.type === 'application' && notificationData.id) {
      this.props.navigation.navigate(ApplicationDetailScreen.routeName, {
        applicationId: notificationData.id,
      });

      this.getPendingJobs();
    }

    if (notificationData.type === 'invite' && notificationData.id) {
      this.props.navigation.navigate(INVITE_DETAILS_ROUTE_V2, {
        inviteId: notificationData.id,
      });

      this.getInvites();
    }

    if (
      notificationData.type === 'rating' ||
      notificationData.type === 'ratings'
    ) {
      this.props.navigation.navigate(REVIEWS_ROUTE);
    }
  };

  getPayments = () => {
    jobActions[this.state.filterSelected]();
  };

  goToJobDetails = (job) => {
    console.log('JOB', job);
    const { navigation } = this.props;
    if (!job) return;
    if (
      !(
        job.applicationId === null ||
        job.applicationId === undefined ||
        job.applicationId === ''
      )
    ) {
      return navigation.navigate(ApplicationDetailScreen.routeName, {
        applicationId: job.applicationId,
      });
    }
    const now = moment();
    const clockOutDelta = job.maximum_clockout_delay_minutes || 120;
    const trueEndingAt = moment
      .utc(job.ending_at)
      .add(clockOutDelta, 'minutes');

    if (now.isAfter(trueEndingAt)) {
      return navigation.navigate(JobCompletedScreen.routeName, {
        shiftId: job.id,
      });
    }

    if (now.isAfter(moment.utc(job.starting_at))) {
      return navigation.navigate(WorkModeScreen.routeName, {
        shiftId: job.id,
      });
    }
    if (
      this.state.openClockIns &&
      this.state.openClockIns.length > 0 &&
      this.state.openClockIns.find((e) => e.shift.id == job.id)
    ) {
      return navigation.navigate(WorkModeScreen.routeName, {
        shiftId: job.id,
      });
    }

    this.props.navigation.navigate(UpcomingJobScreen.routeName, {
      shiftId: job.id,
    });
  };

  _renderItemJobs = ({ item }) => {
    return (
      <I18n>
        {(t) => (
          <ListItem
            onPress={() => this.goToJobDetails(item)}
            style={styles.viewListItem}>
            <View
            // style={{
            //   shadowOffset: {
            //     width: 0,
            //     height: 1,
            //   },
            //   shadowOpacity: 0.93,
            //   shadowRadius: 1.62,
            // }}
            >
              <Thumbnail
                medium
                source={
                  item.employer && item.employer.picture
                    ? { uri: item.employer.picture }
                    : PROFILE_IMG
                }
              />
            </View>
            <View style={styles.viewDataOffers}>
              {/* title info */}
              {item.employer ? (
                <Text style={styles.viewTitleInfo}>
                  {item.employer ? (
                    <Text style={styles.textEmployer}>
                      {item.employer.title}
                    </Text>
                  ) : null}
                  <Text> </Text>
                  {item.position ? (
                    <Text style={styles.textShiftTitle}>
                      {item.position.title}
                    </Text>
                  ) : null}
                  <Text
                    style={{
                      color: 'gray',
                    }}>
                    {` ${t('JOB_PREFERENCES.dateStartToEnd', {
                      startingAt: moment(item.starting_at)
                        .tz(moment.tz.guess())
                        .format('lll'),
                      endingAt: moment(item.ending_at)
                        .tz(moment.tz.guess())
                        .format('lll'),
                    })} `}
                  </Text>
                  <Text style={styles.textRed}>
                    {`$${item.minimum_hourly_rate}/${t('JOB_INVITES.hr')}.`}
                  </Text>
                </Text>
              ) : null}
              {item.status === 'EXPIRED' && (
                <Label
                  style={{
                    color: 'black',
                  }}>
                  Completed
                </Label>
              )}
            </View>
          </ListItem>
        )}
      </I18n>
    );
  };

  _renderItemInvites = ({ item }) => {
    const { navigation } = this.props;
    return (
      <I18n>
        {(t) => (
          <ListItem
            onPress={() =>
              navigation.navigate(INVITE_DETAILS_ROUTE_V2, {
                inviteId: item.id,
              })
            }
            style={styles.viewListItem}>
            <View
            // style={{
            //   shadowOffset: {
            //     width: 0,
            //     height: 1,
            //   },
            //   shadowOpacity: 0.93,
            //   shadowRadius: 1.62,
            // }}
            >
              <Thumbnail
                medium
                source={
                  item.shift &&
                  item.shift.employer &&
                  item.shift.employer.picture
                    ? { uri: item.shift.employer.picture }
                    : PROFILE_IMG
                }
              />
            </View>
            <View style={styles.viewDataOffers}>
              {/* title info */}
              {item.shift ? (
                <Text style={styles.viewTitleInfo}>
                  {item.shift.employer ? (
                    <Text style={styles.textEmployer}>
                      {item.shift.employer.title}
                    </Text>
                  ) : null}
                  <Text style={styles.textGray}>
                    {` ${t('JOB_INVITES.lookingFor')} `}
                  </Text>
                  {item.shift.position ? (
                    <Text style={styles.textShiftTitle}>
                      {item.shift.position.title}
                    </Text>
                  ) : null}
                  <Text
                    style={{
                      color: 'gray',
                    }}>
                    {` ${t('JOB_PREFERENCES.dateStartToEnd', {
                      startingAt: moment(item.shift.starting_at)
                        .tz(moment.tz.guess())
                        .format('lll'),
                      endingAt: moment(item.shift.ending_at)
                        .tz(moment.tz.guess())
                        .format('lll'),
                    })} `}
                  </Text>
                  <Text style={styles.textRed}>
                    {`$${item.shift.minimum_hourly_rate}/${t(
                      'JOB_INVITES.hr',
                    )}.`}
                  </Text>
                </Text>
              ) : null}
            </View>
          </ListItem>
        )}
      </I18n>
    );
  };

  errorHandler = (err) => {
    this.setState({
      isLoading: false,
      isRefreshing: false,
    });
    CustomToast(err, 'danger');
  };

  render() {
    const {
      activeShift,
      invites,
      user,
      payments,
      rating,
      jobs,
      tabs,
      isRefreshing,
      nextShift,
      tomorrowDay,
      todayDay,
    } = this.state;
    return (
      <I18n>
        {(t) => (
          <View
            style={{
              flex: 1,
            }}>
            {this.state.isLoading ? <Loading /> : null}
            <TabHeader
              title={t('DASHBOARD.dashboard')}
              screenName={'dashboard'}
            />
            {this.state.employee &&
              this.state.employee.i9form &&
              this.state.employee.i9form.status == 'PENDING' && (
                <View
                  style={{
                    backgroundColor: '#f0ad4e',
                    padding: 10,
                    borderTopWidth: 0.5,
                    borderColor: 'black',
                  }}>
                  <React.Fragment>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontWeight: '700',
                      }}>
                      <Icon
                        style={{ color: 'black', fontSize: 14 }}
                        type="FontAwesome"
                        name={'exclamation-circle'}
                      />
                      {' Employment Verification Required'}
                    </Text>
                  </React.Fragment>
                </View>
              )}

            {this.state.employee && !this.state.employee.i9form && (
              <View
                style={{
                  backgroundColor: LOW_RED,
                  padding: 10,
                  borderTopWidth: 0.5,
                  borderColor: 'black',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate(
                      UploadDocumentScreen.routeName,
                    )
                  }>
                  <React.Fragment>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontWeight: '700',
                      }}>
                      <Icon
                        style={{ color: 'black', fontSize: 14 }}
                        type="FontAwesome"
                        name={'exclamation-circle'}
                      />
                      {' Employment Verification Required'}
                    </Text>
                  </React.Fragment>
                </TouchableOpacity>
              </View>
            )}

            {this.state.employee && this.state.employee.w4_year == 0 ? (
              <View
                style={{
                  backgroundColor: LOW_RED,
                  borderTopWidth: 0.5,
                  borderColor: 'black',
                  padding: 10,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate(FederalW4tScreen.routeName)
                  }>
                  <React.Fragment>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}>
                      <Icon
                        style={{ color: 'black', fontSize: 14 }}
                        type="FontAwesome"
                        name={'exclamation-circle'}
                      />{' '}
                      W-4 Form Required
                    </Text>

                    {/* <View
                    style={{
                      flexDirection: 'row',
                    }}>
             
                    <Text
                      style={{
                        color: BLACK_MAIN,
                        fontSize: 13,
                        marginRight: 3,
                      }}>
                    Submit your W-4 Form to get the correct amount deducted from your paychecks.
                    </Text>
                  </View> */}
                  </React.Fragment>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.flexOne}>
              <TouchableOpacity
                onPress={this.goToProfile}
                style={styles.containerImg}>
                <Thumbnail
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: 33,
                    overflow: 'hidden',
                  }}
                  source={
                    user && user.profile && user.profile.picture
                      ? { uri: user.profile.picture }
                      : PROFILE_IMG
                  }
                />
              </TouchableOpacity>
              <View style={styles.profileInfoContainer}>
                {user && (
                  <TouchableOpacity
                    style={{ paddingBottom: 10 }}
                    onPress={this.goToEditProfile}>
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize:
                          Dimensions.get('window').width <= 400 ? 17 : 19,
                      }}>
                      {`${this.state.user.first_name} ${this.state.user.last_name}`}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* <View style={{flexDirection: 'row'}}>
                <Text style={styles.amountText, {fontSize: 12}}>Status: <Text style={{color: 'black', fontWeight: '800', fontSize: 12}}>{this.state.status}</Text></Text>
                </View> */}

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    paddingBottom: 10,
                  }}>
                  <Text style={(styles.amountText, { fontSize: 12 })}>
                    Status{' '}
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: '800',
                        fontSize: 12,
                      }}>
                      {this.state.status}
                    </Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.goToReviews}
                  style={{
                    flexDirection: 'row',
                    paddingBottom: 10,
                  }}>
                  <Text style={(styles.yourRating, { fontSize: 12 })}>
                    Your Rating{' '}
                  </Text>
                  <StarComponent rating={rating} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.goToPayments}
                  style={{
                    flexDirection: 'row',
                    paddingBottom: 10,
                  }}>
                  <Text style={(styles.amountText, { fontSize: 12 })}>
                    Amount{' '}
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: '800',
                      fontSize: 12,
                    }}>
                    ${payments.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                styles.flexTwo,
                {
                  backgroundColor: activeShift ? LOW_RED : 'white',
                },
              ]}>
              {activeShift ? (
                <React.Fragment>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 13,
                      fontWeight: '700',
                    }}>
                    You are in an active Shift:
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 13,
                      marginRight: 3,
                    }}>
                    {activeShift.position.title} from{' '}
                    {moment(activeShift.starting_at)
                      .tz(moment.tz.guess())
                      .format('h:mm a')}{' '}
                    to{' '}
                    {moment(activeShift.ending_at)
                      .tz(moment.tz.guess())
                      .format('h:mm a')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate(WorkModeScreen.routeName, {
                        shiftId: activeShift.id,
                      });
                    }}>
                    <Text style={styles.styleWorkMode}>WORK MODE</Text>
                  </TouchableOpacity>
                </React.Fragment>
              ) : nextShift ? (
                <React.Fragment>
                  <TouchableOpacity
                    onPress={() => this.goToJobDetails(nextShift)}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontWeight: '700',
                      }}>
                      Next Shift:
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        marginRight: 3,
                      }}>
                      {nextShift.position.title} {todayDay && 'Today'}
                      {tomorrowDay && 'Tomorrow'}
                      {!tomorrowDay &&
                        !todayDay &&
                        moment(nextShift.starting_at)
                          .tz(moment.tz.guess())
                          .format('MMM DD YY')}{' '}
                      from{' '}
                      {moment(nextShift.starting_at)
                        .tz(moment.tz.guess())
                        .format('h:mm a')}{' '}
                      to{' '}
                      {moment(nextShift.ending_at)
                        .tz(moment.tz.guess())
                        .format('h:mm a')}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontWeight: '700',
                    }}>
                    No Available Shifts
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      marginRight: 3,
                    }}>
                    You have no upcoming shifts, make sure to
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate(JOB_PREFERENCES_ROUTE)
                      }>
                      <Text style={styles.flexiStyle}>
                        flexibilize your preferences
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        marginRight: 3,
                      }}>
                      to get more job invites
                    </Text>
                  </View>
                </React.Fragment>
              )}
            </View>
            <View style={styles.flexThree}>
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      tabs: 1,
                    })
                  }
                  style={[
                    styles.tabOne,
                    {
                      backgroundColor: tabs === 1 ? 'black' : 'white',
                    },
                  ]}>
                  {/* <View style={styles.pointBlack} /> */}
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: tabs === 1 ? 'white' : 'black',
                      }}>
                      Invitations ({invites && invites.length})
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      tabs: 2,
                    })
                  }
                  style={[
                    styles.tabTwo,
                    {
                      backgroundColor: tabs === 2 ? 'black' : 'white',
                    },
                  ]}>
                  {/* <View style={styles.pointBlack} /> */}
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: tabs === 2 ? 'white' : 'black',
                      }}>
                      Jobs ({jobs && jobs.length})
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* <View style={styles.containerTextInvitationJobs}>
                <View style={styles.containerChildTextInvitation}>
                  <Text
                    style={{
                      fontSize: 12,
                    }}>
                    Invitations ({invites && invites.length})
                  </Text>
                </View>
                <View style={styles.containerChildTextInvitation}>
                  <Text
                    style={{
                      fontSize: 12,
                    }}>
                    Jobs ({jobs && jobs.length})
                  </Text>
                </View>
              </View> */}
            </View>
            <View
              style={{
                flex: 4,
                backgroundColor: 'white',
              }}>
              {tabs === 1 ? (
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={this.refresh}
                      tintColor={'#D3D3D3'}
                    />
                  }
                  data={invites}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this._renderItemInvites}
                  extraData={this.state}
                  ListEmptyComponent={
                    <Text style={styles.emptyTableText}>
                      You don't have invitations
                    </Text>
                  }
                />
              ) : (
                <View style={{ flex: 1 }}>
                  <FlatList
                    refreshControl={
                      <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={this.refresh}
                        tintColor={'#D3D3D3'}
                      />
                    }
                    data={jobs}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItemJobs}
                    extraData={this.state}
                    ListEmptyComponent={
                      <Text style={styles.emptyTableText}>
                        You don't have jobs
                      </Text>
                    }
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </I18n>
    );
  }

  onMessage = (e) => console.log(e);
  onLoad = (e) => console.log(e);
  onLoad = (e) => console.log(e);
  onLoad = (e) => console.log(e);

  firstLoad = () => {
    this.setState({ isLoading: true }, () => {
      this.getEmployee();
      this.getInvites();
      this.getUpcomingJobs('dashboard');
    });
  };

  refresh = async () => {
    console.log('Refresh 1');
    this.setState({ isRefreshing: true, isLoading: true });
    console.log('Refresh 2');
    await this.getEmployee();
    console.log('Refresh 22');
    await this.getInvites();
    console.log('Refresh 3');
    await this.getUpcomingJobs('dashboard');
    console.log('Refresh 4');
    await getCompletedJobs('dashboard');
    console.log('Refresh 5');
  };
  refreshOnAction = async () => {
    console.log('Refresh Action 1');
    await this.getInvites();
    console.log('Refresh Action 2');
    await this.getUpcomingJobs('dashboard');
    console.log('Refresh Action 3');
    await getCompletedJobs('dashboard');
  };

  getFcmToken = () => {
    let fcmTokenStored;

    try {
      fcmTokenStored = accountStore.getState('Login').fcmToken;
    } catch (e) {
      return WARN(this, 'failed to get fcmToken from Store');
    }

    if (!fcmTokenStored) return WARN(this, 'No Token on state');

    firebase
      .messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          if (fcmTokenStored !== fcmToken) {
            return this.updateFcmToken(fcmTokenStored, fcmToken);
          }
        } else {
          WARN(this, 'NoTokenYet');
        }
      });
  };

  updateFcmToken = (currentFcmToken, fcmToken) => {
    fcmActions.updateFcmToken(currentFcmToken, fcmToken);
  };
  getEmployeeData = () => {
    this.setState({ isLoading: true }, () => {
      jobActions.getEmployeeData();
    });
  };
  hasFcmMessagePermission = () => {
    firebase
      .messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          LOG(this, 'FCM has persmission');
        } else {
          LOG(this, 'FCM not permitted, requesting Permission');
          this.requestFcmMessagesPermission();
        }
      });
  };

  requestFcmMessagesPermission = () => {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        LOG(this, 'FCM authorized by the user');
      })
      .catch(() => {
        LOG(this, 'FCM permission rejected');
      });
  };

  goToInvitation = () => {
    this.props.navigation.navigate(JOB_INVITES_ROUTE);
  };

  goToEditProfile = () => {
    this.props.navigation.navigate(EditProfile.routeName);
  };

  goToMyJobs = () => {
    const tabAction = 'getUpcomingJobs';
    this.props.navigation.navigate(MYJOBS_ROUTE, { tabAction });
  };

  goToProfile = () => {
    this.props.navigation.navigate(Profile.routeName);
  };

  goToReviews = () => {
    this.props.navigation.navigate(REVIEWS_ROUTE);
  };

  goToPayments = () => {
    this.props.navigation.navigate(JOB_PAYMENTS_ROUTE);
  };

  getEmployee = () => {
    inviteActions.getJobPreferences();
  };

  stopReceivingInvites = () => {
    inviteActions.stopReceivingInvites(true);
  };

  startReceivingInvites = () => {
    inviteActions.stopReceivingInvites(false);
  };

  getInvites = () => {
    inviteActions.getJobInvites();
  };

  getUpcomingJobs = (type) => {
    jobActions.getUpcomingJobs(type);
  };

  getPendingJobs = () => {
    jobActions.getPendingJobs();
  };
}

export default DashboardScreen;
