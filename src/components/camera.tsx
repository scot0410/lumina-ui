// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   StatusBar,
//   Dimensions,
//   ActivityIndicator
// } from 'react-native';
// // Modern Replacement for Deprecated SafeAreaView
// import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { Flashlight, Scan, Search, RotateCw, Image, ShieldCheck, Bookmark } from 'lucide-react-native';

// const { width } = Dimensions.get('window');

// export default function ScanProductScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [facing, setFacing] = useState<'back' | 'front'>('back');
//   const [enableTorch, setEnableTorch] = useState<boolean>(false);

//   // Handle Loading States for Camera Privileges
//   if (!permission) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#005F59" />
//       </View>
//     );
//   }

//   // Handle Fallback View for Denied Camera Access
//   if (!permission.granted) {
//     return (
//       <SafeAreaProvider>
//         <SafeAreaView style={styles.centerContainer}>
//           <Text style={styles.permissionText}>We need your permission to show the camera</Text>
//           <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//             <Text style={styles.permissionButtonText}>Grant Permission</Text>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </SafeAreaProvider>
//     );
//   }

//   function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   }

//   function toggleTorch() {
//     setEnableTorch(current => !current);
//   }

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="dark-content" />

//         {/* 1. HEADER SECTION */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Scan a product</Text>
//           <Text style={styles.headerSubtitle}>A little clarity for your everyday choices.</Text>
//         </View>

//         {/* 2. CAMERA VIEWFINDER FRAME */}
//         <View style={styles.viewfinderContainer}>
//           <CameraView
//             style={StyleSheet.absoluteFill}
//             facing={facing}
//             enableTorch={enableTorch}
//           />

//           <View style={styles.cameraOverlayContainer} pointerEvents="box-none">

//             {/* Top Info Banner Layer */}
//             <View style={styles.cameraTopRow} pointerEvents="box-none">
//               <View style={styles.instructionBanner}>
//                 <Text style={styles.bannerTitle}>Frame the product label</Text>
//                 <Text style={styles.bannerSubtitle}>Keep the name and ingredients readable.</Text>
//               </View>
//               <TouchableOpacity
//                 style={[styles.iconCircleButton, enableTorch && styles.activeCircleButton]}
//                 onPress={toggleTorch}
//                 activeOpacity={0.7}
//               >
//                 <Flashlight color={enableTorch ? "#005F59" : "#FFFFFF"} size={20} />
//               </TouchableOpacity>
//             </View>

//             {/* Corner Target Markers */}
//             <View style={styles.frameOverlay} pointerEvents="none">
//               <View style={[styles.corner, styles.topLeft]} />
//               <View style={[styles.corner, styles.topRight]} />
//               <View style={[styles.corner, styles.bottomLeft]} />
//               <View style={[styles.corner, styles.bottomRight]} />
//             </View>

//             {/* Bottom Stream Utilities */}
//             <View style={styles.cameraBottomRow} pointerEvents="box-none">
//               <TouchableOpacity style={styles.capsuleButton} activeOpacity={0.7}>
//                 <Search color="#FFFFFF" size={16} />
//                 <Text style={styles.capsuleText}>Tap to focus</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={[styles.iconCircleButton, { width: 40, height: 40 }]}>
//                 <Text style={styles.zoomText}>1x</Text>
//               </TouchableOpacity>
//             </View>

//           </View>
//         </View>

//         {/* 3. HEALTH WARNING BANNER */}
//         <View style={styles.guidanceBanner}>
//           <Text style={styles.guidanceTitle}>Pregnancy guidance + separate recall check</Text>
//           <Text style={styles.guidanceText}>
//             Ingredient & preparation guidance, then recall information. A photo can't confirm safety.
//           </Text>
//         </View>

//         {/* 4. FOOTER CONTROLS ROW */}
//         <View style={styles.actionRow}>
//           <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
//             <View style={styles.actionIconContainer}>
//               <Image color="#005F59" size={22} />
//             </View>
//             <Text style={styles.actionLabel}>Upload photo</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.shutterButtonOuter} activeOpacity={0.8}>
//             <View style={styles.shutterButtonInner}>
//               <Scan color="#FFFFFF" size={28} />
//             </View>
//             <Text style={[styles.actionLabel, styles.activeLabel]}>Take photo</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionButton} onPress={toggleCameraFacing} activeOpacity={0.7}>
//             <View style={styles.actionIconContainer}>
//               <RotateCw color="#005F59" size={22} />
//             </View>
//             <Text style={styles.actionLabel}>Flip camera</Text>
//           </TouchableOpacity>
//         </View>

