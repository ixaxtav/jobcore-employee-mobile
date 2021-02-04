import { StyleSheet, Platform } from 'react-native';
import {
  BLUE_MAIN,
  VIOLET_MAIN,
  GRAY_MAIN,
  RED_MAIN,
  BLUE_DARK,
  BLACK_MAIN,
} from '../../shared/colorPalette';

const inviteStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCustom: {
    backgroundColor: BLUE_MAIN,
  },
  badge: {
    backgroundColor: RED_MAIN,
    position: 'absolute',
    right: 10,
    top: 1,
  },
  titleHeader: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
  },
  buttomApply: {
    backgroundColor: BLUE_MAIN,
  },
  buttomReject: {
    backgroundColor: VIOLET_MAIN,
  },
  viewButtonSavePreferences: {
    marginBottom: 0,
    borderRadius: 0,
    height: 90,
    backgroundColor: BLUE_DARK,
    ...Platform.select({
      android: {
        marginBottom: 0,
        borderRadius: 0,
        height: 55,
        backgroundColor: BLUE_DARK,
        alignItems: 'center',
        justifyContent: 'center',
      },
    }),
  },
  viewListItem: {
    paddingLeft: 5,
    paddingRight: 75,
    marginLeft: 5,
  },
  viewDataOffers: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 15,
    paddingRight: 15,
  },
  textOne: {
    color: VIOLET_MAIN,
    fontSize: 12,
    textAlign: 'left',
  },
  textTwo: {
    color: GRAY_MAIN,
    fontSize: 12,
    textAlign: 'left',
  },
  textThree: {
    color: BLUE_MAIN,
    fontSize: 12,
    textAlign: 'left',
  },
  textRed: {
    color: RED_MAIN,
    fontSize: 12,
    textAlign: 'left',
  },
  textBlack: {
    color: BLACK_MAIN,
    fontSize: 12,
    textAlign: 'left',
  },
  viewTitleInfo: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
});

export { inviteStyles };
export default inviteStyles;
