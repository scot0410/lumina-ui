import { CameraView, useCameraPermissions } from 'expo-camera';
import { Flashlight, Image, RotateCw, Scan, Search } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ProcessingModal } from './scan_processing';
import { ProductResult } from '@/types';
import ProductCheckScreen from './product_check';
const { width } = Dimensions.get('window');

const mockDataSuite: Record<string, ProductResult> = {
    suitable: {
        status: 'suitable',
        productName: 'Plain yogurt',
        matchConfidence: 'Possible match · confirm the label',
        guidanceTitle: 'Generally suitable',
        guidanceSubtitle: 'If made with pasteurized milk and stored properly.',
        guidanceBody: 'Pasteurization reduces harmful bacteria. Plain yogurt can provide calcium and protein.',
        checklistItems: [
            'Confirm "pasteurized" on the label.',
            'Keep refrigerated at 40°F / 4°C or below.',
            'Check the use-by date and intact seal.'
        ] as any, // type assertion for string arrays
        recallStatus: 'No matching recall in sample records',
        recallDetails: 'Not a recall clearance. Verify the brand, lot and use-by date against current FDA notices.',
        guidanceSource: 'Guidance: CDC / FDA · dairy & pregnancy'
    },
    avoid: {
        status: 'avoid',
        productName: 'Unpasteurized milk',
        matchConfidence: 'Possible match · confirm the label',
        guidanceTitle: 'Avoid in pregnancy',
        guidanceSubtitle: 'If the label confirms raw or unpasteurized milk, don\'t drink it.',
        guidanceBody: 'Raw milk can carry Listeria and germs. These infections can cause serious harm during pregnancy.\n\nPasteurization unclear? Choose a clearly labeled pasteurized option instead.',
        alternatives: [
            { icon: 'water-outline', title: 'Pasteurized milk', description: 'A direct swap for drinking or cooking.' },
            { icon: 'ice-cream-outline', title: 'Pasteurized plain yogurt', description: 'An option for a calcium-rich snack.' }
        ] as any,
        recallStatus: 'No matching recall in sample records',
        recallDetails: 'Not a recall clearance. Verify the brand, lot and use-by date against current FDA notices.',
        guidanceSource: 'Guidance: CDC / FDA · raw milk & pregnancy'
    }
};