//         {/* 5. APP BAR TABS MOCK */}
//         <View style={styles.bottomNav}>
//           <TouchableOpacity style={styles.navItem}>
//             <View style={styles.activeNavIndicator}>
//               <Scan color="#005F59" size={20} />
//             </View>
//             <Text style={[styles.navLabel, styles.activeNavLabel]}>Scan</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.navItem}>
//             <ShieldCheck color="#7C8B9A" size={20} style={styles.inactiveNavIcon} />
//             <Text style={styles.navLabel}>Alerts</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.navItem}>
//             <Bookmark color="#7C8B9A" size={20} style={styles.inactiveNavIcon} />
//             <Text style={styles.navLabel}>Saved</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 24,
//   },
//   permissionText: {
//     fontSize: 16,
//     color: '#677482',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#005F59',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   permissionButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 15,
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#1A2530',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#677482',
//   },
//   viewfinderContainer: {
//     flex: 1,
//     marginHorizontal: 12,
//     borderRadius: 16,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   cameraOverlayContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: 'transparent',
//   },
//   cameraTopRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     zIndex: 10,
//   },
//   instructionBanner: {
//     backgroundColor: 'rgba(26, 37, 48, 0.85)',
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     maxWidth: width * 0.72,
//   },
//   bannerTitle: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 14,
//     marginBottom: 2,
//   },
//   bannerSubtitle: {
//     color: '#CFD6DC',
//     fontSize: 11,
//   },
//   iconCircleButton: {
//     backgroundColor: 'rgba(26, 37, 48, 0.85)',
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   activeCircleButton: {
//     backgroundColor: '#FFFFFF',
//   },
//   cameraBottomRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   capsuleButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(26, 37, 48, 0.85)',
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//   },
//   capsuleText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   zoomText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   frameOverlay: {
//     position: 'absolute',
//     top: '25%',
//     bottom: '25%',
//     left: '12%',
//     right: '12%',
//     zIndex: 5,
//   },
//   corner: {
//     position: 'absolute',
//     width: 28,
//     height: 28,
//     borderColor: '#FFFFFF',
//   },
//   topLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 14 },
//   topRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 14 },
//   bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 14 },
//   bottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 14 },
//   guidanceBanner: {
//     backgroundColor: '#EBF6F5',
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 12,
//     padding: 14,
//   },
//   guidanceTitle: {
//     color: '#005F59',
//     fontWeight: '700',
//     fontSize: 13,
//     marginBottom: 4,
//   },
//   guidanceText: {
//     color: '#2C4A47',
//     fontSize: 12,
//     lineHeight: 16,
//   },
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'flex-end',
//     paddingVertical: 16,
//     paddingHorizontal: 8,
//   },
//   actionButton: {
//     alignItems: 'center',
//     width: 80,
//   },
//   actionIconContainer: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#F3F6F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   actionLabel: {
//     fontSize: 11,
//     color: '#677482',
//     fontWeight: '500',
//   },
//   activeLabel: {
//     color: '#005F59',
//     fontWeight: '700',
//     marginTop: 6,
//   },
//   shutterButtonOuter: {
//     alignItems: 'center',
//   },
//   shutterButtonInner: {
//     width: 68,
//     height: 68,
//     borderRadius: 34,
//     borderWidth: 4,
//     borderColor: '#005F59',
//     backgroundColor: '#007A72',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: '#EEF2F4',
//     paddingVertical: 10,
//     backgroundColor: '#FFFFFF',
//   },
//   navItem: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   activeNavIndicator: {
//     backgroundColor: '#E2F2F0',
//     paddingHorizontal: 18,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginBottom: 4,
//   },
//   inactiveNavIcon: {
//     marginBottom: 8,
//     opacity: 0.6,
//   },
//   navLabel: {
//     fontSize: 11,
//     color: '#7C8B9A',
//   },
//   activeNavLabel: {
//     color: '#005F59',
//     fontWeight: '700',
//   },
// });