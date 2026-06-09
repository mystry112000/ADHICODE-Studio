import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, View, Text } from 'react-native';
import TerminalScreen from './src/screens/TerminalScreen';
import FileBrowserScreen from './src/screens/FileBrowserScreen';
import EditorScreen from './src/screens/EditorScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
    <Text style={{ fontSize: 18, color: focused ? '#00ff41' : '#666' }}>
      {label === 'Terminal' ? '>' : label === 'Files' ? '📁' : label === 'Editor' ? '✎' : '⚙'}
    </Text>
  </View>
);

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0d0d1a' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d1a" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0d0d1a', elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerTintColor: '#00ff41',
            headerTitleStyle: { fontFamily: 'monospace', fontWeight: 'bold', fontSize: 16 },
            tabBarStyle: { backgroundColor: '#0d0d1a', borderTopColor: '#1a1a3e', borderTopWidth: 1, height: 56, paddingBottom: 6 },
            tabBarActiveTintColor: '#00ff41',
            tabBarInactiveTintColor: '#555',
            tabBarLabelStyle: { fontSize: 11, fontFamily: 'monospace' },
          }}
        >
          <Tab.Screen
            name="Terminal"
            component={TerminalScreen}
            options={{
              tabBarIcon: ({ focused }) => <TabIcon label="Terminal" focused={focused} />,
              headerTitle: 'TerminalVault',
            }}
          />
          <Tab.Screen
            name="Files"
            component={FileBrowserScreen}
            options={{
              tabBarIcon: ({ focused }) => <TabIcon label="Files" focused={focused} />,
              headerTitle: 'File Browser',
            }}
          />
          <Tab.Screen
            name="Editor"
            component={EditorScreen}
            options={{
              tabBarIcon: ({ focused }) => <TabIcon label="Editor" focused={focused} />,
              headerTitle: 'Code Editor',
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ focused }) => <TabIcon label="Settings" focused={focused} />,
              headerTitle: 'Settings',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}
