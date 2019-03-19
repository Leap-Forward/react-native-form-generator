import React from 'react';
import Images from '@assets/images' // eslint-disable-line
import {
  StyleSheet, View, ImageBackground, NativeModules,
} from 'react-native';
import {
  Form,
  SwitchField,
  PickerField,
  TimePickerField,
} from 'react-native-form-generator';
import Icon from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import ModalPicker from './modalPicker';
import SettingsService from './SettingsService';
import Debug from '../../api/Debug';
import { reSchedule, cancelNotifications } from './NotificationService';
import sounds from './sounds';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    Sound.setCategory('Playback');
    this.sounds = sounds;

    this.fields = {
      remindersEnabled: 'remindersEnabled',
      reminderCount: 'reminderCount',
      reminderStart: 'reminderStart',
      reminderEnd: 'reminderEnd',
      reminderSound: 'reminderSound',
      snoozeInterval: 'snoozeInterval',
      includeMeetings: 'includeMeetings',
      includeWeekends: 'includeWeekends',
    };
    this.mounted = false;
    this.soundFiles = {
    };
  }

  async componentDidMount() {
    const { fields } = this;
    let settings;
    if (Debug.enableNative && __DEV__) {
      settings = await NativeModules.Settings.getSettings();
    } else {
      settings = SettingsService.get();
    }
    const reminderStart = new Date(settings[fields.reminderStart]);
    console.log(reminderStart);
    const reminderEnd = new Date(settings[fields.reminderEnd]);
    console.log(reminderEnd);
    const translatedSettings = {
      ...settings,
      reminderStart,
      reminderEnd,
      reminderSound: settings[fields.reminderSound] || 'None',
    };
    const { refs } = this.form;
    refs[fields.remindersEnabled].setValue(translatedSettings[fields.remindersEnabled]);
    refs[fields.reminderCount].setValue(translatedSettings[fields.reminderCount]);
    refs[fields.reminderStart].setTime(translatedSettings[fields.reminderStart]);
    refs[fields.reminderEnd].setTime(translatedSettings[fields.reminderEnd]);
    refs[fields.snoozeInterval].setValue(translatedSettings[fields.snoozeInterval]);
    refs[fields.includeWeekends].setValue(translatedSettings[fields.includeWeekends]);
    // refs[fields.includeMeetings].setValue(translatedSettings[fields.includeMeetings]);
    refs[fields.reminderSound].setValue(translatedSettings[fields.reminderSound]);
    this.mounted = true;
    Object
        .keys(this.sounds)
        .forEach((sound) => {
          this.soundFiles[sound] = new Sound(`${sound}.wav`, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', sound, error);
              return;
            }
            // loaded successfully
            console.log(`duration in seconds: ${this.soundFiles[sound].getDuration()} number of channels: ${this.soundFiles[sound].getNumberOfChannels()}`);
            // Play the sound with an onEnd callback
            // this.soundFiles[sound].play((success) => {
            //   if (success) {
            //     console.log('successfully finished playing');
            //   } else {
            //     console.log('playback failed due to audio decoding errors');
            //   }
            // });
          });
        });
  }

  componentWillUnmount() {
    Object
        .keys(this.sounds)
        .forEach((sound) => {
          this.soundFiles[sound].release();
        });
  }

  handleFormChange(formValues) {
    if (this.mounted) {
      if (formValues.remindersEnabled) {
        console.log(formValues);
        if (Debug.enableNative && __DEV__) {
          NativeModules.Settings.setSettings(formValues);
        } else {
          console.log('rescheduling');
          reSchedule(formValues);
        }
      } else {
        cancelNotifications();
      }
      SettingsService.save(formValues);
    }
  }

  soundChanged = (sound) => {
    if (this.mounted) {
      const soundFile = this.soundFiles[sound];
      if (soundFile) {
        if (sound !== this.sounds.default || sound !== this.sounds.silent) {
          soundFile.play((success) => {
            if (success) {
              console.log('successfully finished playing sound for');
            } else {
              console.log('playback failed due to audio decoding errors');
              // reset the player to its uninitialized state (android only)
              // this is the only option to recover after an error occurred and use the player again
              soundFile.reset();
            }
          });
        }
      } else {
        console.log(`${sound} not found`);
      }
    }
  }

  render() {
    const { fields } = this;
    return (
        <ImageBackground
            style={[styles.background]}
            source={Images.backgrounds.main}
        >
          <View style={styles.wrapper}>
            <Form
                ref={(c) => { this.form = c || this.form; }}
                onFocus={{/* (e, c) => this.handleFormFocus(e, c) */}}
                label="AWARENESS settings"
                onChange={f => this.handleFormChange(f)}
            >
              <SwitchField
                  containerStyle={styles.container}
                  labelStyle={[styles.labelText]}
                  label='Enable reminders'
                  ref={fields.remindersEnabled}
              />
              <PickerField
                  containerStyle={styles.container}
                  labelStyle={[styles.labelText]}
                  valueStyle={[styles.value]}
                  ref={fields.reminderCount}
                  label='Number of reminders each day'
                  options={{
                    1: '1',
                    2: '2',
                    3: '3',
                    4: '4',
                    5: '5',
                    6: '6',
                    7: '7',
                    8: '8',
                    9: '9',
                    10: '10',
                    11: '11',
                    12: '12',
                    13: '13',
                    14: '14',
                    15: '15',
                    16: '16',
                    17: '17',
                    18: '18',
                    19: '19',
                    20: '20',
                  }}
                  pickerWrapper={<ModalPicker title="Times per day" />}
                  iconRight={(
                      <Icon
                          style={{ alignSelf: 'center', marginRight: 10, color: '#969696' }}
                          name='ios-arrow-forward'
                          size={30}
                      />
                  )}
              />

              <TimePickerField
                  containerStyle={styles.container}
                  placeholderStyle={[styles.labelText]}
                  valueStyle={styles.value}
                  ref={fields.reminderStart}
                  placeholder='Start At'
                  pickerWrapper={<ModalPicker title="Start time" />}
                  dateTimeFormat={(date) => {
                    if (!date) return '';
                    const value = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return value;
                  }}
                  iconRight={(
                      <Icon
                          style={{ alignSelf: 'center', marginHorizontal: 10, color: '#969696' }}
                          name='ios-arrow-forward'
                          size={30}
                      />
                  )}
              />
              <TimePickerField
                  containerStyle={styles.container}
                  placeholderStyle={[styles.labelText]}
                  valueStyle={styles.value}
                  ref={fields.reminderEnd}
                  placeholder='End At'
                  pickerWrapper={<ModalPicker title="End time" />}
                  dateTimeFormat={(date) => {
                    if (!date) return '';
                    const value = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return value;
                  }}
                  iconRight={(
                      <Icon
                          style={{ alignSelf: 'center', marginHorizontal: 10, color: '#969696' }}
                          name='ios-arrow-forward'
                          size={30}
                      />
                  )}
              />

              <PickerField
                  containerStyle={styles.container}
                  labelStyle={[styles.labelText]}
                  valueStyle={styles.value}
                  ref={fields.snoozeInterval}
                  label='Snooze duration'
                  options={{
                    1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
                  }}
                  pickerWrapper={<ModalPicker title="Snooze duration" />}
                  iconRight={(
                      <Icon
                          style={{ alignSelf: 'center', marginRight: 10, color: '#969696' }}
                          name='ios-arrow-forward'
                          size={30}
                      />
                  )}
              />
              <PickerField
                  containerStyle={styles.container}
                  labelStyle={[styles.labelText]}
                  valueStyle={styles.value}
                  ref={fields.reminderSound}
                  onValueChange={this.soundChanged}
                  label='Reminder sound'
                  options={sounds}
                  pickerWrapper={<ModalPicker title="Reminder sound" />}
                  iconRight={(
                      <Icon
                          style={{ alignSelf: 'center', marginRight: 10, color: '#969696' }}
                          name='ios-arrow-forward'
                          size={30}
                      />
                  )}
              />
              {/* <SwitchField */}
              {/* containerStyle={styles.container} */}
              {/* labelStyle={[styles.labelText]} */}
              {/* ref={fields.includeMeetings} */}
              {/* label='Include meetings' */}
              {/* /> */}
              <SwitchField
                  containerStyle={styles.container}
                  labelStyle={[styles.labelText]}
                  ref={fields.includeWeekends}
                  label='Include weekends'
              />
            </Form>
          </View>
        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#000000',
    flex: 1,
  },
  wrapper: {
    flex: 1,
    marginTop: 80,
  },
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  labelText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  value: {
    color: 'white',
    fontFamily: 'System',
  },
});
