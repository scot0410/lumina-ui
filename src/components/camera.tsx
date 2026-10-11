import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Fontisto } from '@expo/vector-icons';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  if (!permission || !permission.granted) {
    return (
      <View style={[styles.darkBackground, styles.center]}>
        <Ionicons name="camera-outline" size={64} color="#555" />
        <Text style={styles.permissionText}>Camera access is required to take photos.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ shutterSound: false });
        console.log('Photo captured successfully URI:', photo?.uri);
      } catch (error) {
        console.error('Capture error:', error);
      }
    }
  };

  const toggleFlash = () => setFlash(current => (current === 'off' ? 'on' : 'off'));
  const toggleFacing = () => setFacing(current => (current === 'front' ? 'back' : 'front'));

  return (
    <View style={styles.container}>
      {/* 1. Camera View takes up the entire background */}
      <CameraView
        style={StyleSheet.absoluteFill}
        ref={cameraRef}
        facing={facing}
        flash={flash}
      />

      {/* 2. Unified Interface Layer containing the 3-Column Grid */}
      <View style={[styles.interfaceOverlay, { paddingHorizontal: 24 }]}>
        
        {/* LEFT COLUMN: Flash toggle aligns here automatically */}
        <View style={[styles.column, styles.leftAlign, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <Ionicons
              name={flash === 'on' ? 'flash' : 'flash-off'}
              size={24}
              color={flash === 'on' ? '#FFD60A' : '#FFF'}
            />
          </TouchableOpacity>
        </View>

        {/* MIDDLE COLUMN: Shutter button naturally maps here */}
        <View style={[styles.column, styles.centerAlign, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity style={styles.shutterButton} onPress={takePhoto}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        </View>

        {/* RIGHT COLUMN: Camera toggle lines up on the right margin */}
        <View style={[styles.column, styles.rightAlign, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleFacing}>
            <Fontisto name="spinner-refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  darkBackground: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // --- The Unified Layout Engine ---
  interfaceOverlay: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row', // Divides the entire screen surface horizontally
  },
  column: {
    flex: 1, // Splits screen width into 3 mathematically identical blocks
    height: '100%', // Runs from the absolute top to the absolute bottom
  },
  leftAlign: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start', // Holds item at top-left
  },
  centerAlign: {
    alignItems: 'center',
    justifyContent: 'flex-end', // Holds item at bottom-center
  },
  rightAlign: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end', // Holds item at bottom-right
  },
  // --- Button Styling Rules ---
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

