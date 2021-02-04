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
      android: {
        marginTop: '20%',
      },
    }),
  },
  viewBackground: {
    backgroundColor: WHITE_MAIN,
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
    marginTop: '20%',
    marginBottom: 20,
  },
  labelForm: {
    color: 'black',
  },
  viewButtomLogin: {
    marginBottom: 0,
    borderRadius: 0,
    height: 55,
    backgroundColor: 'black',
    ...Platform.select({
      android: {
        marginBottom: 0,
        borderRadius: 0,
        height: 55,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
      },
    }),
  },
  viewButtomSignUp: {
    borderRadius: 0,
    height: 55,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  viewButtomRegister: {
    marginTop: 30,
    borderRadius: 0,
    height: 55,
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 3,
    color: 'black',
  },
  textButtom: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    ...Platform.select({
      android: {
        color: WHITE_MAIN,
        alignItems: 'center',
        justifyContent: 'center',
      },
    }),
  },

  textButtomClick: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 25,
    textDecorationLine: 'underline',
    color: 'black',
  },
  textButtomRegister: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: 'black',
  },
  textButtomForgot: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 10,
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
  borderNone: {
    borderBottomColor: 'transparent',
  },
});