export default function ScanProductScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'back' | 'front'>('back');
    const [enableTorch, setEnableTorch] = useState<boolean>(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [backendResult, setBackendResult] = useState<ProductResult | null>(null);
    const [currentScreen, setCurrentScreen] = useState<'camera' | 'results'>('camera');


    const cameraRef = useRef<any>(null);

    // 🛠️ TOAST CONTROLLER STATE
    const [showInstructions, setShowInstructions] = useState(true);
    const fadeAnim = React.useRef(new Animated.Value(1)).current;

    // Trigger toast countdown on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400, // Smooth fade duration
                useNativeDriver: true,
            }).start(() => {
                setShowInstructions(false);
            });
        }, 3000); // 👈 Disappears completely after 3 seconds

        return () => clearTimeout(timer);
    }, []);

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

    const handleTakePhoto = async () => {
        if (cameraRef.current) {
            try {
                setIsProcessing(true)
                const options = { quality: 0.8, skipProcessing: false, shutterSound: false };
                const photo = await cameraRef.current.takePictureAsync(options);
                setPhotoUri(photo.uri);
                console.log("Captured cached file location:", photo.uri);

                // 2. MOCK BACKEND RETRIEVAL TRANSITION
                // This simulates a 5-second network round-trip delay to your Python server
                setTimeout(() => {
                    // Alternates results between 'suitable' and 'avoid' for dynamic screen testing
                    const outcomeSeed = 'avoid'//Math.random() > 0.5 ? 'suitable' : 'avoid';
                    const payload = mockDataSuite[outcomeSeed];

                    setBackendResult(payload);  // Assign JSON payload to state
                    setIsProcessing(false);      // 3. Clear modal out of view hierarchy
                    setCurrentScreen('results'); // 4. AUTOMATIC ROUTE ROUTING TRANSITION
                }, 5000);
            } catch (error: any) {
                setIsProcessing(false)
            }
        } else {
            setIsProcessing(false)
        }
    };

    const handleCancel = () => {
        setIsProcessing(false);
        // Add logic here to abort the backend fetch request if needed
    };

    const handleCancelPipeline = () => {
        setIsProcessing(false);
        // In production, instantiate an AbortController to disconnect your active fetch stream
    };

    const handleResetWorkflow = () => {
        setBackendResult(null);
        setCurrentScreen('camera'); // Returns cleanly to viewfinder view state
    };

    if (currentScreen === 'results' && backendResult) {
        return (
            <ProductCheckScreen
                resultData={backendResult}
                onBackToCamera={handleResetWorkflow}
            />
        );
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
                    ref={cameraRef}
                    animateShutter={false}
                />

                {/* CONTROLS OVERLAY - Positioned absolute over the CameraView stream */}
                <View style={styles.cameraOverlayContainer} pointerEvents="box-none">

                    {/* Top Row: Info Banner & Flash Toggle */}
                    <View style={styles.cameraTopRow} pointerEvents="box-none">
                        {/* 🛠️ TOAST OVERLAY LAYER */}
                        {showInstructions && (
                            <Animated.View style={[
                                styles.instructionBanner, 
                                { opacity: fadeAnim }]}>
                                <Text style={styles.bannerTitle}>Frame the product label</Text>
                                <Text style={styles.bannerSubtitle}>Keep the text readable.</Text>
                            </Animated.View>
                        )}
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
                        {showInstructions && (
                            <Animated.View style={[styles.capsuleButton, { opacity: fadeAnim }]}>
                                <Search color="#FFFFFF" size={16} />
                                <Text style={styles.capsuleText}>Tap to focus</Text>
                            </Animated.View>
                        )}

                        <TouchableOpacity style={[styles.iconCircleButton, { width: 40, height: 40 }]}>
                            <Text style={styles.zoomText}>1x</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* 3. HEALTH & GUIDANCE WARNING BOX */}
            <View style={styles.guidanceBanner}>
                <Text style={styles.guidanceTitle}>Pregnancy Guidance & Recall Check</Text>
                <Text style={styles.guidanceText}>
                    Always verify labels independently. A photo cannot confirm absolute safety.
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

                <TouchableOpacity style={styles.shutterButtonOuter} activeOpacity={0.8} onPress={handleTakePhoto}>
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
            <ProcessingModal
                visible={isProcessing}
                onCancel={handleCancel}
            />
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
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 27,
        fontWeight: '700',
        color: '#182C32',
        fontFamily: 'Inter-Bold', // Ensure your custom font asset is bundled
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#607278',
        marginTop: 4,
        fontWeight: '300'
    },
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
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    cameraBottomRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 12,
        marginBottom: 3,
    },
    bannerSubtitle: {
        color: '#CFD6DC',
        fontSize: 12,
    },
    iconCircleButton: {
        backgroundColor: 'rgba(26, 37, 48, 0.85)',
        width: 40,
        height: 40,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeFlashButton: {
        backgroundColor: '#FFFFFF',
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
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 8,
    },
    zoomText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    frameOverlay: {
        position: 'absolute',
        top: '20%',
        left: '15%',
        right: '15%',
        height: '71%',
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
        fontSize: 12,
        fontWeight: '700',
        color: '#005F59',
        marginBottom: 4,
    },
    guidanceText: {
        fontSize: 12,
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
        zIndex: 10, // 👈 CRITICAL: Brings the button taps over absolute camera layouts
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

    /* =========================================================================
       🆕 ADDITIONS FOR PRODUCT CHECK RESULTS DISPLAY (Figma Adaptation)
       ========================================================================= */
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 130, // Allows clean scroll past the absolute bottom action bar
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButtonText: {
        fontSize: 14,
        color: '#005F59',
        fontWeight: '600',
        marginLeft: 6,
    },
    screenTitle: {
        fontSize: 27,
        fontWeight: '700',
        color: '#182C32',
        marginBottom: 16,
    },
    demoBanner: {
        flexDirection: 'row',
        backgroundColor: '#F4F6F8',
        borderRadius: 14,
        padding: 14,
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    demoIcon: {
        marginTop: 2,
        marginRight: 10,
    },
    demoTextContainer: {
        flex: 1,
    },
    demoTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#182C32',
    },
    demoSubtitle: {
        fontSize: 12,
        color: '#677482',
        marginTop: 2,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    imagePlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 14,
        backgroundColor: '#F4F6F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    productTextDetails: {
        flex: 1,
    },
    photoTag: {
        fontSize: 11,
        fontWeight: '700',
        color: '#677482',
        letterSpacing: 0.5,
    },
    productName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#182C32',
        marginTop: 2,
    },
    matchText: {
        fontSize: 13,
        color: '#677482',
        marginTop: 2,
    },
    guidanceCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    guidanceHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    guidanceIcon: {
        marginRight: 8,
    },
    guidanceTag: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    guidanceTitleText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#182C32',
        lineHeight: 28,
        marginBottom: 12,
    },
    guidanceBodyText: {
        fontSize: 14,
        color: '#2A3C3A',
        lineHeight: 22,
    },
    checklistContainer: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 95, 89, 0.1)',
        paddingTop: 16,
    },
    checklistHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: '#182C32',
        marginBottom: 10,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    checkMarkIcon: {
        marginRight: 8,
    },
    checkText: {
        fontSize: 14,
        color: '#2A3C3A',
    },
    alternativesCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ECF0F3',
    },
    alternativeHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    alternativeTitleMain: {
        fontSize: 16,
        fontWeight: '700',
        color: '#182C32',
        marginLeft: 8,
    },
    altItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    altIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#E8F5F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    altTextContainer: {
        flex: 1,
    },
    altItemTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#182C32',
    },
    altItemDescription: {
        fontSize: 13,
        color: '#677482',
        marginTop: 2,
    },
    altFooterNotice: {
        fontSize: 13,
        color: '#677482',
        lineHeight: 18,
        marginTop: 14,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#F4F6F8',
    },
    recallCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ECF0F3',
    },
    recallHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    recallIcon: {
        marginRight: 8,
    },
    recallTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#182C32',
    },
    recallDemoTag: {
        fontSize: 10,
        fontWeight: '700',
        color: '#677482',
        backgroundColor: '#F4F6F8',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
        letterSpacing: 0.5,
    },
    recallStatusText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#182C32',
        marginBottom: 6,
    },
    recallDescriptionText: {
        fontSize: 13,
        color: '#677482',
        lineHeight: 18,
        marginBottom: 14,
    },
    externalLinkRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
        color: '#005F59',
        fontWeight: '700',
    },
    linkIcon: {
        marginLeft: 6,
    },
    metaFooterContainer: {
        marginTop: 8,
        paddingHorizontal: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metaIcon: {
        marginRight: 6,
    },
    metaText: {
        fontSize: 12,
        color: '#677482',
    },
    disclaimerTextBlock: {
        fontSize: 12,
        color: '#7C8B9A',
        lineHeight: 18,
    },
    actionFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingTop: 12,
        paddingBottom: 36, // Safe area buffer allocation for device home bars
        paddingHorizontal: 24,
        borderTopWidth: 1,
        borderTopColor: '#ECF0F3',
    },
    scanButton: {
        backgroundColor: '#005F59',
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButtonIcon: {
        marginRight: 8,
    },
    scanButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});