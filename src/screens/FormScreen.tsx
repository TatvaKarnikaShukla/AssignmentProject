import React, {useState} from 'react';
import RootStackParamList from '../../types/RootStackParamList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RadioButton, TouchableRipple, useTheme} from 'react-native-paper';
import CheckBoxBase from '@react-native-community/checkbox';
import {Dropdown} from 'react-native-element-dropdown';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import theme from 'react-native-elements/dist/config/theme';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';

type FormScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Form'
>;
type FoodOptions = {
  pizza: boolean;
  pasta: boolean;
  burger: boolean;
  [key: string]: boolean; // Index signature
};

interface FormScreenProps {
  navigation: FormScreenNavigationProp;
}

const FormScreen: React.FC<FormScreenProps> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [inputValue, onChangeInputValue] = useState('');
  const [selectedRadioButton, onSelectedRadioButtonChange] =
    useState<string>('');
  const [checkedStates, setCheckedStates] = useState<FoodOptions>({
    pizza: false,
    pasta: false,
    burger: false,
  });
  const [dropDownValue, setDropDownValue] = useState<string>('');
  const [dropDownIsFocus, setDropDownIsFocus] = useState(false);
  const dropDownData = [
    {label: 'Vadodara', value: '1'},
    {label: 'Ahmadabad', value: '2'},
    {label: 'Gandhinagar', value: '3'},
    {label: 'Surat', value: '4'},
  ];
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleTimeChange = (event: any, selected: Date | undefined) => {
    setShowPicker(Platform.OS === 'ios'); // iOS doesn't have an auto-dismiss feature, so we handle it manually
    if (selected) {
      setSelectedTime(selected);
    }
  };

  const [selectedImage, setSelectedImage] = useState<string>('');

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false,
      });
      setSelectedImage(image.path);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const showTimePicker = () => {
    setShowPicker(true);
  };

  const handleTextClick = (value: string) => {
    onSelectedRadioButtonChange(value);
  };

  const handleOnChange = (key: string) => {
    setCheckedStates(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const theme = useTheme();

  const isAtLeastOneCheckboxSelected = Object.values(checkedStates).some(
    value => value,
  );

  const validateForm = () => {
    if (!inputValue.trim()) {
      Toast.show('Please enter your name', Toast.SHORT);
      return false;
    } else if (!selectedRadioButton.trim()) {
      Toast.show('Please select your gender', Toast.SHORT);
      return false;
    } else if (!isAtLeastOneCheckboxSelected) {
      Toast.show('Please select at least one food option', Toast.SHORT);
      return false;
    } else if (!dropDownValue.trim()) {
      Toast.show('Please select your city', Toast.SHORT);
      return false;
    } else if (!selectedImage.trim()) {
      Toast.show('Please select image', Toast.SHORT);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Toast.show('Form submitted successfully', Toast.SHORT);
    }, 5000);
  };
  return (
    <ScrollView>
      <View>
        <TextInput
          style={styles.inputStyle}
          placeholder="Enter your name"
          value={inputValue}
          onChangeText={onChangeInputValue}
          placeholderTextColor="black"
        />
        <View style={styles.radioButtonGroupStyle}>
          <Text style={styles.titleTextStyle}>Select Gender</Text>
          <RadioButton.Group
            onValueChange={value => onSelectedRadioButtonChange(value)}
            value={selectedRadioButton}>
            <View style={styles.formOptionsStyle}>
              <TouchableRipple
                onPress={() => handleTextClick('Male')}
                rippleColor={theme.colors.inversePrimary}>
                <View style={styles.radioButtonStyle}>
                  <RadioButton value="Male" />
                  <Text style={styles.buttonValueTextStyle}>Male</Text>
                </View>
              </TouchableRipple>

              <TouchableRipple
                onPress={() => handleTextClick('Female')}
                rippleColor={theme.colors.inversePrimary}>
                <View style={styles.radioButtonStyle}>
                  <RadioButton value="Female" />
                  <Text style={styles.buttonValueTextStyle}>Female</Text>
                </View>
              </TouchableRipple>
            </View>
          </RadioButton.Group>
        </View>
        <Text style={styles.titleTextStyle}>Select Food</Text>
        <View style={styles.formOptionsStyle}>
          {Object.entries(checkedStates).map(([key, value]) => (
            <View style={styles.checkBoxStyle} key={key}>
              <CheckBoxBase
                onValueChange={() => handleOnChange(key)}
                value={value}
                testID={key}
                tintColors={{true: theme.colors.primary, false: 'gray'}}
              />
              <Text style={styles.buttonValueTextStyle}>{key}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.titleTextStyle}>Select City</Text>
        <View style={styles.outerViewDropDownStyle}>
          <View style={styles.dropDownContainerStyle}>
            <Dropdown
              itemTextStyle={styles.dropDownItemStyle}
              placeholderStyle={styles.dropDownItemStyle}
              selectedTextStyle={styles.dropDownItemStyle}
              containerStyle={styles.dropDownContainerTextStyle}
              data={dropDownData}
              value={dropDownValue}
              valueField="value"
              labelField="label"
              placeholder="Select city"
              onChange={item => {
                setDropDownIsFocus(false);
                setDropDownValue(item.value);
              }}
            />
          </View>
        </View>
        <View style={styles.titleTextStyle}>
          <TouchableOpacity onPress={showTimePicker}>
            <Text style={[styles.titleTextStyle, styles.timePickerStyle]}>
              Time: {moment(selectedTime).format('hh:mm')}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <RNDateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>
        <View style={styles.titleTextStyle}>
          {selectedImage && (
            <Image
              source={{uri: selectedImage}}
              style={styles.selectedImageStyle}
            />
          )}
          <Button title="Pick Image" onPress={pickImage} />
        </View>
        <View style={styles.titleTextStyle}>
          <Button title="Submit" onPress={handleSubmit} />
        </View>
        <Spinner
          visible={loading}
          color={theme.colors.primary}
          size={'large'}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    padding: 10,
    margin: 20,
    fontSize: 18,
    color: 'black',
  },
  titleTextStyle: {
    color: 'black',
    padding: 10,
    fontSize: 18,
  },
  radioButtonStyle: {
    color: 'black',
    padding: 10,
    fontSize: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonValueTextStyle: {
    color: 'black',
  },
  radioButtonGroupStyle: {
    padding: 10,
  },
  checkBoxStyle: {
    color: 'black',
    padding: 20,
    fontSize: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  formOptionsStyle: {
    flexDirection: 'row',
  },
  outerViewDropDownStyle: {
    padding: 20,
  },
  dropDownContainerStyle: {
    padding: 5,
    color: 'black',
    fontSize: 18,
    borderColor: 'black',
    borderWidth: 1,
  },
  dropDownItemStyle: {
    color: 'black',
  },
  dropDownContainerTextStyle: {
    borderWidth: 1,
    borderColor: 'black',
  },
  timePickerStyle: {
    padding: 10,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderStyle: 'dotted',
  },
  selectedImageStyle: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default FormScreen;
