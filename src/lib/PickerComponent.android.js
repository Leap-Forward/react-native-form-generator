'use strict';

import React from 'react';
import ReactNative from 'react-native';
import { Picker } from '@react-native-community/picker';

let { View, StyleSheet, TextInput, Text } = ReactNative;
import { Field } from '../lib/Field';

var PickerItem = Picker.Item;

export class PickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.label,
    }
  }

  setValue(value) {
    this.setState({ value: value });
    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onValueChange) this.props.onValueChange(value);
  }

  handleLayoutChange(e) {
    this.setState(e.nativeEvent.layout);
  }

  handleValueChange(value) {

    this.setState({ value: (value && value != '') ? value : this.props.label });

    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onValueChange) this.props.onValueChange(value);
  }

  render() {

    return (<View><Field
            {...this.props}
            ref='inputBox'
            onPress={this.props.onPress}
        >
          <View style={[this.props.containerStyle,  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } ]}
                onLayout={this.handleLayoutChange.bind(this)}>
            <Text style={this.props.labelStyle}>{this.props.label}</Text>
            <Picker ref='picker'
                    {...this.props.pickerProps}
                    style={{height: 50, width: 120}}
                    selectedValue={this.state.value}
                    onValueChange={this.handleValueChange.bind(this)}
            >
              {Object.keys(this.props.options).map((value) => (
                  <PickerItem
                      color="black"
                      key={value}
                      value={value}
                      label={this.props.options[value]}
                  />
              ), this)}
            </Picker>
          </View>
        </Field>
        </View>
    )
  }
}
