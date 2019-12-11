import React, { Component } from 'react';
import { View, TouchableOpacity, Alert, Image, Switch } from 'react-native';
import {
  Item,
  Input,
  Button,
  Text,
  Form,
  Label,
  Content,
  Thumbnail,
  Textarea,
  Container,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import editProfileStyles from './EditProfileStyle';
import profileStyles from './PublicProfileStyle';
import * as actions from './actions';
import accountStore from './AccountStore';
import { I18n } from 'react-i18next';
import { i18next } from '../../i18n';
import { LOG, WARN } from '../../shared';
import TouchID from 'react-native-touch-id';
import { CustomToast, Loading } from '../../shared/components';
import ImagePicker from 'react-native-image-picker';
import { RESET_ROUTE, JOB_PREFERENCES_ROUTE } from '../../constants/routes';
import PROFILE_IMG from '../../assets/image/profile.png';
import { GRAY_MAIN, BG_GRAY_LIGHT, BLUE_DARK } from '../../shared/colorPalette';
import { TabHeader } from '../../shared/components/TabHeader';
const icon = require('../../assets/image/tab/profile.png');

const IMAGE_PICKER_OPTIONS = {
  mediaType: 'photo',
  noData: true,
  skipBackup: true,
};

const optionalConfigObject = {
  title: 'Authentication Required', // Android
  color: '#e00606', // Android,
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false,
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
};

class EditProfile extends Component {
  static navigationOptions = {
    tabBarLabel: i18next.t('PROFILE.profile'),
    tabBarIcon: () => (
      <Image
        style={{ resizeMode: 'contain', width: 42, height: 42 }}
        source={icon}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      firstName: '',
      lastName: '',
      email: '',
      picture: '',
      bio: '',
      loginAutoSave: false,
      biometrySupport: true,
      selectedImage: {},
    };
  }

  async componentDidMount() {
    TouchID.isSupported(optionalConfigObject)
      .then((biometryType) => {
        // Success code
        // console.log('biometryyyyy .', biometryType);
        if (biometryType === 'FaceID') {
          console.log('FaceID is supported.');
        } else {
          console.log('TouchID is supported.');
        }
      })
      .catch((error) => {
        this.setState({
          biometrySupport: false,
        });
        console.log('errr catch support ', error);
      });
    const loginAuto = await AsyncStorage.getItem('@JobCoreCredential');
    if (loginAuto) {
      this.setState({
        loginAutoSave: true,
      });
    } else {
      this.setState({
        loginAutoSave: false,
      });
    }
    this.editProfileSubscription = accountStore.subscribe(
      'EditProfile',
      this.editProfileHandler,
    );
    this.editProfilePictureSubscription = accountStore.subscribe(
      'EditProfilePicture',
      this.editProfilePictureHandler,
    );
    this.accountStoreError = accountStore.subscribe(
      'AccountStoreError',
      this.errorHandler,
    );

    this.getUser();
  }

  componentWillUnmount() {
    this.editProfileSubscription.unsubscribe();
    this.editProfilePictureSubscription.unsubscribe();
    this.accountStoreError.unsubscribe();
  }

  changeTouchId = async () => {
    const { loginAutoSave } = this.state;
    if (!loginAutoSave) {
      //hacer async y guardar en storage el permiso a usar touch id
      await AsyncStorage.setItem(
        '@JobCoreCredentialPermission',
        JSON.stringify({ success: true }),
      );
      this.setState({
        loginAutoSave: !loginAutoSave,
      });
    } else {
      await AsyncStorage.removeItem('@JobCoreCredentialPermission');
      await AsyncStorage.removeItem('@JobCoreCredential');
      // hacer false el permiso del storage,
      // y tambien de una vaciar el storage de la credenciales
      this.setState({
        loginAutoSave: !loginAutoSave,
      });
    }
  };

  editProfilePictureHandler = (data) => {
    this.setUser(data);
    this.editProfile();
  };

  editProfileHandler = (data) => {
    this.isLoading(false);
    CustomToast(i18next.t('EDIT_PROFILE.profileUpdated'));
    this.setUser(data);
    this.props.navigation.goBack();
  };

  errorHandler = (err) => {
    this.isLoading(false);
    CustomToast(err, 'danger');
  };

  render() {
    const { loginAutoSave, biometrySupport } = this.state;
    return (
      <I18n>
        {(t) => (
          <Container>
            {this.state.isLoading ? <Loading /> : null}
            <TabHeader
              goBack
              onPressBack={() => this.props.navigation.goBack()}
              screenName="profile"
              title={t('EDIT_PROFILE.editProfile')}
              onPressHelp={this.goToEditProfile}
            />
            <Content>
              <View style={editProfileStyles.container}>
                <TouchableOpacity onPress={this.openImagePicker}>
                  <View style={profileStyles.viewProfileImg}>
                    <Thumbnail
                      large
                      source={
                        this.state.selectedImage && this.state.selectedImage.uri
                          ? { uri: this.state.selectedImage.uri }
                          : this.state.picture
                            ? { uri: this.state.picture }
                            : PROFILE_IMG
                      }
                    />
                    <View style={profileStyles.viewCameraCircle}>
                      <Image
                        style={profileStyles.camera}
                        source={require('../../assets/image/camera.png')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                <View>
                  <Form>
                    <Item
                      style={editProfileStyles.viewInput}
                      inlineLabel
                      rounded>
                      <Label>{t('REGISTER.firstName')}</Label>
                      <Input
                        value={this.state.firstName}
                        placeholder={t('REGISTER.firstName')}
                        onChangeText={(text) =>
                          this.setState({ firstName: text })
                        }
                      />
                    </Item>
                    <Item
                      style={editProfileStyles.viewInput}
                      inlineLabel
                      rounded>
                      <Label>{t('REGISTER.lastName')}</Label>
                      <Input
                        value={this.state.lastName}
                        placeholder={t('REGISTER.lastName')}
                        onChangeText={(text) =>
                          this.setState({ lastName: text })
                        }
                      />
                    </Item>
                    <Item
                      style={[
                        editProfileStyles.viewInput,
                        {
                          borderColor: GRAY_MAIN,
                          backgroundColor: BG_GRAY_LIGHT,
                        },
                      ]}
                      inlineLabel
                      rounded>
                      <Label>{t('REGISTER.email')}</Label>
                      <Input
                        editable={false}
                        value={this.state.email}
                        placeholder={t('REGISTER.email')}
                      />
                    </Item>
                    <Item style={editProfileStyles.itemTextBio}>
                      <Text style={editProfileStyles.textBio}>
                        {t('EDIT_PROFILE.textBio')}
                      </Text>
                    </Item>
                    <Item
                      onPress={this.focusTextarea}
                      style={editProfileStyles.viewTextArea}
                      rounded>
                      <Textarea
                        ref={(textarea) => (this.textarea = textarea)}
                        rowSpan={5}
                        value={this.state.bio}
                        placeholder={t('REGISTER.bio')}
                        onChangeText={(text) => this.setState({ bio: text })}
                      />
                    </Item>
                  </Form>
                  <TouchableOpacity
                    onPress={this.passwordReset}
                    style={editProfileStyles.viewButtomChangePassword}>
                    <Text style={editProfileStyles.textButtomChangePassword}>
                      {t('SETTINGS.changePassword')}
                    </Text>
                  </TouchableOpacity>
                  {biometrySupport && (
                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        marginBottom: 20,
                      }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View>
                          <Text style={editProfileStyles.activateToachIdText}>
                            Activate touch id
                          </Text>
                        </View>
                        <Switch
                          // ios_backgroundColor={BLUE_DARK}
                          thumbColor={BLUE_DARK}
                          onValueChange={() => this.changeTouchId()}
                          value={loginAutoSave}
                        />
                      </View>
                    </View>
                  )}

                  <Button
                    full
                    onPress={this.editProfileAlert}
                    style={editProfileStyles.viewButtomLogin}>
                    <Text style={editProfileStyles.textButtom}>
                      {t('EDIT_PROFILE.saveProfile')}
                    </Text>
                  </Button>
                </View>
              </View>
            </Content>
          </Container>
        )}
      </I18n>
    );
  }

  getUser = () => {
    const user = accountStore.getState('Login').user || {};
    let picture;
    let bio;

    try {
      picture = user.profile.picture;
      bio = user.profile.bio;
    } catch (err) {
      LOG(this, 'No profile to get picture & bio');
    }

    this.setState({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email,
      picture: picture || '',
      bio: bio || '',
    });
  };

  setUser = (data) => {
    const session = accountStore.getState('Login');

    try {
      session.user.first_name = data.user.first_name;
      session.user.last_name = data.user.last_name;
      session.user.profile.picture = data.picture;
      session.user.profile.bio = data.bio;
    } catch (e) {
      return WARN(this, `${data} error updating user session`);
    }

    actions.setStoredUser(session);
  };

  editProfileAlert = () => {
    Alert.alert(
      i18next.t('EDIT_PROFILE.wantToEditProfile'),
      '',
      [
        {
          text: i18next.t('APP.cancel'),
          onPress: () => {
            LOG(this, 'Cancel edit profile');
          },
        },
        {
          text: i18next.t('EDIT_PROFILE.update'),
          onPress: () => {
            this.setState({ isLoading: true }, () => {
              LOG(this, this.state);
              if (this.state.selectedImage && this.state.selectedImage.uri) {
                return actions.editProfilePicture(this.state.selectedImage);
              }
              this.editProfile();
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  editProfile = () => {
    actions.editProfile(
      this.state.firstName,
      this.state.lastName,
      this.state.bio,
    );
  };

  passwordReset = () => {
    let email;

    try {
      email = this.state.email || '';
    } catch (e) {
      email = '';
    }

    this.props.navigation.navigate(RESET_ROUTE, { email });
  };

  focusTextarea = () => {
    try {
      this.textarea._root.focus();
    } catch (err) {
      WARN(`focusTextarea error: ${err}`);
    }
  };

  openImagePicker = () => {
    ImagePicker.showImagePicker(
      IMAGE_PICKER_OPTIONS,
      this.handleImagePickerResponse,
    );
  };

  /**
   * Handle react-native-image-picker response and set the selected image
   * @param  {object} response A react-native-image-picker response
   * with the uri, type & name
   */
  handleImagePickerResponse = (response) => {
    if (response.didCancel) {
      // for react-native-image-picker response
      LOG(this, 'User cancelled image picker');
    } else if (response.error) {
      // for react-native-image-picker response
      LOG(this, `ImagePicker Error: ${response.error}`);
    } else if (response.customButton) {
      // for react-native-image-picker response
      LOG(this, `User tapped custom button: ${response.customButton}`);
    } else {
      if (!response.uri) return;

      let type = response.type;

      if (type === undefined && response.fileName === undefined) {
        const pos = response.uri.lastIndexOf('.');
        type = response.uri.substring(pos + 1);
        if (type) type = `image/${type}`;
      }
      if (type === undefined) {
        const splitted = response.fileName.split('.');
        type = splitted[splitted.length - 1];
        if (type) type = `image/${type}`;
      }

      let name = response.fileName;
      if (name === undefined && response.fileName === undefined) {
        const pos = response.uri.lastIndexOf('/');
        name = response.uri.substring(pos + 1);
      }

      const selectedImage = {
        uri: response.uri,
        type: type.toLowerCase(),
        name,
      };

      this.setState({ selectedImage });
    }
  };

  goToJobPreferences = () => {
    this.props.navigation.navigate(JOB_PREFERENCES_ROUTE);
  };

  isLoading = (isLoading) => {
    this.setState({ isLoading });
  };
}

EditProfile.routeName = 'EditProfile';

export default EditProfile;
