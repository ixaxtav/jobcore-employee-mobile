import React, { Component } from 'react';
import {
  View,
  // SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Item,
  Input,
  Button,
  Text,
  Form,
  Content,
  Picker,
  Icon,
  CheckBox,
} from 'native-base';
import {
  LOGIN_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
} from '../../constants/routes';
import {
  BLACK_MAIN,
  BLUE_MAIN,
  BLUE_DARK,
  WHITE_MAIN,
} from '../../shared/colorPalette';

import styles from './RegisterStyle';
import * as actions from './actions';
import store from './AccountStore';
import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
import { FormView } from '../../shared/platform';
import { CustomToast, Loading, CenteredText } from '../../shared/components';
import { GOOGLE_API_KEY } from 'react-native-dotenv';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class RegisterScreen extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showPlacesList: false,
      email: '',
      password: '',
      firstName: '',
      phoneNumber: '',
      lastName: '',
      wroteCity: '',
      cities: [],
      city: 'others',
      profile_city: 'others',
      isRegisterOpen: true,
      acceptTerms: store.getState('TermsAndCondition'),
    };
  }

  componentDidMount() {
    this.registerSubscription = store.subscribe('Register', (user) =>
      this.registerHandler(user),
    );
    this.getCitiesSubscription = store.subscribe('GetCities', (cities) =>
      this.setState({ cities }),
    );
    this.accountStoreError = store.subscribe('AccountStoreError', (err) =>
      this.errorHandler(err),
    );
    this.editTermsAndConditionsSubscription = store.subscribe(
      'TermsAndCondition',
      (bool) => {
        this.setState({ acceptTerms: bool });
      },
    );
    actions.getCities();
  }

  componentWillUnmount() {
    this.registerSubscription.unsubscribe();
    this.accountStoreError.unsubscribe();
    this.getCitiesSubscription.unsubscribe();
    this.editTermsAndConditionsSubscription.unsubscribe();
  }

  registerHandler = () => {
    this.isLoading(false);
    this.props.navigation.navigate(LOGIN_ROUTE);
    CustomToast(i18next.t('REGISTER.youHaveRegistered'));
  };

  errorHandler = (err) => {
    this.isLoading(false);
    CustomToast(err, 'danger');
  };

  render() {
    const { cities, city, acceptTerms } = this.state;
    console.log('show places', this.state.showPlacesList);
    console.log('wrote ', this.state.wroteCity);
    return (
      <I18n>
        {(t) => (
          <Container>
            <Content
              contentContainerStyle={{ flexGrow: 1, backgroundColor: 'red' }}>
              <View style={styles.container}>
                {this.state.isLoading ? <Loading /> : null}
                {/* <Image
                style={styles.viewBackground}
                source={require('../../assets/image/bg.jpg')}
              /> */}
                <Image
                  style={styles.viewLogo}
                  source={require('../../assets/image/logo1.png')}
                />
                <View style={styles.viewForm}>
                  <Form>
                    <Item style={styles.viewInput} inlineLabel rounded>
                      <Input
                        value={this.state.firstName}
                        style={{ color: 'black' }}
                        placeholder={t('REGISTER.firstName')}
                        onChangeText={(text) =>
                          this.setState({ firstName: text })
                        }
                      />
                    </Item>
                    <Item style={styles.viewInput} inlineLabel rounded>
                      <Input
                        value={this.state.lastName}
                        style={{ color: 'black' }}
                        placeholder={t('REGISTER.lastName')}
                        onChangeText={(text) =>
                          this.setState({ lastName: text })
                        }
                      />
                    </Item>
                    <Item style={styles.viewInput} inlineLabel rounded>
                      <Input
                        keyboardType={'number-pad'}
                        autoCapitalize={'none'}
                        style={{ color: 'black' }}
                        value={this.state.phoneNumber}
                        placeholder={t('REGISTER.phoneNumber')}
                        onChangeText={(text) =>
                          this.setState({ phoneNumber: text })
                        }
                      />
                    </Item>
                    {/* <Item style={styles.viewInput} inlineLabel rounded> */}
                    {/* <Picker
                      mode="dropdown"
                      iosHeader={t('REGISTER.city')}
                      placeholder={t('REGISTER.city')}
                      placeholderStyle={{ color: '#575757', paddingLeft: 7 }}
                      iosIcon={
                        <Icon style={{ color: '#27666F' }} name="arrow-down" />
                      }
                      style={{ width: 270, paddingLeft: 0 }}
                      selectedValue={this.state.city}
                      onValueChange={(text) =>
                        this.setState({ city: text, wroteCity: '' })
                      }>
                      {cities.map((city) => (
                        <Picker.Item
                          label={city.name}
                          value={city}
                          key={city.id}
                        />
                      ))}
                      <Picker.Item
                        label={t('REGISTER.others')}
                        value="others"
                        key={t('REGISTER.others')}
                      />
                    </Picker> */}
                    {/* </Item> */}
                    {/* {city == 'others' ? (
                    <Item style={styles.viewInput} inlineLabel rounded>
                      <Input
                        disabled={city !== 'others'}
                        value={this.state.wroteCity}
                        placeholder={t('REGISTER.wroteCity')}
                        onChangeText={(text) =>
                          this.setState({ wroteCity: text })
                        }
                      />
                    </Item>
                  ) : null} */}
                    <Item style={styles.viewInputGoogle} inlineLabel rounded>
                      <GooglePlacesAutocomplete
                        placeholder={t('REGISTER.wroteCity')}
                        placeholderTextColor="#606160"
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'default'}
                        listViewDisplayed={this.state.showPlacesList}
                        textInputProps={{
                          onFocus: () =>
                            this.setState({ showPlacesList: true }),
                          onBlur: () =>
                            this.setState({ showPlacesList: false }),
                        }}
                        onPress={(data, details = null) => {
                          this.setState({
                            wroteCity: data.description,
                          });
                        }}
                        query={{
                          key: GOOGLE_API_KEY,
                          language: 'en',
                          types: '(cities)',
                        }}
                        styles={{
                          textInputContainer: {
                            backgroundColor: 'transparent',
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            flex: 1,
                          },

                          textInput: {
                            paddingLeft: 8,
                            fontSize: 17,
                            height: 50,
                            color: 'black',
                            flex: 1,
                            top: 1.5,
                            paddingRight: 5,
                            marginTop: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            backgroundColor: 'transparent',
                          },
                          listView: {
                            position: 'absolute',
                            zIndex: 500,
                            flex: 1,
                            top: 50,
                          },
                          row: {
                            backgroundColor: 'white',
                            color: 'black',
                            zIndex: 500,
                            flex: 1,
                            elevation: 3,
                          },
                          description: {
                            color: 'black',
                          },
                        }}
                      />
                    </Item>

                    <Item style={styles.viewInput} inlineLabel rounded>
                      <Input
                        keyboardType={'email-address'}
                        autoCapitalize={'none'}
                        value={this.state.email}
                        style={{ color: 'black' }}
                        placeholder={t('REGISTER.email')}
                        onChangeText={(text) => this.setState({ email: text })}
                      />
                    </Item>
                    <Item style={styles.viewInput} inlineLabel rounded>
                      <Input
                        value={this.state.password}
                        style={{ color: 'black' }}
                        placeholder={t('REGISTER.password')}
                        onChangeText={(text) =>
                          this.setState({ password: text })
                        }
                        secureTextEntry={true}
                      />
                    </Item>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginBottom: 20,
                      }}>
                      {/* <CheckBox
                      checked={acceptTerms}
                      onPress={() =>
                        actions.editTermsAndCondition(!acceptTerms)
                      }
                    /> */}
                      <View
                        style={styles.termsTitleContainer}
                        onPress={() =>
                          this.props.navigation.navigate(
                            TERMS_AND_CONDITIONS_ROUTE,
                          )
                        }>
                        {/* <Text>{t('TERMS_AND_CONDITIONS.accept')}</Text> */}
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(
                              TERMS_AND_CONDITIONS_ROUTE,
                            )
                          }>
                          <Text>
                            <Text style={styles.termsAndConditionsTitle}>
                              {
                                "By proceeding, I agree to JobCore's Terms of Use "
                              }
                            </Text>
                            <Text style={styles.termsAndConditionsTermTitle}>
                              {t('TERMS_AND_CONDITIONS.title')}
                            </Text>
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Button
                      full
                      onPress={this.register}
                      style={styles.viewButtomLogin}>
                      <Text style={styles.textButtom}>
                        {t('REGISTER.signUp')}
                      </Text>
                    </Button>

                    <TouchableOpacity
                      full
                      onPress={() => this.props.navigation.goBack()}
                      style={styles.viewButtomSignUp}>
                      <Text style={styles.textButtomSignUp}>
                        {t('REGISTER.goBack')}
                      </Text>
                    </TouchableOpacity>
                  </Form>
                </View>
              </View>
            </Content>
          </Container>
        )}
      </I18n>
    );
  }

  register = () => {
    this.isLoading(true);
    actions.register(
      this.state.email.toLowerCase(),
      this.state.password,
      this.state.firstName,
      this.state.lastName,
      this.state.phoneNumber,
      this.state.city,
      this.state.wroteCity,
      this.state.acceptTerms,
    );
  };

  isLoading = (isLoading) => {
    this.setState({ isLoading });
  };
}

export default RegisterScreen;
