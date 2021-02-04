import { StyleSheet, Platform } from 'react-native';
import { WHITE_MAIN, BLUE_LIGHT } from '../../shared/colorPalette';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderLabel: {
    textAlign: 'center',
    color: 'black',
    marginTop: 20,
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
  radioButtonLeft: {
    fontSize: 14,
    color: 'black',
    marginLeft: 10,
    marginRight: 5,
  },
  radioButtonRight: {
    color: 'black',
    marginLeft: 5,
    marginRight: 10,
  },
  textAlldayOr: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    marginLeft: -25,
  },
  textDay: {
    textAlign: 'left',
    color: 'black',
  },
  textHour: {
    color: 'black',
  },
  buttonHour: {
    borderColor: 'black',
  },
  textToView: {
    marginLeft: 5,
    marginRight: 5,
  },
  textTo: {
    color: 'black',
    marginTop: 5,
  },
  buttonPosition: {
    textAlign: 'center',
    backgroundColor: BLUE_LIGHT,
  },
  headerCustom: {
    backgroundColor: '#808080',
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
  viewContainer: {
    marginTop: 20,
    paddingLeft: 0,
    paddingRight: 0,
  },
  textHeader: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
  itemSelectCheck: {
    marginLeft: 0,
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
  accordionPosition: {
    borderColor: 'transparent',
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  viewInput: {
    backgroundColor: 'transparent',
    height: 55,
    width: '100%',
    borderColor: '#808080',
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
  titleInvite: {
    color: 'black',
    fontSize: 14,
    marginBottom: 10,
  },
  itemInvite: {
    padding: 14,
    fontSize: 14,
    color: 'black',
  },
  buttomLeftActive: {
    backgroundColor: '#808080',
    borderColor: 'transparent',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttomLeftDesactive: {
    backgroundColor: 'transparent',
    borderColor: '#808080',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  labelForm: {
    color: 'black',
  },

  viewContainerItems: {
    flex: 1,
    flexDirection: 'row',
  },
  viewTextDay: {
    width: '20%',
  },
  viewRadio: {
    width: 80,
  },
  radioItems: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  radio: {
    width: 40,
  },
  viewPicker: {
    width: '33.3%',
  },
});
