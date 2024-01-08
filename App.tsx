/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackView, createNativeStackNavigator } from '@react-navigation/native-stack';
import MainListScreen from './src/screens/MainListScreen';
import FormScreen from './src/screens/FormScreen';

const ScreenStack = createNativeStackNavigator()
const App: React.FC = () => {
  return(
    <NavigationContainer>
      <ScreenStack.Navigator>
        <ScreenStack.Screen name='List' component={MainListScreen}/>
        <ScreenStack.Screen name='Form' component={FormScreen}/>
      </ScreenStack.Navigator>
    </NavigationContainer>
  );
};

export default App;