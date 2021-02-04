import { StyleSheet, Platform, Dimensions } from 'react-native';
var width = Dimensions.get('window').width;
import { BLUE_MAIN, BLUE_DARK, WHITE_MAIN } from '../../shared/colorPalette';

const styles = StyleSheet.create({
  root: { padding: 20, minHeight: 300 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    background: WHITE_MAIN,
  },
  viewLogo: {
    width: '75%',
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
    marginTop: '20%',
    marginBottom: 20,
  },
  viewButtomLogin: {
    marginBottom: 0,
    borderRadius: 0,
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
    borderColor: BLUE_MAIN,
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
  labelForm: {
    color: 'black',
  },
  formContainer: {
    marginTop: 20,
  },
});
