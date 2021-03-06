import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  borderNone: {
    borderBottomColor: 'transparent',
  },
  picker: {
    width: undefined,
    maxWidth: width / 1.6,
    paddingLeft: 0,
  },
  pickerIcon: {
    color: 'black',
    position: 'absolute',
    right: 7,
  },
  container: {
    paddingHorizontal: 35,
  },
  itemTextBio: {
    borderBottomColor: 'transparent',
    marginBottom: 10,
    borderRadius: 0,
  },
  itemResume: {
    borderBottomColor: 'transparent',
    marginBottom: 10,
    borderRadius: 0,
  },
  labelForm: {
    color: 'black',
  },
  profileImg: {
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 30,
  },
  textBio: {
    color: 'black',
    borderRadius: 0,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
  },
  textButtom: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  textButtomChangePassword: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
    marginRight: 10,
    textAlign: 'right',
  },
  activateToachIdText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 10,
    textAlign: 'right',
    marginTop: 5,
  },
  textButtomSave: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  textButtomSignUp: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingBottom: 15,
  },
  viewBackground: {
    backgroundColor: '#ccc',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    resizeMode: 'cover',
    width: '100%',
  },
  viewButtomChangePassword: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
  viewButtomLogin: {
    backgroundColor: 'black',
    borderRadius: 0,
    height: 45,
    marginBottom: 20,
  },
  viewButtonResume: {
    backgroundColor: 'black',
    borderRadius: 0,
    height: 45,
    width: '100%',
    marginBottom: 20,
  },
  viewButtomSignUp: {
    backgroundColor: 'transparent',
    marginTop: 20,
    textAlign: 'center',
  },
  viewForm: {
    marginBottom: 20,
    marginTop: 0,
    paddingLeft: 35,
    paddingRight: 35,
    width,
  },
  viewInput: {
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderRadius: 0,
    borderWidth: 1,
    color: 'black',
    height: 40,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 0,
    width: '100%',
    position: 'relative',
  },
  viewInputBackground: {
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderRadius: 0,
    borderWidth: 1,
    color: 'black',
    height: 40,
    marginBottom: 60,
    marginTop: 15,
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 0,
    width: '100%',
    position: 'relative',
  },
  viewLogo: {
    alignSelf: 'center',
    height: 90,
    resizeMode: 'contain',
    width: '100%',
    ...Platform.select({
      android: {
        marginTop: '10%',
      },
    }),
  },
  viewTextArea: {
    backgroundColor: 'transparent',
    borderColor: 'black',
    color: 'black',
    borderRadius: 0,
    paddingLeft: 10,
    paddingRight: 10,
    ...Platform.select({
      ios: {
        paddingTop: 10,
        paddingBottom: 10,
      },
    }),
    marginBottom: 10,
  },
});
