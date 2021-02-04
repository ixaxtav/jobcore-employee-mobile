/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import Stars from 'react-native-stars';
import { Icon } from 'native-base';
import { BLUE_DARK, BLUE_SEMI_LIGHT } from '../../shared/colorPalette';

const StarComponent = (props) => {
  return (
    <Stars
      default={props.rating}
      count={5}
      disabled
      half={false}
      // update={val=> this.onChangeStar(val)}
      fullStar={
        <Icon
          type="FontAwesome"
          name="star"
          style={{
            color: 'black',
            fontSize: 15,
          }}
        />
      }
      emptyStar={
        <Icon
          type="FontAwesome"
          name="star"
          style={{
            color: '#D3D3D3',
            fontSize: 15,
          }}
        />
      }
    />
  );
};

export default StarComponent;
