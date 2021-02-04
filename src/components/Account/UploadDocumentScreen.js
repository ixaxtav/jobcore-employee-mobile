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
  Picker,
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

import { ADD_DOCUMENT_ROUTE, DASHBOARD_ROUTE } from '../../constants/routes';
import accountStore from './AccountStore';
import {
  uploadDocument,
  getDocuments,
  getI9Form,
  getUser,
  editProfile,
  getDocumentsTypes,
  post,
} from './actions';
import * as inviteActions from '../Invite/actions';
import { i18next } from '../../i18n';
import { LOG } from '../../shared';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import CustomPicker from '../../shared/components/CustomPicker';
import BackgroundCheckScreen from './BackgroundCheckScreen';
import moment from 'moment';
import SignatureScreen from '../../shared/components/Signature';
import { Buffer } from 'buffer';
// import UploadDocumentScreen from './I9FormScreen';
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

class UploadDocumentScreen extends Component {
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

      //
      translator: false,
      //
      data: {
        first_name: '',
        last_name: '',
        middle_initial: '',
        other_last_name: '',
        address: '',
        apt_number: '',
        state: '',
        city: '',
        zipcode: '',
        date_of_birth: '',
        social_security: '',
        email: '',
        phone: '',
        employee_attestation: 'CITIZEN',
        USCIS: '',
        I_94: '',
        passport_number: '',
        country_issuance: '',
        employee_signature: '',
        date_employee_signature: moment().format('MM/DD/YYYY'),
        translator: false,
        translator_signature: '',
        date_translator_signature: '',
        translator_first_name: '',
        translator_last_name: '',
        translator_address: '',
        translator_state: '',
        translator_city: '',
        translator_zipcode: '',
        document_a: '',
        document_b_c: '',
        document_b_c2: '',
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
    this.getDocumentsSubscription = accountStore.subscribe(
      'GetDocumentsTypes',
      (documentsTypes) => {
        this.setState({ documentsTypes, isLoading: false });
      },
    );
    this.getI9FormSubscription = accountStore.subscribe('GetI9Form', (form) => {
      if (form && Array.isArray(form) && form.length > 0) {
        this.setState({ data: form[0], hasI9Form: true, isLoading: false });
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
    getI9Form();
  }

  componentWillUnmount() {
    this.getDocumentsSubscription.unsubscribe();
    this.deleteDocumentsSubscription.unsubscribe();
    this.getI9FormSubscription.unsubscribe();
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

  onValueChange2(value: string) {
    this.setState({
      employee_attestation_4: value,
    });
  }
  mask(o, f) {
    setTimeout(function() {
      var v = f(o.value);
      if (v != o.value) {
        o.value = v;
      }
    }, 1);
  }
  saveSign = () => {
    console.log(e);
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
  mdate(v) {
    var r = v.replace(/\D/g, '');

    if (r.length > 4) {
      r = r.replace(/^(\d\d)(\d{2})(\d{0,4}).*/, '$1/$2/$3');
    } else if (r.length > 2) {
      r = r.replace(/^(\d\d)(\d{0,2})/, '$1/$2');
    } else if (r.length > 0) {
      if (r > 12) {
        r = '';
      }
    }
    this.setState((prev) => ({ data: { ...prev.data, date_of_birth: r } }));
  }

  mphone(v) {
    var r = v.replace(/\D/g, '');
    r = r.replace(/^0/, '');
    if (r.length > 10) {
      // 11+ digits. Format as 5+4.
      //r = r.replace(/^(\d\d\d)(\d{5})(\d{4}).*/,"($1) $2-$3");
      r = r.replace(/^(\d\d\d)(\d{3})(\d{0,4}).*/, '$1-$2-$3');
      return r;
    } else if (r.length > 5) {
      // 6..10 digits. Format as 4+4
      r = r.replace(/^(\d\d\d)(\d{3})(\d{0,4}).*/, '$1-$2-$3');
    } else if (r.length > 2) {
      // 3..5 digits. Add (0XX..)
      r = r.replace(/^(\d\d\d)(\d{0,3})/, '$1-$2');
    } else {
      // 0..2 digits. Just add (0XX
      r = r.replace(/^(\d*)/, '$1');
    }
    this.setState((prev) => ({ data: { ...prev.data, phone: r } }));
  }
  mssn(v) {
    var r = v.replace(/\D/g, '');

    if (r.length > 9) {
      r = r.replace(/^(\d\d\d)(\d{2})(\d{0,4}).*/, '$1-$2-$3');
      return r;
    } else if (r.length > 4) {
      r = r.replace(/^(\d\d\d)(\d{2})(\d{0,4}).*/, '$1-$2-$3');
    } else if (r.length > 2) {
      r = r.replace(/^(\d\d\d)(\d{0,3})/, '$1-$2');
    } else {
      r = r.replace(/^(\d*)/, '$1');
    }
    this.setState((prev) => ({ data: { ...prev.data, social_security: r } }));
  }

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
    const documentA = documents.filter(
      (doc) => doc.document_type && doc.document_type.document_a,
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

    console.log('identity document', this.state);
    return (
      <I18n>
        {(t) => (
          <Container>
            <ModalHeader
              screenName="federal_w4"
              title={'Employment Verification'}
              withoutHelpIcon={false}
              canClose={true}
            />
            <Content padder>
              <View>
                <Text style={{ fontSize: 14 }}>
                  <Text style={{ fontWeight: 700 }}>
                    Section 1. Employee Information and Attestation
                  </Text>{' '}
                  (Employees must complete and sign Section 1 of Form I-9 no
                  later than the first day of employment, but not before
                  accepting a job offer.)
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
              <Form style={{ marginBottom: 30 }}>
                <Item floatingLabel last>
                  <Label>Last Name (Family Name)</Label>
                  <Input
                    value={this.state.data.last_name}
                    onChangeText={(txt) => this.handleChange('last_name', txt)}
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>First Name (Given Name)</Label>
                  <Input
                    value={this.state.data.first_name}
                    onChangeText={(txt) => this.handleChange('first_name', txt)}
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>Middle Initial</Label>
                  <Input
                    value={this.state.data.middle_initial}
                    onChangeText={(txt) =>
                      this.handleChange('middle_initial', txt)
                    }
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>Other Last Names Used (if any)</Label>
                  <Input
                    value={this.state.data.other_last_name}
                    onChangeText={(txt) =>
                      this.handleChange('other_last_name', txt)
                    }
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>Address (Street Number and Name)</Label>
                  <Input
                    value={this.state.data.address}
                    onChangeText={(txt) => this.handleChange('address', txt)}
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>Apt. Number</Label>
                  <Input
                    value={this.state.data.apt_number}
                    onChangeText={(txt) => this.handleChange('apt_number', txt)}
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>City or Town</Label>
                  <Input
                    value={this.state.data.city}
                    onChangeText={(txt) => this.handleChange('city', txt)}
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>State</Label>
                  <Input
                    value={this.state.data.state}
                    onChangeText={(txt) => this.handleChange('state', txt)}
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>ZIP Code</Label>
                  <Input
                    value={this.state.data.zipcode}
                    onChangeText={(txt) => this.handleChange('zipcode', txt)}
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>Date of Birth (mm/dd/yyyy)</Label>
                  <Input
                    value={this.state.data.date_of_birth}
                    value={this.state.data.date_of_birth}
                    onChangeText={(text) => this.mdate(text)}
                    maxLength={10}
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>U.S Social Security Number</Label>
                  <Input
                    value={this.state.data.social_security}
                    placeholder={'XXX-XXX-XXXX'}
                    value={this.state.data.social_security}
                    onChangeText={(text) => this.mssn(text)}
                    maxLength={11}
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>Employee's E-mail Address</Label>
                  <Input
                    value={this.state.data.email}
                    keyboardType={'email-address'}
                    value={this.state.data.email}
                    onChangeText={(text) =>
                      this.setState((prev) => ({
                        data: { ...prev.data, email: text },
                      }))
                    }
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>Employee's Telephone Number</Label>
                  <Input
                    value={this.state.data.phone}
                    keyboardType={'phone-pad'}
                    value={this.state.data.phone}
                    onChangeText={(text) =>
                      this.setState((prev) => ({
                        data: { ...prev.data, phone: text },
                      }))
                    }
                  />
                </Item>
              </Form>
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                  Employee Attestation
                </Text>

                <Text style={{ fontSize: 14 }}>
                  I am aware that federal law provides for imprisonment and/or
                  fines for false statements or use of false documents in
                  connection with the completion of this form.
                </Text>
                <Text style={{ fontSize: 14 }}>
                  I attest, under penalty of perjury, that I am (check one of
                  the following boxes):
                </Text>

                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prev) => ({
                        employee_attestation: 'CITIZEN',
                        data: { ...prev.data, employee_attestation: 'CITIZEN' },
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
                      {this.state.data.employee_attestation == 'CITIZEN' ? (
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
                    1. A citizen of the United States
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prev) => ({
                        employee_attestation: 'NON_CITIZEN',
                        data: {
                          ...prev.data,
                          employee_attestation: 'NON_CITIZEN',
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
                      {this.state.data.employee_attestation == 'NON_CITIZEN' ? (
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
                    2. A noncitizen national of the United States
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prev) => ({
                        employee_attestation: 'RESIDENT',
                        data: {
                          ...prev.data,
                          employee_attestation: 'RESIDENT',
                        },
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
                      {this.state.data.employee_attestation == 'RESIDENT' ? (
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
                    3. A lawful permanent resident
                  </Text>
                </View>
                {/* step 3 alien */}
                {this.state.employee_attestation == 'RESIDENT' && (
                  <View style={{ marginTop: 15 }}>
                    <Text>Enter Alien Registration Number/USCIS Number:</Text>
                    <Item regular>
                      <Input
                        onChangeText={(txt) => this.handleChange('USCIS', txt)}
                      />
                    </Item>
                  </View>
                )}

                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState((prev) => ({
                        employee_attestation: 'ALIEN',
                        data: { ...prev.data, employee_attestation: 'ALIEN' },
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
                      {this.state.data.employee_attestation == 'ALIEN' ? (
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
                    4. An alien authorized to work{' '}
                  </Text>
                </View>

                {this.state.data.employee_attestation == 'ALIEN' && (
                  <View>
                    <Text style={{ fontSize: 14, marginTop: 15 }}>
                      Aliens authorized to work must provide only one of the
                      following document numbers to complete Form I-9: An Alien
                      Registration Number/USCIS Number OR Form I-94 Admission
                      Number OR Foreign Passport Number
                    </Text>
                    {/* 4 alien */}
                    <Form>
                      <Item picker style={{ marginTop: 5 }}>
                        <Picker
                          mode="dropdown"
                          iosIcon={
                            <Icon type="FontAwesome" name="angle-down" />
                          }
                          style={{ width: undefined }}
                          placeholder="Select authorization document"
                          placeholderStyle={{ color: 'black' }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.employee_attestation_4}
                          onValueChange={this.onValueChange2.bind(this)}>
                          <Picker.Item
                            label="Alien Registration Number"
                            value="Alien"
                          />
                          <Picker.Item
                            label="Form I-94 Admission Number"
                            value="I-94"
                          />
                          <Picker.Item
                            label="Foreign Passport Number"
                            value="Passport"
                          />
                        </Picker>
                      </Item>
                    </Form>
                  </View>
                )}
                {this.state.employee_attestation_4 == 'Alien' ? (
                  <View style={{ marginTop: 15 }}>
                    <Text>Enter Alien Registration Number/USCIS Number:</Text>
                    <Item regular>
                      <Input
                        value={this.state.data.USCIS}
                        onChangeText={(txt) => this.handleChange('USCIS', txt)}
                      />
                    </Item>
                  </View>
                ) : this.state.employee_attestation_4 == 'I-94' ? (
                  <View style={{ marginTop: 15 }}>
                    <Text>Form I-94 Admission Number:</Text>
                    <Item regular>
                      <Input
                        value={this.state.data.I_94}
                        onChangeText={(txt) => this.handleChange('I_94', txt)}
                      />
                    </Item>
                  </View>
                ) : this.state.employee_attestation_4 == 'Passport' ? (
                  <View style={{ marginTop: 15 }}>
                    <Text>Foreign Passport Number:</Text>
                    <Item regular>
                      <Input
                        value={this.state.data.passport_number}
                        onChangeText={(txt) =>
                          this.handleChange('passport_number', txt)
                        }
                      />
                    </Item>
                    <Text>Country of Issuance:</Text>
                    <Item regular>
                      <Input
                        value={this.state.data.country_issuance}
                        onChangeText={(txt) =>
                          this.handleChange('country_issuance', txt)
                        }
                      />
                    </Item>
                  </View>
                ) : null}
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

              <View>
                <Text
                  style={{ fontWeight: 'bold', fontSize: 18, marginTop: 15 }}>
                  Preparer and/or Translator Certification (check one):{' '}
                </Text>

                <View style={{ flexDirection: 'row', marginRight: 15 }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({ translator: !this.state.translator })
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
                      {!this.state.translator ? (
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
                    I did not use a preparer or translator.
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', marginRight: 15 }}>
                  <TouchableOpacity
                    onPress={() => this.setState({ translator: true })}>
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
                      {this.state.translator ? (
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
                    A preparer(s) and/or translator(s) assisted the employee in
                    completing Section 1.
                  </Text>
                </View>

                {this.state.translator && (
                  <View>
                    <Text
                      style={{ fontSize: 12, marginRight: 10, marginTop: 10 }}>
                      (Fields below must be completed and signed when preparers
                      and/or translators assist an employee in completing
                      Section 1.)
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginRight: 10,
                        marginTop: 10,
                        fontWeight: 700,
                      }}>
                      I attest, under penalty of perjury, that I have assisted
                      in the completion of Section 1 of this form and that to
                      the best of my knowledge the information is true and
                      correct.
                    </Text>
                    <Form style={{ marginBottom: 30 }}>
                      <Item floatingLabel last>
                        <Label>Last Name (Family Name)</Label>
                        <Input
                          value={this.state.data.translator_last_name}
                          onChangeText={(txt) =>
                            this.handleChange('translator_last_name', txt)
                          }
                        />
                      </Item>
                      <Item floatingLabel last>
                        <Label>First Name (Given Name)</Label>
                        <Input
                          value={this.state.data.translator_first_name}
                          onChangeText={(txt) =>
                            this.handleChange('translator_first_name', txt)
                          }
                        />
                      </Item>
                      <Item floatingLabel last>
                        <Label>Address (Street Number and Name)</Label>
                        <Input
                          value={this.state.data.translator_address}
                          onChangeText={(txt) =>
                            this.handleChange('translator_address', txt)
                          }
                        />
                      </Item>

                      <Item floatingLabel last>
                        <Label>City or Town</Label>
                        <Input
                          value={this.state.data.translator_city}
                          onChangeText={(txt) =>
                            this.handleChange('translator_city', txt)
                          }
                        />
                      </Item>
                      <Item floatingLabel last>
                        <Label>State</Label>
                        <Input
                          value={this.state.data.translator_state}
                          onChangeText={(txt) =>
                            this.handleChange('translator_state', txt)
                          }
                        />
                      </Item>
                      <Item floatingLabel last>
                        <Label>ZIP Code</Label>
                        <Input
                          value={this.state.data.translator_zipcode}
                          onChangeText={(txt) =>
                            this.handleChange('translator_zipcode', txt)
                          }
                        />
                      </Item>
                    </Form>
                  </View>
                )}
              </View>

              <View style={{ marginTop: 30 }}>
                <Text>
                  Choose one of the{' '}
                  <Text
                    style={{ color: 'blue' }}
                    onPress={() =>
                      Linking.openURL(
                        'https://www.uscis.gov/i-9-central/form-i-9-acceptable-documents',
                      )
                    }>
                    acceptable document(s)
                  </Text>{' '}
                  to submit for the I-9
                </Text>
              </View>
              {showWarning ? (
                <View style={UploadDocumentStyle.userStatusLabel}>
                  <View></View>

                  {/* <Icon
                  onPress={() => this.setState({ showWarning: false })}
                  style={
                    isAllowDocuments
                      ? UploadDocumentStyle.closeIconApproved
                      : UploadDocumentStyle.closeIconRejected
                  }
                  name="close"
                  size={5}
                /> */}
                </View>
              ) : null}
              {this.state.isLoading ? <Loading /> : null}
              <Content>
                <View style={UploadDocumentStyle.container}>
                  <View style={{ height: '100%' }}>
                    {/* Step 1 */}
                    <View style={UploadDocumentStyle.step1Container}>
                      <View style={UploadDocumentStyle.stepCirle}>
                        <Text style={UploadDocumentStyle.stepCirleText}>1</Text>
                      </View>
                      <Text>{'Upload one document from List A'}</Text>
                    </View>
                    {documentA.length > 0
                      ? documentA.map((doc, i) => (
                          <Document
                            doc={doc}
                            t={t}
                            key={i}
                            // deleteDocumentAlert={this.deleteDocumentAlert}
                          />
                        ))
                      : null}
                    {/* Step 2 */}

                    <View style={UploadDocumentStyle.step1Container}>
                      <View style={UploadDocumentStyle.stepCirle}>
                        <Text style={UploadDocumentStyle.stepCirleText}>2</Text>
                      </View>
                      <Text>
                        {
                          'Upload one document from List B and one document from List C'
                        }
                      </Text>
                    </View>
                    {employmentDocuments.length > 0
                      ? employmentDocuments.map((doc, i) => (
                          <Document
                            doc={doc}
                            t={t}
                            key={i}
                            // deleteDocumentAlert={this.deleteDocumentAlert}
                          />
                        ))
                      : null}
                  </View>
                </View>
              </Content>
              <View style={UploadDocumentStyle.buttonContainer}>
                <Button
                  onPress={() => this.setState({ modalVisible: true })}
                  disabled={!isAllowDocuments}
                  style={UploadDocumentStyle.viewButtomLogin}>
                  <Text style={UploadDocumentStyle.placeholderTextButtomPicker}>
                    {t('USER_DOCUMENTS.addDocument')}
                  </Text>
                </Button>
              </View>
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}>
                <ModalHeader
                  screenName="employment_verification"
                  title={t('USER_DOCUMENTS.uploadDocuments')}
                  withoutHelpIcon={false}
                  onPressClose={() => this.setState({ modalVisible: false })}
                />
                <CustomPicker
                  data={documentsTypes}
                  onItemPress={(item) =>
                    this.setState(
                      { docType: item.id, modalVisible: false },
                      () => {
                        setTimeout(() => {
                          this.openImagePicker();
                        }, 1000);
                      },
                    )
                  }
                  itemRendered={(item) => {
                    const identity = item.validates_identity
                      ? t('USER_DOCUMENTS.identity')
                      : '';
                    const employment = item.validates_employment
                      ? t('USER_DOCUMENTS.employment')
                      : '';
                    const document_a = item.document_a ? 'DOCUMENT A' : '';
                    const form = item.is_form ? t('USER_DOCUMENTS.form') : '';
                    let strings = [];
                    const string = [identity, employment, document_a, form];
                    string.forEach((type) => {
                      if (
                        strings.filter((filterType) => filterType === type)
                          .length === 0 &&
                        type !== ''
                      )
                        strings.push(type);
                    });
                    return (
                      <Text>
                        {`${item.title} `}
                        <Text style={UploadDocumentStyle.itemTypeText}>
                          {`${t('USER_DOCUMENTS.type')} ${strings.join(', ')}`}
                        </Text>
                      </Text>
                    );
                  }}
                />
              </Modal>
            </Content>
            <Footer>
              <FooterTab style={{ backgroundColor: 'black' }}>
                <Button
                  onPress={() => {
                    if (!this.state.hasI9Form) {
                      inviteActions.postI9Form(this.state.data);
                    } else inviteActions.putI9Form(this.state.data);
                  }}>
                  <Text
                    style={{ color: 'white', fontSize: 16, fontWeight: 500 }}>
                    {!this.state.hasI9Form
                      ? 'Submit I-9 Form'
                      : 'Update Form I-9 Form'}
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

const stylesSign = StyleSheet.create({
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#eeeeee',
    margin: 10,
  },
});

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
UploadDocumentScreen.routeName = 'UPLOAD_DOCUEMNT_ROUTE';

export default UploadDocumentScreen;
