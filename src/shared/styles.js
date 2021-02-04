import { StyleSheet } from 'react-native';
import { WHITE_MAIN } from './colorPalette';
import { hasNotch } from './utils';

const headerStyles = StyleSheet.create({
  headerCustom: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    // height: HEIGHT,
    justifyContent: 'center',
    borderBottomWidth: 0,
    paddingBottom: 0,
    // paddingTop: PADDING_TOP,
  },
  headerCustomWhite: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE_MAIN,
    // height: HEIGHT,
    justifyContent: 'center',
    borderBottomWidth: 0,
    paddingBottom: 0,
    // paddingTop: PADDING_TOP,
  },
  leftButtonImage: {
    color: WHITE_MAIN,
    fontSize: 35,
    fontWeight: '100',
    height: 30,
    // resizeMode: 'contain',
    textAlign: 'center',
    width: 30,
  },
  backButton: {
    // color: WHITE_MAIN,
    fontSize: 35,
    // fontWeight: '100',
    height: 25,
    // resizeMode: 'contain',
    // textAlign: 'center',
    width: 25,
  },
  modalTitleHeader: {
    color: WHITE_MAIN,
    width: 210,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  titleHeader: {
    color: WHITE_MAIN,
    fontSize: 18,
    fontWeight: '500',
  },
});

export { headerStyles };
