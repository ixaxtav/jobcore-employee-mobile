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

import { ADD_DOCUMENT_ROUTE, DASHBOARD_ROUTE } from '../../constants/routes';
import accountStore from './AccountStore';
import {
  uploadDocument,
  getDocuments,
  getUser,
  getDocumentsTypes,
} from './actions';
import { i18next } from '../../i18n';
import { LOG } from '../../shared';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import CustomPicker from '../../shared/components/CustomPicker';
import BackgroundCheckScreen from './BackgroundCheckScreen';
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

    console.log('upload document', this.state);
    return (
      <I18n>
        {(t) => (
          <Container>
            <ModalHeader
              screenName="i9_form"
              title={'I-9 Form'}
              withoutHelpIcon={false}
              canClose={true}
            />
            <Content padder>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  Last Name <Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input placeholder="Last Name" />
                </Item>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  First Name <Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input placeholder="First Name" />
                </Item>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  Middle Initial
                </Label>
                <Item regular>
                  <Input placeholder="Middle Initial" />
                </Item>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  Other Last Names
                </Label>
                <Item regular>
                  <Input placeholder="Other Last Names" />
                </Item>
              </View>

              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  Address <Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Label
                  style={{ paddingLeft: 3, marginBottom: 10, fontSize: 14 }}>
                  Street Address
                </Label>
                <Item regular>
                  <Input placeholder="Street Address" />
                </Item>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label
                  style={{ paddingLeft: 3, marginBottom: 10, fontSize: 14 }}>
                  Address - Line 2
                </Label>
                <Item regular>
                  <Input placeholder="Address - Line 2" />
                </Item>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                <View style={{ width: '30%', margin: '1%', aspectRatio: 1 }}>
                  <Label
                    style={{ paddingLeft: 3, marginBottom: 10, fontSize: 14 }}>
                    City
                  </Label>
                  <Item regular>
                    <Input placeholder="City" />
                  </Item>
                </View>
                <View style={{ width: '30%', margin: '1%', aspectRatio: 1 }}>
                  <Label
                    style={{ paddingLeft: 3, marginBottom: 10, fontSize: 14 }}>
                    State
                  </Label>
                  <Item regular>
                    <Input placeholder="State" />
                  </Item>
                </View>
                <View style={{ width: '30%', margin: '1%', aspectRatio: 1 }}>
                  <Label
                    style={{ paddingLeft: 3, marginBottom: 10, fontSize: 14 }}>
                    Zip Code
                  </Label>
                  <Item regular>
                    <Input placeholder="Zip Code" />
                  </Item>
                </View>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  Date Of Birth<Text style={{ color: 'red' }}>*</Text>
                  <Text style={{ fontStyle: 'italic' }}>
                    {' '}
                    (mm/dd/yyyy)
                  </Text>{' '}
                </Label>
                <Item regular>
                  <Input placeholder="mm/dd/yyyy" />
                </Item>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  Social Security Number<Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input placeholder="xxx-xx-xxxx" />
                </Item>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  Email<Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input placeholder="Email" />
                </Item>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  Telephone Number<Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input placeholder="(000) 000-0000" />
                </Item>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#787878',
                    marginTop: 30,
                    paddingLeft: 3,
                  }}>
                  I am aware that federal law provides for imprisonment and/or
                  fines for false statements or use of false documents in
                  connection with the completion of this form
                </Text>
              </View>

              {/* DROPDOWN */}
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  I attest, under penalty of perjury, that I am a (select from
                  list)<Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input />
                </Item>
              </View>

              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  Today's Date<Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input placeholder="mm/dd/yyyy" />
                </Item>
              </View>

              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 15 }}>
                  List of Acceptable Documents can be found in the link{' '}
                  <Text style={{ color: 'blue' }}>here</Text>
                </Label>
                <Text
                  style={{ paddingLeft: 3, fontSize: 14, color: '#787878' }}>
                  All documents must be UNEXPIRED. Present one document from
                  List A or a combination of one document from both List B and
                  List C.
                </Text>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 15 }}>
                  List A Documents that Establish Both Identity and Employment
                  Authorization
                </Label>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'U.S Passport'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'Passport Card'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'Permanent Resident Card (Form I-551)'}
                  </Text>
                </View>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 15 }}>
                  List B Documents that Establish Identity
                </Label>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'U.S State Driver\'s License / ID Card'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {
                      'Federal, state, or local government agency/entity ID Card'
                    }
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'School ID Card with photograph'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'U.S Military Card / Draft Record'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'Military Dependent\'s ID Card'}
                  </Text>
                </View>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 15 }}>
                  List C Documents that Establish Employment Authorization
                </Label>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'Social Security Account Number Card '}
                    <Text>without</Text>
                    {' one of these restrictions:'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 30 }}>
                  <Text>{'\u25E6'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'NOT VALID FOR EMPLOYMENT'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 30 }}>
                  <Text>{'\u25E6'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'VALID FOR WORK ONLY WITH INS AUTHORIZATION'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 30 }}>
                  <Text>{'\u25E6'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {'VALID FOR WORK ONLY WITH DHS AUTHORIZATION'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {
                      'Department of State Birth Certification (Forms DS-1350, FS-545, FS-240)'
                    }
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                  <Text>{'\u2022'}</Text>
                  <Text style={{ flex: 1, paddingLeft: 5 }}>
                    {
                      'Department of Homeland Security Employment Authorization Document'
                    }
                  </Text>
                </View>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label>
                  Select the list with your identity and/or employment
                  authorization documents<Text style={{ color: 'red' }}>*</Text>
                </Label>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{ flex: 1 }}>
                  <Button bordered dark full style={{ marginRight: 15 }}>
                    <Text style={{ color: 'black' }}>List A</Text>
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button bordered dark full style={{ marginLeft: 15 }}>
                    <Text style={{ color: 'black' }}>List B and C</Text>
                  </Button>
                </View>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  List A Document<Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input />
                </Item>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  List A Document Issuing Authority
                  <Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input />
                </Item>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  List A Document Number<Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input />
                </Item>
              </View>
              <View style={{ marginBottom: 30 }}>
                <Label style={{ paddingLeft: 3, marginBottom: 10 }}>
                  List A Document Expiry Date If Any
                  <Text style={{ color: 'red' }}>*</Text>
                </Label>
                <Item regular>
                  <Input />
                </Item>
              </View>
            </Content>
            <Footer>
              <FooterTab style={{ backgroundColor: 'black' }}>
                <Button>
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    Submit & Sign
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

UploadDocumentScreen.routeName = 'UPLOAD_DOCUMENT_ROUTE';

export default UploadDocumentScreen;
