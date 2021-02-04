import { StyleSheet, Platform } from 'react-native';
import { WHITE_MAIN, BLUE_LIGHT, GRAY_LIGHT } from '../../shared/colorPalette';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderLabel: {
    textAlign: 'center',
    color: 'black',
  },
  textButton: {
    textAlign: 'center',
    color: 'black',
  },
  textButtonClickHere: {
    textAlign: 'center',
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textButtonWhite: {
    textAlign: 'center',
    color: WHITE_MAIN,
    fontWeight: '500',
  },
  titleInvite: {
    color: 'black',
    fontSize: 14,
    marginBottom: 10,
  },
  buttonLeftActive: {
    backgroundColor: 'transparent',
    borderColor: '#D3D3D3',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttonLeftInactive: {
    backgroundColor: 'transparent',
    borderColor: '#D3D3D3',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttonRightActive: {
    backgroundColor: 'transparent',
    borderColor: '#D3D3D3',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonRightInactive: {
    backgroundColor: 'transparent',
    borderColor: '#D3D3D3',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  itemInvite: {
    padding: 14,
    fontSize: 14,
    color: 'black',
  },
  viewPositions: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  textPositions: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonRounded: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    height: 50,
    borderColor: 'black',
    // backgroundColor: 'black',
    borderWidth: 1,
  },
  buttonRoundedDark: {
    marginTop: 15,
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: 'black',
    width: 200,
  },
  saveButtonPreferences: {
    width: '50%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonPosition: {
    marginTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  viewButtonSavePreferences: {
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
  viewButtonAvailability: {
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  viewButtonLocation: {
    marginTop: 30,
    marginBottom: 15,
    ...Platform.select({
      android: {
        paddingLeft: 1,
        paddingRight: 1,
      },
    }),
  },
  sliderValue: {
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'left',
    color: 'black',
  },
  sliderMaxValue: {
    fontSize: 12,
    textAlign: 'left',
    color: 'black',
  },
  headerCustom: {
    backgroundColor: '#D3D3D3',
  },
  titleHeader: {
    color: WHITE_MAIN,
    fontWeight: '500',
    fontSize: 18,
  },
  viewHeader: {
    backgroundColor: BLUE_LIGHT,
    borderRadius: 0,
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textHeader: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
  contentScroll: {
    height: 350,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 35,
    paddingBottom: 50,
    paddingTop: 5,
    borderTopColor: 'transparent',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  itemSelectCheck: {
    marginLeft: 0,
    paddingLeft: 20,
    paddingRight: 20,
  },
  IconCheck: {
    fontSize: 20,
    color: 'black',
  },
  textList: {
    color: 'black',
  },
  weekendsText: {
    color: 'black',
  },
  accordionAvailability: {
    borderColor: 'transparent',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 15,
  },
  textAvailability: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
  },
  textLocation: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  accordionPosition: {
    borderColor: 'transparent',
    marginTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  viewCrud: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 30,
  },
  viewButtomLeft: {
    width: '50%',
    marginRight: 5,
  },
  buttomLeft: {
    backgroundColor: 'black',
  },
  textButtomLeft: {
    color: WHITE_MAIN,
  },
  viewButtomRight: {
    width: '50%',
    marginLeft: 5,
  },
  buttomRight: {
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 1,
  },
  textButtomRight: {
    color: 'black',
  },
  viewInput: {
    backgroundColor: 'transparent',
    height: 55,
    width: '100%',
    borderColor: '#D3D3D3',
    color: 'black',
    borderRadius: 0,
    borderWidth: 1,
    paddingLeft: 20,
    paddingTop: 12,
    paddingRight: 10,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
    }),
  },
  viewInvite: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    marginBottom: 70,
    marginTop: 50,
  },
  viewInviteToggle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
  labelForm: {
    color: 'black',
  },
  viewWarning: {
    backgroundColor: '#ff7272',
    padding: 15,
  },
});
