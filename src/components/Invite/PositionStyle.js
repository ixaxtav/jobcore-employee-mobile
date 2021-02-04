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
  buttonPosition: {
    textAlign: 'center',
    backgroundColor: BLUE_LIGHT,
  },
  headerCustom: {
    backgroundColor: 'black',
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
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
  contentScroll: {
    ...Platform.select({
      android: {
        borderTopWidth: 0,
        marginTop: -20,
      },
    }),
    width: '99%',
    height: 350,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 35,
    paddingBottom: 50,
    paddingTop: 25,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopColor: 'transparent',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  itemSelectCheck: {
    marginLeft: 0,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderColor: 'black',
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
  labelForm: {
    color: 'black',
  },
  textViolet: {
    color: 'black',
  },
  textBlue: {
    color: 'black',
  },
});
