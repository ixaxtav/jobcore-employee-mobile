import { StyleSheet, Platform, Dimensions } from 'react-native';
import {
  // '#808080',
  // 'black',
  WHITE_MAIN,
  VIOLET_MAIN,
  // BLUE_LIGHT,
  // '#D3D3D3',
  RED_MAIN,
  BLACK_MAIN,
} from '../../shared/colorPalette';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTableText: {
    color: 'black',
    fontSize: 19,
    textAlign: 'center',
    top: 150,
  },
  containerImg: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexOne: {
    ...Platform.select({
      android: {
        flex: 1.5,
      },
      ios: {
        flex: 1.5,
      },
    }),
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: '#c9c9c9',
  },
  flexTwo: {
    ...Platform.select({
      android: {
        flex: 1.2,
      },
      ios: {
        flex: 0.8,
      },
    }),
    justifyContent: 'center',
    paddingLeft: 10,
    // alignItems: 'center',
    // borderColor: 'purple',
    // borderWidth: 2,
  },
  flexThree: {
    flex: 1.2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabOne: {
    width: '50%',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#808080',
    borderWidth: 1,
  },
  tabTwo: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#808080',
    borderWidth: 1,
    paddingVertical: 8,
  },
  styleWorkMode: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 3,
    textDecorationLine: 'underline',
  },
  noRight: {
    paddingRight: 0,
  },
  viewList: {
    paddingRight: 40,
    paddingLeft: 15,
  },
  titleDate: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    marginTop: 25,
    marginBottom: 15,
  },
  flexiStyle: {
    color: 'black',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 3,
    textDecorationLine: 'underline',
  },
  pointBlack: {
    height: 6,
    width: 6,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  containerTextInvitationJobs: {
    paddingTop: 5,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
  },
  containerChildTextInvitation: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  employerImg: {
    ...Platform.select({
      android: {
        borderRadius: 100,
        width: 60,
        height: 60,
      },
      ios: {
        borderRadius: 35,
        width: 70,
        height: 70,
      },
    }),
  },
  yourRating: {
    color: 'black',
    fontSize: Dimensions.get('window').width <= 340 ? 11 : 13,
    marginRight: 4,
    fontWeight: '900',
  },
  amountText: {
    color: 'black',
    fontWeight: '900',
    fontSize: Dimensions.get('window').width <= 340 ? 11 : 13,
    marginRight: 5,
  },
  viewDataOffers: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 15,
    paddingRight: 15,
  },
  viewTitleInfo: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  textEmployer: {
    color: 'black',
    fontWeight: '700',
    textAlign: 'left',
  },
  textGray: {
    color: '#AFAEAE',
    textAlign: 'left',
  },
  textRed: {
    fontWeight: '700',
    color: RED_MAIN,
    textAlign: 'left',
  },
  textShiftTitle: {
    color: 'black',
    textAlign: 'left',
  },
  textBlack: {
    color: BLACK_MAIN,
  },
  viewListItem: {
    paddingLeft: 5,
    paddingRight: 75,
    marginLeft: 0,
  },
  titleHeader: {
    color: WHITE_MAIN,
    fontWeight: '500',
    fontSize: 18,
  },
  welcomeItem: {
    paddingHorizontal: 30,
    marginLeft: 0,
  },
  textHello: {
    textAlign: 'center',
    color: 'black',
    fontSize: 22,
    fontWeight: '600',
  },
  textWelcome: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    // marginBottom: 40,
    // ...Platform.select({
    //   android: {
    //     marginBottom: 15,
    //   },
    // }),
  },
  viewDashboard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
  viewInvite: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
  viewItemJobsLeft: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  viewItemJobsRight: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  titleItem: {
    textAlign: 'center',
    color: 'black',
    fontSize: 12,
    marginBottom: 15,
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
  itemData: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  iconSize: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  buttonLeftActive: {
    backgroundColor: '#808080',
    borderColor: 'transparent',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttonLeftInactive: {
    backgroundColor: 'transparent',
    borderColor: '#808080',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttonRightActive: {
    backgroundColor: '#808080',
    borderColor: 'transparent',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonRightInactive: {
    backgroundColor: 'transparent',
    borderColor: '#808080',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  pointActive: {
    width: 8,
    height: 8,
    borderRadius: 0,
    backgroundColor: 'red',
  },
  profileInfoContainer: {
    marginVertical: 12,
    ...Platform.select({
      android: {
        height: 60,
      },
    }),
    justifyContent: 'space-around',
  },
});
