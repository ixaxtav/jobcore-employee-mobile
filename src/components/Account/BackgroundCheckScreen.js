import React, { Component } from 'react';
import {
  View,
  Image,
  Alert,
  Modal,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  Text,
  Form,
  Label,
  Content,
  Container,
  Button,
  Input,
  CheckBox,
} from 'native-base';
import UploadDocumentStyle from './UploadDocumentStyle';
import BankAccounts from '../../components/BankAccounts/BankAccounts';
import { I18n } from 'react-i18next';
import { Loading, CustomToast } from '../../shared/components';
import { ModalHeader } from '../../shared/components/ModalHeader';
import { ADD_DOCUMENT_ROUTE } from '../../constants/routes';
import accountStore from './AccountStore';
import editProfileStyles from './EditProfileStyle';

import {
  uploadDocument,
  getDocuments,
  editProfile,
  getUser,
  getDocumentsTypes,
} from './actions';
import { i18next } from '../../i18n';
import { LOG } from '../../shared';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import CustomPicker from '../../shared/components/CustomPicker';
import UploadDocumentScreen from './UploadDocumentScreen';
const IMAGE_PICKER_OPTIONS = {
  mediaType: 'photo',
  noData: true,
  skipBackup: true,
  documentsTypesList: [],
};

const Document = ({
  doc,
  t,
  // deleteDocumentAlert
}) => (
  <Form>
    <View style={UploadDocumentStyle.formStyle}>
      <View style={UploadDocumentStyle.viewInput}>
        <View style={UploadDocumentStyle.documentNameContainer}>
          <Image
            style={UploadDocumentStyle.documentStatusImage}
            source={
              doc.status && doc.status === 'APPROVED'
                ? require('../../assets/image/documents/document-check.png')
                : require('../../assets/image/documents/document-interrogation.png')
            }
          />
          <View>
            <Label numberOfLines={2} style={{ width: 250 }}>
              {doc.name || `document #${doc.id}`}
            </Label>
            <View
              style={
                doc.status && doc.status === 'APPROVED'
                  ? UploadDocumentStyle.documentStatusTextApproved
                  : doc.status &&
                    (doc.status === 'REJECTED' ||
                      doc.status === 'DELETED' ||
                      doc.status === 'ARCHIVED')
                    ? UploadDocumentStyle.documentStatusTextRejected
                    : UploadDocumentStyle.documentStatusTextUnderReview //status === 'PENDING'
              }>
              <Text style={UploadDocumentStyle.documentsStatusText}>
                {t(`USER_DOCUMENTS.${doc.status.toLowerCase()}`).toLowerCase()}
              </Text>
            </View>
          </View>
        </View>
        {doc.rejected_reason && doc.status === 'REJECTED' ? (
          <View>
            <Label
              numberOfLines={1}
              style={UploadDocumentStyle.documentRejectedText}>
              {doc.rejected_reason}
            </Label>
          </View>
        ) : null}
      </View>
      {/* {doc.state !== 'APPROVED' ? (
        <TouchableOpacity
          onPress={() => deleteDocumentAlert(doc)}>
          <Image
            style={UploadDocumentStyle.garbageIcon}
            source={require('../../assets/image/delete.png')}
          />
        </TouchableOpacity>
      ) : null} */}
    </View>
  </Form>
);

class BackgroundCheckScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWarning: true,
      isLoading: true,
      documents: [],
      user: accountStore.getState('Login').user,
      docType: '',
      documentsTypes: [],
      last_4dig_ssn: '',
      modalVisible: false,
      agree: false,
    };
  }

  componentDidMount() {
    this.uploadDocumentSubscription = accountStore.subscribe(
      'UploadDocument',
      (data) => {
        console.log('UploadDocument: ', data);
        this.setState({ isLoading: false });
        getDocuments();
        getUser();
      },
    );
    this.getDocumentsSubscription = accountStore.subscribe(
      'GetDocuments',
      (documents) => {
        this.setState({ documents, isLoading: false });
        console.log('GetDocuments: ', documents);
      },
    );
    this.getDocumentsSubscription = accountStore.subscribe(
      'GetDocumentsTypes',
      (documentsTypes) => {
        this.setState({ documentsTypes, isLoading: false });
      },
    );
    this.deleteDocumentsSubscription = accountStore.subscribe(
      'DeleteDocument',
      (res) => {
        getDocuments();
        this.setState({ isLoading: false });
        console.log('delete document: ', res);
      },
    );
    this.getUserSubscription = accountStore.subscribe('getUser', (user) => {
      this.setState({ user });
    });
    this.accountStoreError = accountStore.subscribe(
      'AccountStoreError',
      this.errorHandler,
    );
    getDocuments();
    getDocumentsTypes();
    getUser();
  }

  componentWillUnmount() {
    this.getDocumentsSubscription.unsubscribe();
    this.deleteDocumentsSubscription.unsubscribe();
    this.accountStoreError.unsubscribe();
    this.getUserSubscription.unsubscribe();
  }

  errorHandler = (err) => {
    this.setState({ isLoading: false });
    CustomToast(err, 'danger');
  };

  goToAddDocument = () => {
    this.props.navigation.navigate(ADD_DOCUMENT_ROUTE);
  };

  // pickDocument = async () => {
  //   // Pick a single file
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.pdf],
  //     });
  //     console.log(res);
  //     console.log(
  //       res.uri,
  //       res.type, // mime type
  //       res.name,
  //       res.size,
  //     );
  //     this.saveDocumentAlert(res.name, res);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the picker, exit any dialogs or menus and move on
  //     } else {
  //       throw err;
  //     }
  //   }
  // };

  saveDocumentAlert = (docName, res) => {
    Alert.alert(
      i18next.t('USER_DOCUMENTS.wantToAddDocument'),
      ` ${docName}?`,
      [
        {
          text: i18next.t('APP.cancel'),
          onPress: () => {
            LOG(this, 'Cancel add document');
          },
        },
        {
          text: i18next.t('USER_DOCUMENTS.saveDoc'),
          onPress: () => {
            this.setState({ isLoading: true }, () => {
              uploadDocument(res);
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  // deleteDocumentAlert = (doc) => {
  //   Alert.alert(
  //     i18next.t('USER_DOCUMENTS.wantToDeleteDocument'),
  //     ` ${doc.name || `document #${doc.id}`}?`,
  //     [
  //       {
  //         text: i18next.t('APP.cancel'),
  //         onPress: () => {
  //           LOG(this, 'Cancel delete document');
  //         },
  //       },
  //       {
  //         text: i18next.t('USER_DOCUMENTS.deleteDoc'),
  //         onPress: () => {
  //           this.setState({ isLoading: true }, () => {
  //             deleteDocument(doc);
  //           });
  //         },
  //       },
  //     ],
  //     { cancelable: false },
  //   );
  // };

  openImagePicker = () => {
    ImagePicker.showImagePicker(
      IMAGE_PICKER_OPTIONS,
      this.handleImagePickerResponse,
    );
  };
  agree = () => {
    this.setState((prevState) => ({
      agree: !prevState.agree,
    }));
  };
  /**
   * Handle react-native-image-picker response and set the selected image
   * @param  {object} response A react-native-image-picker response
   * with the uri, type & name
   */
  handleImagePickerResponse = (response) => {
    const { docType } = this.state;
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
        docType,
      };
      this.saveDocumentAlert(selectedImage.name, selectedImage);
      this.setState({ selectedImage });
    }
  };
  editProfile = () => {
    if (this.state.agree) {
      editProfile(
        this.state.user.user.first_name,
        this.state.user.user.last_name,
        this.state.user.bio,
        '',
        '',
        this.state.last_4dig_ssn,
        this.state.user.birth_date,
      );
      CustomToast('Background information saved.');
      this.props.navigation.navigate(UploadDocumentScreen.routeName);
    } else {
      CustomToast('Please click the agree checkbox', 'danger');
    }
  };
  render() {
    const { user, showWarning, documentsTypes } = this.state;
    const { documents } = this.state;
    console.log('user: ', user);
    console.log('documentsTypes: ', documentsTypes);
    console.log('modalVisible: ', this.state.modalVisible);
    const isAllowDocuments = user.employee
      ? !user.employee.document_active
      : true;
    const identityDocuments = documents.filter(
      (doc) => doc.document_type && doc.document_type.validates_identity,
    );
    const employmentDocuments = documents.filter(
      (doc) => doc.document_type && doc.document_type.validates_employment,
    );
    const formDocuments = documents.filter(
      (doc) => doc.document_type && doc.document_type.is_form,
    );
    const isMissingDocuments = user.employee
      ? user.employee.employment_verification_status === 'MISSING_DOCUMENTS'
      : false;
    const employmentVerificationStatus = user.employee
      ? user.employee.employment_verification_status
      : '';
    const filingStatus = user.employee ? user.employee.filing_status : '';
    const allowances = user.employee ? user.employee.allowances : '';
    const extraWithholding = user.employee
      ? user.employee.extra_withholding
      : '';

    console.log('upload document', this.state);
    return (
      <I18n>
        {(t) => (
          <Container>
            <ModalHeader
              screenName="background_check"
              title={'Background Check'}
              withoutHelpIcon={false}
            />

            {this.state.isLoading ? <Loading /> : null}
            <Content>
              <View>
                <View style={{ marginRight: 30, marginLeft: 30 }}>
                  <Label style={{ marginTop: 30 }}>
                    {'Last 4 digits of social security number '}
                  </Label>

                  <View style={editProfileStyles.viewInputBackground}>
                    <Input
                      keyboardType="numeric"
                      value={this.state.last_4dig_ssn}
                      placeholder={t('REGISTER.last_4dig_ssn_placeholder')}
                      onChangeText={(text) => {
                        if (text.length >= 0 && text.length < 5)
                          this.setState({
                            last_4dig_ssn: text.replace(/[^0-9]/g, ''),
                          });
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                  }}
                />
                <View style={UploadDocumentStyle.buttonContainer}>
                  <Text
                    style={UploadDocumentStyle.backgroundcheckdisclosureText}>
                    {
                      'ACKNOWLEDGMENT AND AUTHORIZATION FOR BACKGROUND CHECK I acknowledge and agree that I have read and understand the Background Check Disclosure and further acknowledge that I have read, understand and agree with the statements contained in the additional disclosures. By my electronic signature, I hereby authorize JobCore to obtain consumer reports about me from any CRA at any time after receipt of this authorization and throughout my independent contractor relationship. I agree that I am providing my electronic signature and that my electronic signature is binding just like a signature in ink.'
                    }
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                      style={{ marginRight: 15 }}
                      checked={this.state.agree}
                      onPress={() => {
                        let agree = this.state.agree ? false : true;
                        this.setState({ agree: agree });
                      }}
                    />
                    <Text>I agree and acknowledge</Text>
                  </View>
                  <Button
                    full
                    onPress={this.editProfile}
                    style={{
                      backgroundColor: '#27666F',
                      borderRadius: 0,
                      height: 45,
                      marginTop: 60,
                      marginBottom: 20,
                    }}>
                    <Text style={editProfileStyles.textButtom}>{'SUBMIT'}</Text>
                  </Button>
                </View>
              </View>
            </Content>
          </Container>
        )}
      </I18n>
    );
  }
}

Document.propTypes = {
  doc: PropTypes.any,
  t: PropTypes.any,
};

BackgroundCheckScreen.routeName = 'BACK_GROUND_CHECK_ROUTE';

export default BackgroundCheckScreen;
