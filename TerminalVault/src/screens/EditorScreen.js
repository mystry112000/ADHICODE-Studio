import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView, Modal } from 'react-native';

const fileContents = {
  'README.txt': `Welcome to TerminalVault Linux!

This is a simulated Linux terminal environment for Android.
It provides a realistic command-line experience with:
  - 50+ built-in Linux commands
  - Virtual file system
  - Tab completion & command history
  - File browser
  - Code editor
  - SSH connectivity

Type 'help' in the terminal to see all available commands.`,
  'notes.txt': `TODO List:
- [ ] Learn Linux commands
- [ ] Set up SSH connections
- [ ] Explore the file system
- [ ] Write Python scripts`,
  'todo.md': `# Project Tasks
## TerminalVault
- [x] Terminal emulator
- [x] File system simulation  
- [x] Command engine
- [ ] SSH integration
- [ ] Real package management`,
  'hostname': 'terminalvault\n',
  '.bashrc': 'alias ll="ls -la"\nalias la="ls -la"\nexport PS1="\\u@\\h:\\w$ "\n',
  '.profile': 'export PATH=$PATH:/usr/local/bin\n',
  'os-release': 'NAME="TerminalVault"\nVERSION="1.0"\nID=terminalvault\n',
};

export default function EditorScreen() {
  const [currentFile, setCurrentFile] = useState(null);
  const [content, setContent] = useState('');
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  const openFile = (filename) => {
    setCurrentFile(filename);
    setContent(fileContents[filename] || '');
    setUnsaved(false);
    setShowFilePicker(false);
  };

  const saveFile = () => {
    if (currentFile) {
      fileContents[currentFile] = content;
      setUnsaved(false);
      Alert.alert('Saved', `File '${currentFile}' saved successfully.`);
    }
  };

  const handleChange = (text) => {
    setContent(text);
    setUnsaved(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.browseBtn} onPress={() => setShowFilePicker(true)}>
          <Text style={styles.browseBtnText}>📂 Open</Text>
        </TouchableOpacity>
        {currentFile && (
          <>
            <Text style={styles.filenameText}>{currentFile}</Text>
            {unsaved && <Text style={styles.unsavedDot}>●</Text>}
            <TouchableOpacity style={styles.saveBtn} onPress={saveFile}>
              <Text style={styles.saveBtnText}>💾 Save</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {currentFile ? (
        <ScrollView style={styles.editorScroll}>
          <TextInput
            style={styles.editor}
            value={content}
            onChangeText={handleChange}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textAlignVertical="top"
            scrollEnabled={false}
          />
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✎</Text>
          <Text style={styles.emptyTitle}>Code Editor</Text>
          <Text style={styles.emptySub}>Open a file from the file browser{'\n'}or create a new one</Text>
          <TouchableOpacity style={styles.browseFilesBtn} onPress={() => setShowFilePicker(true)}>
            <Text style={styles.browseFilesText}>Browse Files</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showFilePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a File</Text>
              <TouchableOpacity onPress={() => setShowFilePicker(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={Object.keys(fileContents)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.fileItem} onPress={() => openFile(item)}>
                  <Text style={styles.fileIcon}>📄</Text>
                  <Text style={styles.fileName}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              style={styles.fileList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
  },
  browseBtn: { paddingRight: 12 },
  browseBtnText: { color: '#3498db', fontSize: 14 },
  filenameText: { flex: 1, color: '#00ff41', fontSize: 13, fontFamily: 'monospace' },
  unsavedDot: { color: '#f1c40f', fontSize: 10, marginRight: 8 },
  saveBtn: { paddingLeft: 8 },
  saveBtnText: { color: '#2ecc71', fontSize: 14 },
  editorScroll: { flex: 1 },
  editor: {
    flex: 1,
    color: '#e0e0e0',
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    backgroundColor: '#0d0d1a',
    padding: 12,
    lineHeight: 20,
    minHeight: 400,
  },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  emptyIcon: { fontSize: 48, color: '#2a2a5e', marginBottom: 12 },
  emptyTitle: { color: '#00ff41', fontSize: 18, fontFamily: 'monospace', marginBottom: 8 },
  emptySub: { color: '#666', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  browseFilesBtn: { backgroundColor: '#1a1a3e', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#2a2a5e' },
  browseFilesText: { color: '#00ff41', fontFamily: 'monospace' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1a1a2e', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '70%', paddingBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a4e' },
  modalTitle: { color: '#00ff41', fontSize: 16, fontFamily: 'monospace' },
  closeText: { color: '#666', fontSize: 18, padding: 4 },
  fileList: { paddingHorizontal: 16 },
  fileItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a3e' },
  fileIcon: { fontSize: 16, marginRight: 10 },
  fileName: { color: '#e0e0e0', fontSize: 14, fontFamily: 'monospace' },
});
