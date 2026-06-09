import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, Alert } from 'react-native';

const THEMES = {
  'Hacker Green': { bg: '#0d0d1a', fg: '#00ff41', cursor: '#00ff41', sel: '#003300' },
  'Matrix': { bg: '#000000', fg: '#00ff00', cursor: '#00ff00', sel: '#003300' },
  'Dark': { bg: '#1e1e2e', fg: '#cdd6f4', cursor: '#f5e0dc', sel: '#45475a' },
  'Light': { bg: '#ffffff', fg: '#1e1e2e', cursor: '#1e1e2e', sel: '#dce0e8' },
  'Amber': { bg: '#1a0f00', fg: '#ffb000', cursor: '#ffb000', sel: '#332200' },
  'Solarized': { bg: '#002b36', fg: '#839496', cursor: '#93a1a1', sel: '#073642' },
  'Nord': { bg: '#2e3440', fg: '#d8dee9', cursor: '#88c0d0', sel: '#4c566a' },
  'Dracula': { bg: '#282a36', fg: '#f8f8f2', cursor: '#ff79c6', sel: '#44475a' },
};

export default function SettingsScreen() {
  const [selectedTheme, setSelectedTheme] = useState('Hacker Green');
  const [fontSize, setFontSize] = useState('14');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [sshHost, setSshHost] = useState('');
  const [sshUser, setSshUser] = useState('');
  const [sshConnections, setSshConnections] = useState([]);

  const addConnection = () => {
    if (sshHost && sshUser) {
      setSshConnections([...sshConnections, { id: Date.now(), host: sshHost, user: sshUser }]);
      setSshHost('');
      setSshUser('');
      Alert.alert('Saved', `SSH connection to ${sshUser}@${sshHost} saved.`);
    }
  };

  const connectSSH = (conn) => {
    Alert.alert('SSH Connect', `Connecting to ${conn.user}@${conn.host}...\n\nSSH requires network access. Use the terminal and type:\nssh ${conn.user}@${conn.host}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        <TouchableOpacity style={styles.settingRow} onPress={() => setShowThemePicker(true)}>
          <Text style={styles.settingLabel}>Theme</Text>
          <View style={styles.themePreview}>
            <View style={[styles.colorDot, { backgroundColor: THEMES[selectedTheme].bg, borderColor: THEMES[selectedTheme].fg }]} />
            <Text style={styles.settingValue}>{selectedTheme}</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Font Size</Text>
          <View style={styles.fontSizeControl}>
            <TouchableOpacity onPress={() => setFontSize(String(Math.max(10, parseInt(fontSize) - 1)))} style={styles.sizeBtn}>
              <Text style={styles.sizeBtnText}>−</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.fontSizeInput}
              value={fontSize}
              onChangeText={setFontSize}
              keyboardType="number-pad"
              maxLength={2}
            />
            <TouchableOpacity onPress={() => setFontSize(String(Math.min(24, parseInt(fontSize) + 1)))} style={styles.sizeBtn}>
              <Text style={styles.sizeBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SSH Connections</Text>

        <View style={styles.sshInputRow}>
          <TextInput
            style={styles.sshInput}
            placeholder="hostname"
            placeholderTextColor="#555"
            value={sshHost}
            onChangeText={setSshHost}
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.sshInput, { flex: 0.5 }]}
            placeholder="user"
            placeholderTextColor="#555"
            value={sshUser}
            onChangeText={setSshUser}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addConnection}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {sshConnections.length === 0 ? (
          <Text style={styles.noConnections}>No saved connections</Text>
        ) : (
          sshConnections.map(conn => (
            <TouchableOpacity key={conn.id} style={styles.connectionItem} onPress={() => connectSSH(conn)}>
              <Text style={styles.connIcon}>🔗</Text>
              <View style={styles.connInfo}>
                <Text style={styles.connName}>{conn.user}@{conn.host}</Text>
                <Text style={styles.connStatus}>Tap to connect</Text>
              </View>
              <Text style={styles.connArrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>TerminalVault</Text>
          <Text style={styles.aboutValue}>v1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Engine</Text>
          <Text style={styles.aboutValue}>xterm.js + Custom Shell</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Commands</Text>
          <Text style={styles.aboutValue}>60+ built-in</Text>
        </View>
        <Text style={styles.aboutDesc}>
          A mobile Linux terminal environment with simulated shell, file system, and SSH capabilities.
        </Text>
      </View>

      <Modal visible={showThemePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Theme</Text>
              <TouchableOpacity onPress={() => setShowThemePicker(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            {Object.keys(THEMES).map(name => (
              <TouchableOpacity
                key={name}
                style={[styles.themeItem, selectedTheme === name && styles.themeItemSelected]}
                onPress={() => { setSelectedTheme(name); setShowThemePicker(false); }}
              >
                <View style={styles.themeRow}>
                  <View style={[styles.themeSwatch, { backgroundColor: THEMES[name].bg }]}>
                    <Text style={[styles.swatchText, { color: THEMES[name].fg }]}>Aa</Text>
                  </View>
                  <Text style={styles.themeName}>{name}</Text>
                </View>
                {selectedTheme === name && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: { color: '#00ff41', fontSize: 14, fontFamily: 'monospace', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a3e', paddingBottom: 6 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a3e' },
  settingLabel: { color: '#e0e0e0', fontSize: 14 },
  themePreview: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colorDot: { width: 20, height: 20, borderRadius: 4, borderWidth: 1 },
  settingValue: { color: '#00ff41', fontSize: 14, fontFamily: 'monospace' },
  arrow: { color: '#666', fontSize: 18, paddingLeft: 4 },
  fontSizeControl: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sizeBtn: { width: 32, height: 32, borderRadius: 6, backgroundColor: '#1a1a3e', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2a2a5e' },
  sizeBtnText: { color: '#e0e0e0', fontSize: 18 },
  fontSizeInput: { color: '#00ff41', fontSize: 16, fontFamily: 'monospace', textAlign: 'center', width: 40, backgroundColor: '#0d0d1a', borderRadius: 4, borderWidth: 1, borderColor: '#2a2a5e', paddingVertical: 2 },
  sshInputRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  sshInput: { flex: 1, backgroundColor: '#0d0d1a', color: '#e0e0e0', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, fontFamily: 'monospace', borderWidth: 1, borderColor: '#2a2a5e' },
  addBtn: { backgroundColor: '#003300', width: 40, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#00ff41' },
  addBtnText: { color: '#00ff41', fontSize: 20 },
  noConnections: { color: '#555', fontSize: 13, fontStyle: 'italic', paddingVertical: 12, textAlign: 'center' },
  connectionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1a1a3e' },
  connIcon: { fontSize: 16, marginRight: 10 },
  connInfo: { flex: 1 },
  connName: { color: '#e0e0e0', fontSize: 14, fontFamily: 'monospace' },
  connStatus: { color: '#555', fontSize: 11 },
  connArrow: { color: '#555', fontSize: 18 },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1a1a3e' },
  aboutLabel: { color: '#e0e0e0', fontSize: 13 },
  aboutValue: { color: '#00ff41', fontSize: 13, fontFamily: 'monospace' },
  aboutDesc: { color: '#666', fontSize: 12, lineHeight: 18, marginTop: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1a1a2e', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a4e' },
  modalTitle: { color: '#00ff41', fontSize: 16, fontFamily: 'monospace' },
  closeText: { color: '#666', fontSize: 18, padding: 4 },
  themeItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a3e' },
  themeItemSelected: { backgroundColor: '#0a0a1a' },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  themeSwatch: { width: 36, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  swatchText: { fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' },
  themeName: { color: '#e0e0e0', fontSize: 14 },
  checkMark: { color: '#00ff41', fontSize: 16 },
});
