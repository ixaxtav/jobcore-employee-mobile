import React, { Component } from 'react';
import { View, Image, Dimensions, Alert, TouchableOpacity } from 'react-native';
import {
  H1,
  H3,
  H4,
  Container,
  Title,
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
  AVAILABILITY_ONBOARDING_ROUTE,
  JOB_PREFERENCES_ONBOARDING_ROUTE,
  DASHBOARD_ROUTE,
} from '../../constants/routes';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import styles from '../Invite/EditLocationStyle';
import MARKER_IMG from '../../assets/image/map-marker.png';

import { GOOGLE_API_KEY } from 'react-native-dotenv';

import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
import { LOG } from '../../shared';
import { Loading, CustomToast, openMapsApp } from '../../shared/components';
import MapView, { Marker } from 'react-native-maps';
import accountStore from '../Account/AccountStore';

import {
  WHITE_MAIN,
  BLUE_DARK,
  BLUE_MAIN,
  GRAY_LIGHT,
  BLACK_MAIN,
} from '../../shared/colorPalette';
import { TabHeaderWhite } from '../../shared/components/TabHeaderWhite';
import inviteStore from '../Invite/InviteStore';
import * as inviteActions from '../Invite/actions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_LATIDUDE = 25.761681;
const DEFAULT_LONGITUDE = -80.191788;

class LocationOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: (accountStore.getState('getUser') || {}).user || {},
      isLoading: false,
      isRefreshing: false,
      marker: null,
      region: {
        latitude: DEFAULT_LATIDUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
  }
  componentDidMount() {
    this.saveLocationSubscription = inviteStore.subscribe(
      'SaveLocation',
      this.saveLocationHandler,
    );
    this.inviteStoreError = inviteStore.subscribe(
      'InviteStoreError',
      this.errorHandler,
    );
  }

  componentWillUnmount() {
    this.saveLocationSubscription.unsubscribe();
    this.inviteStoreError.unsubscribe();
  }

  saveLocationHandler = () => {
    this.setState({ isLoading: false });
    this.props.navigation.navigate(AVAILABILITY_ONBOARDING_ROUTE);
  };

  errorHandler = (err) => {
    this.setState({ isLoading: false });
    CustomToast(err, 'danger');
  };
  render() {
    console.log('what it do', this.state);
    return (
      <I18n>
        {(t) => (
          <Container>
            <TabHeaderWhite
              goBack
              onPressBack={() => this.props.navigation.goBack()}
              // title={t('EDIT_PROFILE.editProfile')}
            />
            <Content>
              <View
                style={{
                  padding: 25,
                }}>
                <H1
                  style={{
                    marginBottom: 15,
                    fontWeight: 700,
                    fontSize: 32,
                    lineHeight: 45,
                  }}>
                  Where are you located?
                </H1>
                <Text style={{ fontSize: 18, color: 'gray' }}>
                  We'll set you up with nearby employers.
                </Text>
              </View>
              <GooglePlacesAutocomplete
                ref={(instance) => {
                  this.GooglePlacesRef = instance;
                }}
                placeholder={t('JOB_PREFERENCES.typeLocation')}
                debounce={200}
                minLength={2}
                autoFocus={true}
                returnKeyType={'search'}
                listViewDisplayed="auto"
                fetchDetails={true}
                renderDescription={(row) => row.description}
                onPress={(data, details = null) => {
                  const marker = { data, details };
                  const region = {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  };

                  this.GooglePlacesRef.setAddressText('');

                  this.setState({
                    marker,
                    region,
                  });
                }}
                getDefaultValue={() => ''}
                query={{
                  key: GOOGLE_API_KEY,
                  language: 'en',
                  types: 'address',
                }}
                styles={{
                  textInputContainer: {
                    height: 70,
                    width: '100%',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    backgroundColor: 'transparent',
                  },
                  textInput: {
                    backgroundColor: 'transparent',
                    height: 55,
                    marginLeft: 15,
                    marginRight: 15,
                    borderColor: BLACK_MAIN,
                    color: BLACK_MAIN,
                    borderRadius: 0,
                    borderWidth: 1,
                  },
                  description: {
                    fontSize: 12,
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                  loader: {
                    color: BLACK_MAIN,
                  },
                  listView: {
                    backgroundColor: WHITE_MAIN,
                  },
                  poweredContainer: {
                    display: 'none',
                  },
                  powered: {
                    tintColor: 'transparent',
                  },
                }}
                currentLocation={false}
                currentLocationLabel="Current location"
                nearbyPlacesAPI="GooglePlacesSearch"
              />

              {this.state.marker ? (
                <View style={styles.viewLocation}>
                  <TouchableOpacity onPress={this.openMapsApp}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: BLACK_MAIN,
                      }}>
                      {`${this.state.marker.details.formatted_address}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {this.state.marker && (
                <MapView style={styles.map} region={this.state.region}>
                  <Marker
                    image={MARKER_IMG}
                    centerOffset={{ x: 0, y: 32 }}
                    coordinate={{
                      latitude: this.state.marker.details.geometry.location.lat,
                      longitude: this.state.marker.details.geometry.location
                        .lng,
                    }}
                    title={this.state.marker.details.formatted_address}
                  />
                </MapView>
              )}

              {/* {this.state.marker && (
                <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                  <BtnCancelSave t={t} onPressSave={this.saveLocationAlert} />
                </View>
              )}              */}
            </Content>
            <Footer
              style={{
                backgroundColor: 'white',
                borderBottomWidth: 0,
                borderTopWidth: 0,
              }}>
              <FooterTab>
                {this.state.marker ? (
                  <Button
                    style={{ backgroundColor: 'black', borderRadius: 0 }}
                    onPress={this.saveLocationAlert}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Next</Text>
                  </Button>
                ) : (
                  <Button light disabled style={{ borderRadius: 0 }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>
                      To continue, add a location
                    </Text>
                  </Button>
                )}
              </FooterTab>
            </Footer>
          </Container>
        )}
      </I18n>
    );
  }
  openMapsApp = () => {
    let latitude;
    let longitude;

    try {
      latitude =
        this.state.marker.details.geometry.location.lat || DEFAULT_LATIDUDE;
      longitude =
        this.state.marker.details.geometry.location.lng || DEFAULT_LONGITUDE;
    } catch (e) {
      latitude = DEFAULT_LATIDUDE;
      longitude = DEFAULT_LONGITUDE;
    }

    openMapsApp(latitude, longitude);
  };

  saveLocationAlert = () => {
    if (!this.state.marker) return;

    Alert.alert(
      i18next.t('JOB_PREFERENCES.wantToSaveLocation'),
      this.state.marker.details.formatted_address,
      [
        {
          text: i18next.t('APP.cancel'),
          onPress: () => {
            LOG(this, 'Cancel saveLocation');
          },
        },
        {
          text: i18next.t('JOB_PREFERENCES.save'),
          onPress: () => {
            this.saveLocation();
          },
        },
      ],
      { cancelable: false },
    );
  };

  saveLocation = () => {
    if (!this.state.marker) return;
    const place = this.state.marker.details;

    const componentForm = {
      country: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'long_name',
      street_number: 'long_name',
      postal_code: 'short_name',
    };

    const componentData = {};

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        componentData[addressType] =
          place.address_components[i][componentForm[addressType]];
      }
    }

    const location = {
      location: place.formatted_address || '',
      street_address: componentData.street_number || '',
      city: componentData.locality || '',
      state: componentData.administrative_area_level_1 || '',
      country: componentData.country || '',
      zipCode: componentData.postal_code || '',
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    };

    this.setState({ isLoading: true }, () => {
      inviteActions.saveLocation(location);
    });
  };
}

export default LocationOnboarding;
