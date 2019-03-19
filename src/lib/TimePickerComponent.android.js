'use strict';


import React from 'react';
import PropTypes from 'prop-types';

let { View, StyleSheet, TextInput, Text, TimePickerAndroid } = require('react-native');
import { Field } from './Field';


export class TimePickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.date ? new Date(props.date) : '',
    }
  }

  handleValueChange(date) {
    this.setState({ date: date });

    if (this.props.onChange)
      this.props.onChange(date);
    if (this.props.onValueChange)
      this.props.onValueChange(date);
  }

  setTime(date) {
    this.setState({ date: date });
    if (this.props.onChange) this.props.onChange((this.props.prettyPrint) ? this.props.dateTimeFormat(date) : date);
    if (this.props.onValueChange) this.props.onValueChange(date);
  }

  async _togglePicker(event) {
    try {
      const { date } = this.props;
      const minuteInitial = date.getMinutes();
      const hourInitial = date.getHours();
      const options = {
        ...this.props.options,
        minute: minuteInitial,
        hour: hourInitial,
      }

      console.log(hourInitial, minuteInitial);
      const { action, hour, minute } = await TimePickerAndroid.open(options);
      if (action !== TimePickerAndroid.dismissedAction) {
        console.log(hour, minute);
        let date = new Date(0, 0, 0, hour, minute);

        this.handleValueChange(date);
        // Selected year, month (0-11), day
      }
    } catch ({ code, message }) {
      console.warn('Cannot open time picker', message);
    }


  }

  render() {
    let placeholderComponent = (this.props.placeholderComponent)
      ? this.props.placeholderComponent
      : <Text style={[formStyles.fieldText, this.props.placeholderStyle]}>{this.props.placeholder}</Text>

    const { date } = this.state;

    //console.log(date);

    return (<View><Field
        {...this.props}
        ref='inputBox'
        onPress={this._togglePicker.bind(this)}>
        <View style={[formStyles.fieldContainer,
          formStyles.horizontalContainer,
          this.props.containerStyle]}>

          {placeholderComponent}
          <View style={formStyles.horizontalContainer}>
            <Text style={[formStyles.fieldValue, this.props.valueStyle]}>
              {this.props.dateTimeFormat(date)}
            </Text>
            {(this.props.iconRight)
              ? this.props.iconRight
              : null
            }
          </View>
        </View>
      </Field>
      </View>
    )
  }

}

TimePickerComponent.propTypes = {
  dateTimeFormat: PropTypes.func,
  prettyPrint: PropTypes.bool
}

TimePickerComponent.defaultProps = {
  dateTimeFormat: (date) => {
    if (!date) return "";
    return date.toLocaleTimeString();
  }
};


let formStyles = StyleSheet.create({
  alignRight: {
    marginTop: 7, position: 'absolute', right: 10
  },
  noBorder: {
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  separatorContainer: {
    // borderTopColor: '#C8C7CC',
    // borderTopWidth: 1,
    paddingTop: 35,
    borderBottomColor: '#C8C7CC',
    borderBottomWidth: 1,
  },
  separator: {
    paddingLeft: 10,
    paddingRight: 10,
    color: '#6D6D72',
    paddingBottom: 7

  },
  fieldsWrapper: {
    // borderTopColor: '#afafaf',
    // borderTopWidth: 1,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
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
    justifyContent: 'center',
    color: '#C7C7CC'
  },
  fieldText: {
    justifyContent: 'center',
    lineHeight: 32
  },
  input: {
    paddingLeft: 10,
    paddingRight: 10,

  },
  helpTextContainer: {
    marginTop: 9,
    marginBottom: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
  helpText: {
    color: '#7a7a7a'
  }
});
