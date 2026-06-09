import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const keys = [
  { label: 'Esc', key: 'Escape' },
  { label: 'Tab', key: 'Tab' },
  { label: 'Ctrl', key: 'Ctrl+' },
  { label: 'Alt', key: 'Alt+' },
  { label: '/', key: '/' },
  { label: '|', key: '|' },
  { label: '~', key: '~' },
  { label: '↑', key: 'ArrowUp' },
  { label: '↓', key: 'ArrowDown' },
  { label: '↩', key: 'Enter' },
];

export default function TerminalToolbar({ onKeyPress, onRefresh }) {
  const [ctrlActive, setCtrlActive] = React.useState(false);
  const [altActive, setAltActive] = React.useState(false);

  const handlePress = (key) => {
    if (key === 'Ctrl+') {
      setCtrlActive(!ctrlActive);
      return;
    }
    if (key === 'Alt+') {
      setAltActive(!altActive);
      return;
    }
    if (ctrlActive) {
      onKeyPress('Ctrl+' + key);
      setCtrlActive(false);
      return;
    }
    if (altActive) {
      onKeyPress('Alt+' + key);
      setAltActive(false);
      return;
    }
    onKeyPress(key);
  };

  const specialActions = [
    { label: '🔄', action: onRefresh, key: 'refresh' },
    { label: 'C', action: () => handlePress('c'), key: 'c-ctrl' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshText}>↻</Text>
        </TouchableOpacity>
        {keys.map((k) => (
          <TouchableOpacity
            key={k.key}
            style={[
              styles.keyBtn,
              k.key === 'Ctrl+' && ctrlActive && styles.activeBtn,
              k.key === 'Alt+' && altActive && styles.activeBtn,
            ]}
            onPress={() => handlePress(k.key)}
          >
            <Text style={[styles.keyText, k.label.length <= 2 && styles.smallKey]}>{k.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d0d1a',
    borderTopWidth: 1,
    borderTopColor: '#1a1a3e',
    paddingVertical: 4,
  },
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 4,
  },
  keyBtn: {
    backgroundColor: '#1a1a3e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2a2a5e',
    minWidth: 36,
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: '#003300',
    borderColor: '#00ff41',
  },
  keyText: {
    color: '#e0e0e0',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  smallKey: {
    fontSize: 11,
  },
  refreshBtn: {
    backgroundColor: '#1a1a3e',
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a5e',
  },
  refreshText: {
    color: '#00ff41',
    fontSize: 18,
  },
});
