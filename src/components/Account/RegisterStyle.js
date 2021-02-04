import { StyleSheet, Platform, Dimensions } from 'react-native';
var width = Dimensions.get('window').width;
import { BLUE_MAIN, BLUE_DARK, WHITE_MAIN } from '../../shared/colorPalette';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE_MAIN,
  },

  viewLogo: {
    width: '80%',
    height: 90,
    ...Platform.select({
      ios: {
        marginTop: '10%',
      },
      android: {
        marginTop: '20%',
      },
    }),
  },

  viewBackground: {
    backgroundColor: '#ccc',
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  viewForm: {
    width: width,
    paddingLeft: 35,
    paddingRight: 35,
    marginTop: '10%',
    marginBottom: 20,
  },
  viewButtomLogin: {
    marginBottom: 0,
    borderRadius: 0,
    elevation: 0,
    height: 55,
    backgroundColor: 'black',
  },
  viewButtomSignUp: {
    borderRadius: 0,
    height: 55,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  textButtom: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  termsAndConditionsTitle: {
    marginLeft: 5,
    color: 'black',
  },
  termsAndConditionsTermTitle: {
    marginLeft: 5,
    color: 'black',
    fontWeight: 'bold',
  },
  termsTitleContainer: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  textButtomSignUp: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 25,
    color: 'black',
  },
  textButtomSave: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 5,
    marginRight: 10,
    color: 'black',
  },

  viewInput: {
    backgroundColor: 'transparent',
    height: 55,
    width: '100%',
    borderColor: 'black',
    color: 'black',
    borderRadius: 0,
    borderWidth: 1,
    paddingLeft: 20,
    paddingTop: 0,
    paddingRight: 10,
    marginBottom: 10,
  },
  viewInputGoogle: {
    backgroundColor: 'transparent',
    height: 55,
    width: '100%',
    borderColor: 'black',
    color: 'black',
    borderRadius: 0,
    borderWidth: 1,
    paddingLeft: 20,
    paddingTop: 0,
    paddingRight: 10,
    marginBottom: 10,
    zIndex: 9999,
  },
  borderNone: {
    borderBottomColor: 'transparent',
  },
  labelForm: {
    color: 'black',
  },
  formContainer: {
    marginTop: 20,
  },
  codeVerificationTitle: { textAlign: 'center', color: 'black', fontSize: 18 },

  resendButtomClick: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 40,
    textDecorationLine: 'underline',
    color: 'black',
  },
});
