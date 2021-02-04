import {
  Body,
  Header,
  Left,
  Title,
  Right,
  Button,
  Text,
  Icon,
} from 'native-base';
import { Image } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { WHITE_MAIN } from '../colorPalette';
import { headerStyles } from '../styles';
import HelpIcon from '../../components/onboarding/components/HelpIcon';

const TabHeaderWhite = ({
  title,
  screenName,
  goBack = false,
  onPressBack,
  onPressHelp,
}) => (
  <Header
    androidStatusBarColor={WHITE_MAIN}
    style={headerStyles.headerCustomWhite}>
    <Left style={!goBack ? { flex: 0.9 } : ''}>
      {goBack ? (
        <Button style={{ marginLeft: 10 }} transparent onPress={onPressBack}>
          {/* <Image
            style={headerStyles.backButton}
            source={require('../../assets/image/back.png')}
          /> */}
          <Icon
            style={{ color: 'black' }}
            type="FontAwesome"
            name="angle-left"
          />
        </Button>
      ) : null}
    </Left>
    <Body style={{ flex: 0 }}>
      <Title
        numberOfLines={1}
        ellipsizeMode="clip"
        style={headerStyles.titleHeader}>
        {title}
      </Title>
    </Body>
    <Right>
      {screenName && (
        <HelpIcon onPressHelp={onPressHelp} screenName={screenName} />
      )}
    </Right>
  </Header>
);

TabHeaderWhite.propTypes = {
  title: PropTypes.string.isRequired,
  screenName: PropTypes.string,
  goBack: PropTypes.bool.isRequired,
  onPressBack: PropTypes.func.isRequired,
  onPressHelp: PropTypes.func.isRequired,
};

export { TabHeaderWhite };
