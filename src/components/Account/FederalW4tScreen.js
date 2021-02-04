import React, { Component } from 'react';
import {
  View,
  Image,
  Alert,
  Modal,
  TouchableOpacity,
  Linking,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';

import {
  Text,
  Form,
  Label,
  Content,
  Container,
  Footer,
  FooterTab,
  Button,
  CardItem,
  Card,
  Body,
  Icon,
  ListItem,
  List,
  Right,
  Left,
  CheckBox,
  Input,
  Item,
} from 'native-base';
import UploadDocumentStyle from './UploadDocumentStyle';
import BankAccounts from '../BankAccounts/BankAccounts';
import { I18n } from 'react-i18next';
import { Loading, CustomToast } from '../../shared/components';
import { ModalHeader } from '../../shared/components/ModalHeader';
import preferencesStyles from './FederalW4tStyles';
import { BLUE_DARK, BLUE_MAIN, VIOLET_MAIN } from '../../shared/colorPalette';
import jobStore from '../MyJobs/JobStore';
import * as inviteActions from '../Invite/actions';
import moment from 'moment';

import { ADD_DOCUMENT_ROUTE, DASHBOARD_ROUTE } from '../../constants/routes';
import accountStore from './AccountStore';
import {
  uploadDocument,
  getDocuments,
  getUser,
  editProfile,
  getDocumentsTypes,
  getW4Form,
} from './actions';
import { i18next } from '../../i18n';
import { LOG } from '../../shared';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import SignatureScreen from '../../shared/components/Signature';

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

class FederalW4tScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWarning: true,
      isLoading: true,
      documents: [],
      user: accountStore.getState('Login').user,
      docType: '',
      documentsTypes: [],
      modalVisible: false,
      filing_status: '',
      step2c_checked: false,
      data: {
        filing_status: 'SINGLE',
        step2a: false,
        step2b: false,
        step2c: false,
        dependant: false,
        dependant3a: false,
        dependant3b: '',
        dependant3c: '',
        step4a: '',
        step4b: '',
        step4c: '',
        employee_signature: '',
        status: 'PENDING',
      },
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

    this.getW4FormSubscription = accountStore.subscribe('GetW4Form', (form) => {
      if (form && Array.isArray(form) && form.length > 0) {
        this.setState({ data: form[0], hasW4Form: true, isLoading: false });
      }
    });

    this.getDocumentsSubscription = accountStore.subscribe(
      'GetDocumentsTypes',
      (documentsTypes) => {
        this.setState({ documentsTypes, isLoading: false });
      },
    );
    this.getEmployeeDataSubscription = jobStore.subscribe(
      'GetEmployee',
      (user) => this.getEmployeeHandler(user),
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
    getW4Form();
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
  getEmployeeHandler = (user) => {
    this.setState({ employee: user });
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

  openImagePicker = () => {
    ImagePicker.showImagePicker(
      IMAGE_PICKER_OPTIONS,
      this.handleImagePickerResponse,
    );
  };

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
    editProfile(
      this.state.user.user.first_name,
      this.state.user.user.last_name,
      'Tell us about yourself',
      '',
      '',
      '1',
      '2020-10-30',
    );
    CustomToast('W-4 Form Submitted.');
    this.props.navigation.goBack();
  };
  handleChange = (name, value) => {
    this.setState((prev) => ({ data: { ...prev.data, [name]: value } }));
  };
  render() {
    const { user, showWarning, documentsTypes } = this.state;
    const { documents } = this.state;

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

    return (
      <I18n>
        {(t) => (
          <Container>
            <ModalHeader
              screenName="federal_w4"
              title={'Federal W-4'}
              withoutHelpIcon={false}
              canClose={true}
            />
            <Content padder>
              <View>
                <Text style={{ fontSize: 14 }}>
                  Submit the{' '}
                  <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                    IRS W-4 form
                  </Text>{' '}
                  to ensure you have the correct amount of taxes withheld from
                  your paycheck.
                </Text>
              </View>
              <View
                style={{
                  borderBottomColor: '#D3D3D3',
                  borderBottomWidth: 1,
                  marginBottom: 10,
                  marginTop: 10,
                }}
              />
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                  Filing Status
                </Text>

                <Text>Select filing status</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prev) => ({
                        filing_status: 'SINGLE',
                        data: { ...prev.data, filing_status: 'SINGLE' },
                      }))
                    }>
                    <View
                      style={[
                        {
                          height: 20,
                          width: 20,
                          marginTop: 15,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: '#000',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        {},
                      ]}>
                      {this.state.data.filing_status == 'SINGLE' ? (
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#000',
                          }}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                  <Text style={{ paddingLeft: 10, marginTop: 14 }}>
                    Single or Married filing separately
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prev) => ({
                        filing_status: 'MARRIED_JOINTLY',
                        data: {
                          ...prev.data,
                          filing_status: 'MARRIED_JOINTLY',
                        },
                      }))
                    }>
                    <View
                      style={[
                        {
                          height: 20,
                          width: 20,
                          marginTop: 15,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: '#000',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        {},
                      ]}>
                      {this.state.data.filing_status == 'MARRIED_JOINTLY' ? (
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#000',
                          }}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                  <Text style={{ paddingLeft: 10, marginTop: 14 }}>
                    Married filing jointly
                    <Text style={{ color: '#787878', fontStyle: 'italic' }}>
                      (or qualifying widow(er))
                    </Text>
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prev) => ({
                        filing_status: 'HEAD',
                        data: { ...prev.data, filing_status: 'HEAD' },
                      }))
                    }>
                    <View
                      style={[
                        {
                          height: 20,
                          marginTop: 15,
                          width: 20,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: '#000',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        {},
                      ]}>
                      {this.state.data.filing_status == 'HEAD' ? (
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#000',
                          }}
                        />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                  <Text style={{ paddingLeft: 10, marginTop: 14 }}>
                    Head of household
                  </Text>
                </View>
              </View>

              <View
                style={{
                  borderBottomColor: '#D3D3D3',
                  borderBottomWidth: 1,
                  marginBottom: 10,
                  marginTop: 10,
                }}
              />
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ width: 180 }}>
                  <Text>Do you have more than one job?</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    this.setState((prev) => ({
                      step2a: true,
                      data: { ...prev.data, step2a: true },
                    }))
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 10,
                      marginRight: 20,
                    }}>
                    <View
                      style={[
                        {
                          height: 20,
                          marginTop: 10,
                          width: 20,
                          borderRadius: 12,
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: '#000',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        {},
                      ]}>
                      {this.state.data.step2a ? (
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#000',
                          }}
                        />
                      ) : null}
                    </View>
                    <Text style={{ paddingLeft: 10, marginTop: 10 }}>Yes</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.setState((prev) => ({
                      step2a: false,
                      data: { ...prev.data, step2a: false },
                    }))
                  }>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={[
                        {
                          height: 20,
                          marginTop: 10,
                          width: 20,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: '#000',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        {},
                      ]}>
                      {!this.state.data.step2a ? (
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#000',
                          }}
                        />
                      ) : null}
                    </View>
                    <Text style={{ paddingLeft: 10, marginTop: 10 }}>No</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                <View style={{ width: 180 }}>
                  <Text>
                    Are you filing jointly and your spouse also works?
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    this.setState((prev) => ({
                      step2b: true,
                      data: { ...prev.data, step2b: true },
                    }))
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 10,
                      marginRight: 20,
                    }}>
                    <View
                      style={[
                        {
                          height: 20,
                          marginTop: 10,
                          width: 20,
                          borderRadius: 12,
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: '#000',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        {},
                      ]}>
                      {this.state.data.step2b ? (
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#000',
                          }}
                        />
                      ) : null}
                    </View>
                    <Text style={{ paddingLeft: 10, marginTop: 10 }}>Yes</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.setState((prev) => ({
                      step2b: false,
                      data: { ...prev.data, step2b: false },
                    }))
                  }>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={[
                        {
                          height: 20,
                          marginTop: 10,
                          width: 20,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: '#000',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        {},
                      ]}>
                      {!this.state.data.step2b ? (
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#000',
                          }}
                        />
                      ) : null}
                    </View>
                    <Text style={{ paddingLeft: 10, marginTop: 10 }}>No</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                {this.state.data.step2a || this.state.data.step2b ? (
                  <View style={{ flexDirection: 'row', marginRight: 20 }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState((prev) => ({
                          step2c: !this.state.data.step2c,
                          data: {
                            ...prev.data,
                            step2c: !this.state.data.step2c,
                          },
                        }))
                      }>
                      <View
                        style={[
                          {
                            height: 20,
                            marginTop: 10,
                            width: 20,
                            borderRadius: 0,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: '#000',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                          {},
                        ]}>
                        {this.state.data.step2c ? (
                          <View
                            style={{
                              height: 13,
                              width: 13,
                              borderRadius: 0,
                              backgroundColor: '#000',
                            }}
                          />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                    <Text
                      style={{
                        paddingLeft: 10,
                        marginTop: 10,
                        marginRight: 5,
                      }}>
                      If there are only two jobs total (for just you and or you
                      and your spouse), you may check this box. Do the same on
                      Form W-4 for the other job.
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={{ marginTop: 15 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#787878',
                    fontStyle: 'italic',
                  }}>
                  (This option is accurate for jobs with similar pay; otherwise,
                  more tax than necessary may be withheld)
                </Text>
              </View>
              <View
                style={{
                  borderBottomColor: '#D3D3D3',
                  borderBottomWidth: 1,
                  marginBottom: 10,
                  marginTop: 10,
                }}
              />

              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ width: 180 }}>
                  <Text>Do you want to claim dependants?</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    this.setState((prev) => ({
                      dependant: true,
                      data: { ...prev.data, dependant: true },
                    }))
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 10,
                      marginRight: 20,
                    }}>
                    <View
                      style={[
                        {
                          height: 20,
                          marginTop: 10,
                          width: 20,
                          borderRadius: 12,
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: '#000',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        {},
                      ]}>
                      {this.state.data.dependant ? (
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#000',
                          }}
                        />
                      ) : null}
                    </View>
                    <Text style={{ paddingLeft: 10, marginTop: 10 }}>Yes</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.setState((prev) => ({
                      dependant: false,
                      data: { ...prev.data, dependant: false },
                    }))
                  }>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={[
                        {
                          height: 20,
                          marginTop: 10,
                          width: 20,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: '#000',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        {},
                      ]}>
                      {!this.state.data.dependant ? (
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#000',
                          }}
                        />
                      ) : null}
                    </View>
                    <Text style={{ paddingLeft: 10, marginTop: 10 }}>No</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {this.state.data.dependant ? (
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                  <View style={{ width: 180 }}>
                    <Text>
                      Do you make less than $200,000?
                      <Text style={{ color: '#787878', fontStyle: 'italic' }}>
                        (Or less than $400,000 if married and filing jointly)
                      </Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prev) => ({
                        dependant3a: true,
                        data: { ...prev.data, dependant3a: true },
                      }))
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 10,
                        marginRight: 20,
                      }}>
                      <View
                        style={[
                          {
                            height: 20,
                            marginTop: 10,
                            width: 20,
                            borderRadius: 12,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: '#000',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                          {},
                        ]}>
                        {this.state.data.dependant3a ? (
                          <View
                            style={{
                              height: 12,
                              width: 12,
                              borderRadius: 6,
                              backgroundColor: '#000',
                            }}
                          />
                        ) : null}
                      </View>
                      <Text style={{ paddingLeft: 10, marginTop: 10 }}>
                        Yes
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prev) => ({
                        dependant3a: false,
                        data: { ...prev.data, dependant3a: false },
                      }))
                    }>
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={[
                          {
                            height: 20,
                            marginTop: 10,
                            width: 20,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: '#000',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                          {},
                        ]}>
                        {!this.state.data.dependant3a ? (
                          <View
                            style={{
                              height: 12,
                              width: 12,
                              borderRadius: 6,
                              backgroundColor: '#000',
                            }}
                          />
                        ) : null}
                      </View>
                      <Text style={{ paddingLeft: 10, marginTop: 10 }}>No</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
              {this.state.data.dependant3a ? (
                <View>
                  <View
                    style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                    <View style={{ width: 220 }}>
                      <Text>
                        Multiply the number of qualifying children under age 17
                        by $2,000
                      </Text>
                    </View>
                    <View style={{ width: 100, marginLeft: 10 }}>
                      <Item regular>
                        <Input
                          keyboardType="numeric"
                          placeholder="$0.00"
                          value={this.state.data.dependant3b}
                          onChangeText={(txt) =>
                            this.handleChange('dependant3b', txt)
                          }
                        />
                      </Item>
                    </View>
                  </View>

                  <View
                    style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                    <View style={{ width: 220 }}>
                      <Text>
                        Multiply the number of other dependants by $500
                      </Text>
                    </View>
                    <View style={{ width: 100, marginLeft: 10 }}>
                      <Item regular>
                        <Input
                          keyboardType="numeric"
                          placeholder="$0.00"
                          value={this.state.data.dependant3c}
                          onChangeText={(txt) =>
                            this.handleChange('dependant3c', txt)
                          }
                        />
                      </Item>
                    </View>
                  </View>
                </View>
              ) : null}

              <View
                style={{
                  borderBottomColor: '#D3D3D3',
                  borderBottomWidth: 1,
                  marginBottom: 10,
                  marginTop: 10,
                }}
              />
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                  Other Adjustments(Optional)
                </Text>

                <Text style={{ marginTop: 15 }}>Other Adjustments</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                  For accurate withholding use the estimator tool{' '}
                  <Text
                    style={{ color: 'blue', fontSize: 14, fontWeight: 'bold' }}
                    onPress={() =>
                      Linking.openURL(
                        'https://apps.irs.gov/app/tax-withholding-estimator',
                      )
                    }>
                    here
                  </Text>
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                  <View style={{ width: 220 }}>
                    <Text style={{ fontWeight: 'bold' }}>
                      Additional income, not from jobs
                    </Text>
                    <Text>
                      - Enter the total amount of additional income you expect
                      to receive this year that isn't already being withheld
                      (Interest, dividends, and retirement income, etc.)
                    </Text>
                  </View>
                  <View style={{ width: 100, marginLeft: 10 }}>
                    <Item regular>
                      <Input
                        keyboardType="numeric"
                        placeholder="$0.00"
                        value={this.state.data.step4a}
                        onChangeText={(txt) => this.handleChange('step4a', txt)}
                      />
                    </Item>
                  </View>
                </View>
              </View>
              <View>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                  <View style={{ width: 220 }}>
                    <Text style={{ fontWeight: 'bold' }}>Deductions</Text>
                    <Text>
                      - If you expect to claim deductions other than the
                      standard deduction and want to reduce your withholding,
                      use the Deductions Worksheet and enter an amount here
                    </Text>
                  </View>
                  <View style={{ width: 100, marginLeft: 10 }}>
                    <Item regular>
                      <Input
                        keyboardType="numeric"
                        placeholder="$0.00"
                        value={this.state.data.step4b}
                        onChangeText={(txt) => this.handleChange('step4b', txt)}
                      />
                    </Item>
                  </View>
                </View>
              </View>
              <View>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
                  <View style={{ width: 220 }}>
                    <Text style={{ fontWeight: 'bold' }}>
                      Extra withholding
                    </Text>
                    <Text>
                      - Enter any additional tax you want withheld each pay
                      period
                    </Text>
                  </View>
                  <View style={{ width: 100, marginLeft: 10 }}>
                    <Item regular>
                      <Input
                        keyboardType="numeric"
                        placeholder="$0.00"
                        value={this.state.data.step4c}
                        onChangeText={(txt) => this.handleChange('step4c', txt)}
                      />
                    </Item>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  marginTop: 30,
                  marginBottom: 15,
                }}>
                <Text
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 15,
                  }}>
                  Under penalties of perjury, I declare that this certificate,
                  to the best of my knowledge and belief, is true, correct, and
                  complete.
                </Text>
                <View>
                  <Text>Signature of Employee</Text>
                  <Text>Today's Date: {moment().format('MM/DD/YYYY')}</Text>
                </View>
                {!this.state.data.employee_signature ? (
                  <SignatureScreen
                    onSave={(data) =>
                      this.setState((prev) => ({
                        data: { ...prev.data, employee_signature: data },
                      }))
                    }
                  />
                ) : (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${this.state.data
                        .employee_signature || ''}`,
                    }}
                    style={{ height: 150, width: '100%' }}
                  />
                )}
                <Text
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    marginTop: 15,
                  }}>
                  Under penalties of perjury, I declare that this certificate,
                  to the best of my knowledge and belief, is true, correct, and
                  complete.
                </Text>

                {/* <View style={{ flex: 1, flexDirection: "row" }}>
                    <TouchableHighlight style={stylesSignature.buttonStyle}
                        onPress={() => { this.refs["sign"].resetImage() } } >
                        <Text>Reset</Text>
                    </TouchableHighlight>
 
                </View> */}
              </View>
            </Content>
            <Footer>
              <FooterTab style={{ backgroundColor: 'black' }}>
                <Button
                  onPress={() => {
                    if (!this.state.hasW4Form) {
                      inviteActions.postW4Form(this.state.data);
                    } else inviteActions.putW4Form(this.state.data);
                  }}>
                  <Text
                    style={{ color: 'white', fontSize: 16, fontWeight: 500 }}>
                    {!this.state.hasW4Form
                      ? 'Submit W-4 Form'
                      : 'Update W-4 Form'}
                  </Text>
                </Button>
              </FooterTab>
            </Footer>
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
saveSign = () => {
  this.refs['sign'].saveImage();
};

resetSign = () => {
  this.refs['sign'].resetImage();
};

_onSaveEvent = (result) => {
  //result.encoded - for the base64 encoded png
  //result.pathName - for the file path name
  console.log(result);
};
_onDragEvent = () => {
  // This callback will be called when the user enters signature
  console.log('dragged');
};
const stylesSignature = StyleSheet.create({
  signature: {
    flex: 1,
    borderColor: '#000033',
    height: 200,
    width: '100%',
    borderWidth: 1,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#eeeeee',
    width: '100%',
    margin: 10,
  },
});
FederalW4tScreen.routeName = 'W4_DOCUMENT_ROUTE';

export default FederalW4tScreen;
