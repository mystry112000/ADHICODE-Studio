import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import TerminalToolbar from '../components/TerminalToolbar';

export default function TerminalScreen() {
  const webViewRef = useRef(null);
  const [key, setKey] = useState(0);
  const { width, height } = useWindowDimensions();

  const sendKey = useCallback((keyStr) => {
    webViewRef.current?.postMessage(JSON.stringify({ type: 'sendKey', key: keyStr }));
  }, []);

  const handleRefresh = useCallback(() => {
    setKey(prev => prev + 1);
  }, []);

  const htmlSource = require('../../assets/terminal.html');

  return (
    <View style={styles.container}>
      <WebView
        key={key}
        ref={webViewRef}
        source={htmlSource}
        style={[styles.webview, { height: height - 160 }]}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        mixedContentMode="always"
        scrollEnabled={true}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        onMessage={() => {}}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
      />
      <TerminalToolbar onKeyPress={sendKey} onRefresh={handleRefresh} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  webview: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
