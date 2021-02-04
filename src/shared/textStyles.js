import { StyleSheet } from 'react-native';
import { WHITE_MAIN, GRAY_MAIN, RED_MAIN, BLACK_MAIN } from './colorPalette';

export default StyleSheet.create({
  title: {
    color: WHITE_MAIN,
    fontWeight: '500',
    fontSize: 18,
  },
  textEmployer: {
    color: 'black',
    textAlign: 'left',
    fontWeight: '700',
  },
  textGray: {
    color: GRAY_MAIN,
    textAlign: 'left',
  },
  textRed: {
    color: RED_MAIN,
    textAlign: 'left',
    fontWeight: '700',
  },
  textShiftTitle: {
    color: 'black',
    textAlign: 'left',
    fontWeight: '700',
  },
  textBlack: {
    color: BLACK_MAIN,
  },
});
