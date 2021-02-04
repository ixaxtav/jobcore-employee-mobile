import React, { Component } from 'react';
import {
  View,
  Image,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  H1,
  H3,
  H4,
  Container,
  ListItem,
  Header,
  Body,
  Content,
  List,
  Button,
  Text,
  FooterTab,
  Footer,
  Icon,
} from 'native-base';
import {
  REGISTER_ROUTE,
  FORGOT_ROUTE,
  APP_ROUTE,
  VALIDATION_CODE_ROUTE,
  JOB_PREFERENCES_ONBOARDING_ROUTE,
  DASHBOARD_ROUTE,
  PICTURE_ONBOARDING_ROUTE,
} from '../../constants/routes';
import { TabHeaderWhite } from '../../shared/components/TabHeaderWhite';

import styles from '../Invite/AvailabilityStyle';
import { BLACK_MAIN } from '../../shared/colorPalette';
import * as inviteActions from '../Invite/actions';
import inviteStore from '../Invite/InviteStore';
import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
import { LOG } from '../../shared';
import { Loading } from '../../shared/components';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { ModalHeader } from '../../shared/components/ModalHeader';
import { availabilityModel } from '../Invite/availability-model';

class AvailabilityOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRefreshing: false,
      startTimePickerVisible: false,
      endTimePickerVisible: false,
      selectedAvailability: {},
      availability: availabilityModel,
    };
  }

  componentDidMount() {
    this.editAvailabilitySubscription = inviteStore.subscribe(
      'EditAvailability',
      (data) => this.editAvailabilityHandler(data),
    );
    this.getAvailabilitySubscription = inviteStore.subscribe(
      'GetAvailability',
      (data) => this.getAvailabilityHandler(data),
    );
    this.regenerateAvailabilitySubscription = inviteStore.subscribe(
      'RegenerateAvailability',
      () => this.getAvailability(),
    );
    this.deleteAvailabilitySubscription = inviteStore.subscribe(
      'DeleteAvailability',
      () => this.getAvailability(),
    );
    this.inviteStoreError = inviteStore.subscribe('InviteStoreError', (err) =>
      this.errorHandler(err),
    );

    // if (!this.state.availability.length) {
    this.getAvailability();
    // }
  }

  componentWillUnmount() {
    this.editAvailabilitySubscription.unsubscribe();
    this.deleteAvailabilitySubscription.unsubscribe();
    this.regenerateAvailabilitySubscription.unsubscribe();
    this.getAvailabilitySubscription.unsubscribe();
    this.inviteStoreError.unsubscribe();
  }

  editAvailabilityHandler = (data) => {
    LOG(this, `Edit availability: ${JSON.stringify(data)}`);
    this.getAvailability();
  };

  getAvailabilityHandler = (availabilityFromDB) => {
    console.log('availabilityFromDB: ', availabilityFromDB);
    let availability = this.state.availability;
    const availabilityHandled = availability.map((day) => {
      const dayFromDB = availabilityFromDB.filter(
        (dayFromDB) => moment(dayFromDB.starting_at).day() === day.day_number,
      )[0];
      // console.log("dayFromDB: ", dayFromDB)
      if (
        availabilityFromDB.filter(
          (dayFromDB) => moment(dayFromDB.starting_at).day() === day.day_number,
        ).length > 0
      ) {
        return {
          ...dayFromDB,
          day_number: moment(dayFromDB.starting_at).day(),
          available: true,
        };
      }
      return {
        ...day,
        available: false,
      };
    });
    this.setState({
      availability: availabilityHandled,
      isRefreshing: false,
    });

    this.isLoading(false);
  };

  errorHandler = () => {
    this.isLoading(false);
    this.setState({ isRefreshing: false });
  };
  render() {
    return (
      <I18n>
        {(t) => (
          <Container>
            <TabHeaderWhite
              goBack
              onPressBack={() => this.props.navigation.goBack()}
              // title={t('EDIT_PROFILE.editProfile')}
            />
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.refreshAvailability}
                />
              }>
              <View
                style={{
                  paddingLeft: 25,
                  paddingTop: 25,
                  paddingRight: 25,
                }}>
                <H1
                  style={{
                    marginBottom: 15,
                    fontWeight: 700,
                    fontSize: 32,
                    lineHeight: 45,
                  }}>
                  What is your availability to work?
                </H1>
                {/* <Text style={{fontSize: 18, color: "gray"}}>
              We'll set you up with nearby employers.
              </Text> */}
              </View>
              <DateTimePicker
                mode={'time'}
                is24Hour={false}
                isVisible={this.state.startTimePickerVisible}
                onConfirm={(date) => this.handleStartTimePicked(date)}
                onCancel={this.hideStartTimePicker}
              />
              <DateTimePicker
                mode={'time'}
                is24Hour={false}
                isVisible={this.state.endTimePickerVisible}
                onConfirm={(date) => this.handleEndTimePicked(date)}
                onCancel={this.hideEndTimePicker}
              />

              <View style={styles.viewContainer}>
                <List>
                  <ListItem style={styles.itemSelectCheck}>
                    <Body>
                      <Text style={styles.textAlldayOr}>
                        {`${t('JOB_PREFERENCES.allday')}   ${t(
                          'JOB_PREFERENCES.notAvailable',
                        )}   ${t('JOB_PREFERENCES.orSpecificTime')}`}
                      </Text>
                    </Body>
                  </ListItem>
                  {Array.isArray(this.state.availability)
                    ? this.state.availability.map((block) => (
                        <ListItem key={block.id} style={styles.itemSelectCheck}>
                          <View style={styles.viewContainerItems}>
                            <View style={styles.viewTextDay}>
                              <Text style={styles.textDay}>
                                {moment(block.starting_at)
                                  .tz(moment.tz.guess())
                                  .format('ddd')}
                              </Text>
                            </View>
                            <View style={styles.viewRadio}>
                              <View style={styles.radioItems}>
                                <View style={styles.radio}>
                                  <TouchableOpacity
                                    style={styles.radioButtonLeft}
                                    onPress={() => this.setAllday(true, block)}
                                    rounded
                                    transparent>
                                    <Icon
                                      name={
                                        block.allday && block.available
                                          ? 'md-radio-button-on'
                                          : 'md-radio-button-off'
                                      }
                                      style={{
                                        color:
                                          block.allday && block.available
                                            ? 'black'
                                            : '#808080',
                                        fontSize: 24,
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>
                                <View style={styles.radio}>
                                  <TouchableOpacity
                                    style={styles.radioButtonLeft}
                                    onPress={() =>
                                      this.deleteAvailability(block)
                                    }
                                    rounded
                                    transparent>
                                    <Icon
                                      name={
                                        !block.available
                                          ? 'md-radio-button-on'
                                          : 'md-radio-button-off'
                                      }
                                      style={{
                                        color: !block.available
                                          ? 'black'
                                          : '#808080',
                                        fontSize: 24,
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>
                                <View style={styles.radio}>
                                  <TouchableOpacity
                                    style={styles.radioButtonRight}
                                    onPress={() => this.setAllday(false, block)}
                                    rounded
                                    transparent>
                                    <Icon
                                      name={
                                        !block.allday && block.available
                                          ? 'md-radio-button-on'
                                          : 'md-radio-button-off'
                                      }
                                      style={{
                                        color:
                                          !block.allday && block.available
                                            ? 'black'
                                            : '#808080',
                                        fontSize: 24,
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                            {block.allday === false && block.available ? (
                              <View style={styles.viewPicker}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginLeft: 50,
                                  }}>
                                  <Button
                                    onPress={() =>
                                      this.showStartTimePicker(block)
                                    }
                                    style={styles.buttonHour}
                                    rounded
                                    bordered
                                    small>
                                    <Text style={styles.textHour}>
                                      {moment(block.starting_at)
                                        .tz(moment.tz.guess())
                                        .format('h:mma')}
                                    </Text>
                                  </Button>
                                  <View style={styles.textToView}>
                                    <Text style={styles.textTo}>
                                      {t('APP.to')}
                                    </Text>
                                  </View>
                                  <Button
                                    onPress={() =>
                                      this.showEndTimePicker(block)
                                    }
                                    style={styles.buttonHour}
                                    rounded
                                    bordered
                                    small>
                                    <Text style={styles.textHour}>
                                      {moment(block.ending_at)
                                        .tz(moment.tz.guess())
                                        .format('h:mma')}
                                    </Text>
                                  </Button>
                                </View>
                              </View>
                            ) : null}
                          </View>
                        </ListItem>
                      ))
                    : null}
                </List>
              </View>
            </Content>
            <Footer
              style={{
                backgroundColor: 'white',
                borderBottomWidth: 0,
                borderTopWidth: 0,
              }}>
              <FooterTab>
                <Button
                  full
                  style={{ backgroundColor: 'black', borderRadius: 0 }}
                  onPress={() =>
                    this.props.navigation.navigate(PICTURE_ONBOARDING_ROUTE)
                  }>
                  <Text style={{ color: 'white', fontSize: 18 }}>Next</Text>
                </Button>
              </FooterTab>
            </Footer>
          </Container>
        )}
      </I18n>
    );
  }
  showStartTimePicker = (availability) => {
    this.setState({
      selectedAvailability: availability,
      startTimePickerVisible: true,
    });
  };

  showEndTimePicker = (availability) => {
    this.setState({
      selectedAvailability: availability,
      endTimePickerVisible: true,
    });
  };

  hideStartTimePicker = () => {
    this.setState({ startTimePickerVisible: false });
  };

  hideEndTimePicker = () => {
    this.setState({ endTimePickerVisible: false });
  };

  /**
   * handle StartTime Picked
   * @param  {date} dateTime date string from the timePicker
   */
  handleStartTimePicked = (dateTime) => {
    this.hideStartTimePicker();

    this.editAvailabilityTime(
      dateTime,
      this.state.selectedAvailability,
      'starting_at',
    );
  };

  /**
   * handle EndTime Picked
   * @param  {date} dateTime date string from the timePicker
   */
  handleEndTimePicked = (dateTime) => {
    this.hideEndTimePicker();

    this.editAvailabilityTime(
      dateTime,
      this.state.selectedAvailability,
      'ending_at',
    );
  };

  /**
   * Edit availability time (hour/minute) given a specific date with the time
   * used for timePicker handlers
   * @param  {object} availability   the availability block to change the time
   * @param  {date} dateTime date string to get the new hour/minute
   * @param  {'starting_at'|'ending_at'} startOrEndDate the field to update
   */
  editAvailabilityTime(dateTime, availability, startOrEndDate) {
    if (
      !availability ||
      (startOrEndDate !== 'starting_at' && startOrEndDate !== 'ending_at')
    ) {
      return;
    }

    const availabilityCopy = Object.assign({}, availability);
    const hour = moment(dateTime)
      .tz(moment.tz.guess())
      .get('hour');
    const minute = moment(dateTime)
      .tz(moment.tz.guess())
      .get('minute');

    availabilityCopy[startOrEndDate] = moment(availabilityCopy[startOrEndDate])
      .set('minute', minute)
      .set('hour', hour)
      .toISOString();

    this.editAvailabilityDates(availabilityCopy);
  }

  /**
   * To edit allday value
   * @param  {boolean} allday if available all day
   * @param {object} availability the availability block
   */
  setAllday(allday, availability) {
    this.isLoading(true);
    if (!availability) return;

    if (availability.available) {
      const availabilityCopy = Object.assign({}, availability);
      availabilityCopy.allday = allday;

      inviteActions.editAvailability(availabilityCopy);
    } else {
      const obj = {
        starting_at: availability.starting_at,
        ending_at: availability.ending_at,
        allday: allday,
        recurrency_type: 'WEEKLY',
        recurrent: true,
      };
      inviteActions.regenerateAvailability(obj);
    }
  }
  /**
   * To delete current day
   * @param {object} availability the availability block
   */
  deleteAvailability(availability) {
    this.isLoading(true);
    if (!availability) return;

    inviteActions.deleteAvailability(availability);
  }

  editAvailabilityAllday = (availability) => {
    if (!availability) return;

    inviteActions.editAvailabilityAllday(availability.allday, availability.id);
  };

  editAvailabilityDates = (availability) => {
    if (!availability) return;

    inviteActions.editAvailabilityDates(
      availability.starting_at,
      availability.ending_at,
      availability,
    );
  };

  refreshAvailability = () => {
    this.setState({ isRefreshing: true });
    this.getAvailability();
  };

  getAvailability = () => {
    inviteActions.getAvailability();
  };

  isLoading = (isLoading) => {
    this.setState({ isLoading });
  };
}

export default AvailabilityOnboarding;
