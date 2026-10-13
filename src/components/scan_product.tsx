import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Flashlight, Scan, Search, RotateCw, Image, ShieldCheck, Bookmark } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ScanProductScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'back' | 'front'>('back');
    const [enableTorch, setEnableTorch] = useState<boolean>(false);

    // Handle Loading Permissions
    if (!permission) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#005F59" />
            </View>
        );
    }

    // Handle Missing Permissions Block
    if (!permission.granted) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Toggle Camera Facing Matrix
    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    // Toggle Flash/Torch
    function toggleTorch() {
        setEnableTorch(current => !current);
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* 1. HEADER SECTION */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Scan a product</Text>
                <Text style={styles.headerSubtitle}>A little clarity for your everyday choices.</Text>
            </View>

            {/* 2. LIVE CAMERA VIEWFINDER */}
            <View style={styles.viewfinderContainer}>
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing={facing}
                    enableTorch={enableTorch}
                />

                {/* CONTROLS OVERLAY - Positioned absolute over the CameraView stream */}
                <View style={styles.cameraOverlayContainer} pointerEvents="box-none">

                    {/* Top Row: Info Banner & Flash Toggle */}
                    <View style={styles.cameraTopRow} pointerEvents="box-none">
                        <View style={styles.instructionBanner}>
                            <Text style={styles.bannerTitle}>Frame the product label</Text>
                            <Text style={styles.bannerSubtitle}>Keep the name and ingredients readable.</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.iconCircleButton, enableTorch && styles.activeFlashButton]}
                            onPress={toggleTorch}
                        >
                            <Flashlight color={enableTorch ? "#005F59" : "#FFFFFF"} size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* FIGMA FRAMING TARGET CORNERS */}
                    <View style={styles.frameOverlay} pointerEvents="none">
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    {/* Bottom Row: Camera Utilities */}
                    <View style={styles.cameraBottomRow} pointerEvents="box-none">
                        <TouchableOpacity style={styles.capsuleButton} activeOpacity={0.7}>
                            <Search color="#FFFFFF" size={16} />
                            <Text style={styles.capsuleText}>Tap to focus</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.iconCircleButton, { width: 44, height: 44 }]}>
                            <Text style={styles.zoomText}>1x</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* 3. HEALTH & GUIDANCE WARNING BOX */}
            <View style={styles.guidanceBanner}>
                <Text style={styles.guidanceTitle}>Pregnancy guidance + separate recall check</Text>
                <Text style={styles.guidanceText}>
                    Ingredient & preparation guidance, then recall information. A photo can't confirm safety.
                </Text>
            </View>

            {/* 4. ACTION CONTROLS FOOTER */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <View style={styles.actionIconContainer}>
                        <Image color="#005F59" size={24} />
                    </View>
                    <Text style={styles.actionLabel}>Upload photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shutterButtonOuter} activeOpacity={0.8}>
                    <View style={styles.shutterButtonInner}>
                        <Scan color="#FFFFFF" size={28} />
                    </View>
                    <Text style={[styles.actionLabel, styles.activeLabel]}>Take photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={toggleCameraFacing} activeOpacity={0.7}>
                    <View style={styles.actionIconContainer}>
                        <RotateCw color="#005F59" size={24} />
                    </View>
                    <Text style={styles.actionLabel}>Flip camera</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 24,
    },
    permissionText: {
        fontSize: 16,
        color: '#677482',
        textAlign: 'center',
        marginBottom: 20,
    },
    permissionButton: {
        backgroundColor: '#005F59',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
    // Header Elements
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1A2530',
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#677482',
        fontWeight: '400',
    },
    // Viewfinder Bounds
    viewfinderContainer: {
        flex: 1,
        marginHorizontal: 16,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000',
    },
    cameraOverlayContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'space-between',
        padding: 16,
    },
    cameraTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 4,
    },
    instructionBanner: {
        backgroundColor: 'rgba(26, 37, 48, 0.85)',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 16,
        maxWidth: width * 0.70,
    },
    bannerTitle: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
        marginBottom: 3,
    },
    bannerSubtitle: {
        color: '#CFD6DC',
        fontSize: 12,
    },
    iconCircleButton: {
        backgroundColor: 'rgba(26, 37, 48, 0.85)',
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeFlashButton: {
        backgroundColor: '#FFFFFF',
    },
    cameraBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    capsuleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(26, 37, 48, 0.85)',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    capsuleText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    zoomText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    // Targeting Overlay System
    frameOverlay: {
        position: 'absolute',
        top: '15%',
        left: '10%',
        right: '10%',
        height: '65%',
        borderWidth: 0,
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#FFFFFF',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderLeftWidth: 3,
        borderTopWidth: 3,
        borderTopLeftRadius: 16,
    },
    topRight: {
        top: 0,
        right: 0,
        borderRightWidth: 3,
        borderTopWidth: 3,
        borderTopRightRadius: 16,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderLeftWidth: 3,
        borderBottomWidth: 3,
        borderBottomLeftRadius: 16,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderRightWidth: 3,
        borderBottomWidth: 3,
        borderBottomRightRadius: 16,
    },
    // Guidance Warning Block
    guidanceBanner: {
        backgroundColor: '#E8F5F3',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
    },
    guidanceTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#005F59',
        marginBottom: 4,
    },
    guidanceText: {
        fontSize: 13,
        color: '#2A3C3A',
        lineHeight: 18,
    },
    // Lower Control Bars
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
    },
    actionButton: {
        alignItems: 'center',
        width: 90,
    },
    actionIconContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#F4F6F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    actionLabel: {
        fontSize: 12,
        color: '#677482',
        fontWeight: '500',
    },
    activeLabel: {
        color: '#005F59',
        fontWeight: '700',
        marginTop: 4,
    },
    shutterButtonOuter: {
        alignItems: 'center',
        transform: [{ translateY: -6 }],
    },
    shutterButtonInner: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#005F59',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    // Bottom Tab Navigation Items
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#ECF0F3',
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
    },
    navItem: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    activeNavIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    inactiveNavIcon: {
        marginBottom: 4,
    },
    navLabel: {
        fontSize: 11,
        color: '#7C8B9A',
        fontWeight: '500',
    },
    activeNavLabel: {
        color: '#005F59',
        fontWeight: '700',
    },
});