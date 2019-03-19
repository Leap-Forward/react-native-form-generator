'use strict';

import React from 'react';
import ReactNative from 'react-native';

let { View, StyleSheet, TextInput, Text } = ReactNative;


import { TimePickerComponent } from '../lib/TimePickerComponent';

export class TimePickerField extends React.Component {

  state = {
    date: new Date(),
  }

  setTime(date) {
    this.refs.datePickerComponent.setTime(date);
    this.setState({ date });
  }

  render() {
    const { date } = this.state;

    return (<TimePickerComponent
      {...this.props}
      date={this.state.date}
      ref='datePickerComponent'
      labelStyle={this.props.labelStyle}
      valueStyle={this.props.valueStyle}
      valueContainerStyle={this.props.valueContainerStyle}
      containerStyle={this.props.containerStyle}
    />)
  }

}


let formStyles = StyleSheet.create({
  form: {},
  alignRight: {
    marginTop: 7, position: 'absolute', right: 10
  },
  horizontalContainer: {
    flexDirection: 'row',

    justifyContent: 'flex-start'
  },
  fieldContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#C8C7CC',
    backgroundColor: 'white',
    justifyContent: 'center',
    height: 45
  },
  fieldValue: {
    fontSize: 34 / 2,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    paddingTop: 4,
    justifyContent: 'center',

    color: '#C7C7CC'
  },
  fieldText: {
    fontSize: 34 / 2,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    lineHeight: 32
  },
  input: {
    paddingLeft: 10,
    paddingRight: 10,

  },
});
