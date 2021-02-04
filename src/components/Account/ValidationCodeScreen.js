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
  APP_ROUTE,
  JOB_PREFERENCES_ROUTE,
  JOB_PREFERENCES_ONBOARDING_ROUTE,
  VALIDATION_CODE_ROUTE,
  DASHBOARD_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
  POSITION_ONBOARDING_ROUTE,
} from '../../constants/routes';
import styles from './RegisterStyle';
import * as actions from './actions';
import store from './AccountStore';
import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
// import { FormView } from '../../shared/platform';
import { CustomToast, Loading } from '../../shared/components';
import ValidationCodeInput from '../../shared/components/ValidationCodeInput';

import LoginScreen from './LoginScreen';

class ValidationCodeScreen extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
      value: '',
      disableResend: false,
      phoneNumber: this.props.navigation.state.params.phone_number,
      email: this.props.navigation.state.params.email,
    };
  }

  componentDidMount() {
    this.loginSubscription = store.subscribe('Login', (user) =>
      console.log('login', user),
    );
    this.validationlinkSubscription = store.subscribe(
      'ValidationLink',
      (user) => {
        if (user.active) this.validateHandler();
      },
    );
    this.accountStoreError = store.subscribe('AccountStoreError', (err) =>
      this.errorHandler(err),
    );
  }

  componentWillUnmount() {
    this.validationlinkSubscription.unsubscribe();
    this.accountStoreError.unsubscribe();
  }

  validateHandler = () => {
    this.isLoading(false);
    this.props.navigation.navigate(POSITION_ONBOARDING_ROUTE);
  };

  errorHandler = (err) => {
    console.log(err);
    this.isLoading(false);
    this.setState({ value: '' });
    CustomToast(err, 'danger');
  };

  handleChangeValue = (code) => {
    this.setState({ value: code });
  };

  render() {
    const { phoneNumber, email } = this.state;

    return (
      <I18n>
        {(t) => (
          <Container>
            <Content contentContainerStyle={{ flexGrow: 1 }}>
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
                <View style={styles.formContainer}>
                  <Text style={styles.codeVerificationTitle}>
                    {t('VALIDATE_CODE.title') + ' ' + phoneNumber}.
                  </Text>
                  {!this.state.disableResend ? (
                    <Text
                      style={styles.resendButtomClick}
                      onPress={this.resend}>
                      {t('VALIDATE_CODE.resend')}
                    </Text>
                  ) : (
                    <Text style={styles.resendButtomClick}>
                      {t('VALIDATE_CODE.sent')}
                    </Text>
                  )}

                  <ValidationCodeInput
                    value={this.state.value}
                    change={this.handleChangeValue}
                    phoneNumber={phoneNumber}
                  />

                  <Button
                    full
                    onPress={this.validate}
                    style={styles.viewButtomLogin}>
                    <Text style={styles.textButtom}>
                      {t('VALIDATE_CODE.continue')}
                    </Text>
                  </Button>
                  <TouchableOpacity
                    full
                    onPress={() => this.props.navigation.goBack()}
                    style={styles.viewButtomSignUp}>
                    <Text style={styles.textButtomSignUp}>
                      {t('VALIDATE_CODE.goBack')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Content>
          </Container>
        )}
      </I18n>
    );
  }

  validate = () => {
    this.isLoading(true);
    actions.validatePhoneNumber(
      this.state.email,
      this.state.phoneNumber,
      this.state.value,
    );
  };

  resend = () => {
    this.setState({ disableResend: true });
    actions.requestSendValidationLink(this.state.email, this.state.phoneNumber);
  };
  isLoading = (isLoading) => {
    this.setState({ isLoading });
  };
}

export default ValidationCodeScreen;
