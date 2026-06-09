import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, Modal } from 'react-native';

const mockFiles = {
  '/': ['home', 'etc', 'tmp', 'var', 'usr', 'bin', 'lib', 'opt', 'root', 'mnt', 'boot', 'sys', 'dev', 'proc'],
  '/home': ['user'],
  '/home/user': ['Documents', 'Downloads', 'Pictures', 'Music', 'Videos', 'README.txt', '.bashrc', '.profile', '.config'],
  '/home/user/Documents': ['notes.txt', 'project', 'todo.md'],
  '/home/user/Downloads': [],
  '/home/user/Pictures': [],
  '/home/user/Music': [],
  '/home/user/Videos': [],
  '/home/user/.config': [],
  '/etc': ['hostname', 'os-release', 'passwd', 'hosts', 'resolv.conf'],
  '/tmp': [],
  '/var': ['log', 'www'],
  '/var/log': ['syslog', 'auth.log', 'messages'],
  '/var/www': [],
  '/usr': ['bin', 'local'],
  '/usr/bin': [],
  '/usr/local': ['bin'],
  '/usr/local/bin': [],
  '/bin': [],
  '/lib': [],
  '/opt': [],
  '/mnt': [],
  '/boot': [],
  '/root': [],
  '/sys': [],
  '/dev': [],
  '/proc': [],
};

const fileDetails = {
  'README.txt': { type: 'file', size: 145, date: '2024-01-15' },
  '.bashrc': { type: 'file', size: 89, date: '2024-01-10' },
  '.profile': { type: 'file', size: 56, date: '2024-01-10' },
  'notes.txt': { type: 'file', size: 234, date: '2024-01-20' },
  'todo.md': { type: 'file', size: 67, date: '2024-01-18' },
  'hostname': { type: 'file', size: 14, date: '2024-01-01' },
  'os-release': { type: 'file', size: 87, date: '2024-01-01' },
  'passwd': { type: 'file', size: 345, date: '2024-01-01' },
  'hosts': { type: 'file', size: 156, date: '2024-01-01' },
  'resolv.conf': { type: 'file', size: 45, date: '2024-01-01' },
  'syslog': { type: 'file', size: 12890, date: '2024-01-20' },
  'auth.log': { type: 'file', size: 4567, date: '2024-01-20' },
  'messages': { type: 'file', size: 2345, date: '2024-01-20' },
};

export default function FileBrowserScreen() {
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const getFiles = useCallback(() => {
    const files = mockFiles[currentPath] || [];
    return files.map(f => ({
      name: f,
      isDir: !fileDetails[f],
      size: fileDetails[f]?.size || 0,
      date: fileDetails[f]?.date || '-',
    }));
  }, [currentPath]);

  const navigateTo = (name) => {
    const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
    if (mockFiles[newPath] !== undefined) {
      setCurrentPath(newPath);
    } else {
      Alert.alert('Info', `This is a file. Use the Editor tab to view/edit it.`);
    }
  };

  const goBack = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath('/' + parts.join('/') || '/');
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newPath = currentPath === '/' ? `/${newFolderName}` : `${currentPath}/${newFolderName}`;
      mockFiles[newPath] = [];
      mockFiles[currentPath] = [...(mockFiles[currentPath] || []), newFolderName];
      setShowNewFolder(false);
      setNewFolderName('');
    }
  };

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.fileItem} onPress={() => navigateTo(item.name)}>
      <Text style={styles.fileIcon}>{item.isDir ? '📁' : '📄'}</Text>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileMeta}>
          {item.isDir ? 'directory' : `${item.size} B`} • {item.date}
        </Text>
      </View>
      <Text style={styles.fileArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumbBar}>
        <TouchableOpacity onPress={() => setCurrentPath('/')} style={styles.homeBtn}>
          <Text style={styles.homeText}>~</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumbText}>
          {breadcrumbs.map((b, i) => (
            <Text key={i}>
              <Text style={styles.separator}>/</Text>
              <Text style={styles.crumb}>{b}</Text>
            </Text>
          ))}
        </Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => setShowNewFolder(true)}>
          <Text style={styles.newBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFiles()}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Empty directory</Text>
          </View>
        }
      />

      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          {getFiles().length} {currentPath}
        </Text>
      </View>

      <Modal visible={showNewFolder} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Folder</Text>
            <TextInput
              style={styles.modalInput}
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="Folder name"
              placeholderTextColor="#666"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowNewFolder(false); setNewFolderName(''); }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={createFolder}>
                <Text style={styles.createText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  breadcrumbBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
  },
  homeBtn: { paddingRight: 8 },
  homeText: { color: '#00ff41', fontSize: 18, fontFamily: 'monospace' },
  backBtn: { paddingRight: 8 },
  backText: { color: '#3498db', fontSize: 20 },
  breadcrumbText: { flex: 1, color: '#e0e0e0', fontSize: 13, fontFamily: 'monospace' },
  separator: { color: '#555' },
  crumb: { color: '#00ff41' },
  newBtn: { paddingLeft: 8 },
  newBtnText: { color: '#00ff41', fontSize: 22, fontWeight: 'bold' },
  list: { paddingBottom: 20 },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a3e',
  },
  fileIcon: { fontSize: 20, marginRight: 12 },
  fileInfo: { flex: 1 },
  fileName: { color: '#e0e0e0', fontSize: 15, fontFamily: 'monospace' },
  fileMeta: { color: '#666', fontSize: 11, marginTop: 2 },
  fileArrow: { color: '#555', fontSize: 20 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#555', fontSize: 14 },
  infoBar: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#2a2a4e',
  },
  infoText: { color: '#555', fontSize: 11, fontFamily: 'monospace' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 20, width: '80%', borderWidth: 1, borderColor: '#2a2a5e' },
  modalTitle: { color: '#00ff41', fontSize: 16, fontFamily: 'monospace', marginBottom: 12 },
  modalInput: { backgroundColor: '#0d0d1a', color: '#e0e0e0', borderRadius: 6, padding: 10, fontFamily: 'monospace', borderWidth: 1, borderColor: '#2a2a5e' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, backgroundColor: '#2a2a4e' },
  cancelText: { color: '#999', fontFamily: 'monospace' },
  createBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, backgroundColor: '#003300', borderWidth: 1, borderColor: '#00ff41' },
  createText: { color: '#00ff41', fontFamily: 'monospace' },
});
