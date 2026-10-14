import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScanLine } from 'lucide-react-native';

interface ProcessingModalProps {
    visible: boolean;
    onCancel: () => void;
}

export function ProcessingModal({ visible, onCancel }: ProcessingModalProps) {
    // Track which stage we are on (0 = starting, 1 = scan done, 2 = health done, 3 = all done)
    const [currentStep, setCurrentStep] = useState(0);

    // Run mock processing steps when the modal becomes visible
    useEffect(() => {
        if (!visible) {
            setCurrentStep(0); // Reset when hidden
            return;
        }

        const timer1 = setTimeout(() => setCurrentStep(1), 1500); // Step 1 finishes at 1.5s
        const timer2 = setTimeout(() => setCurrentStep(2), 3200); // Step 2 finishes at 3.2s
        const timer3 = setTimeout(() => setCurrentStep(3), 5000); // Step 3 finishes at 5.0s

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [visible]);

    // Helper function to figure out which icon to show for a line item
    const renderItemIcon = (stepNumber: number, defaultIcon: any, completedIcon: any) => {
        const isCompleted = currentStep >= stepNumber;
        return (
            <Ionicons
                name={isCompleted ? completedIcon : defaultIcon}
                size={22}
                color={isCompleted ? "#005F59" : "#9CA3AF"} // Primary green if done, gray if pending
                style={styles.listIcon}
            />
        );
    };

    const renderItemLucideIcon = (stepNumber: number) => {
        const isCompleted = currentStep >= stepNumber;
        return (
            <ScanLine
                fill={isCompleted ? "#005F59" : "transparent"}
                size={22}
                color={isCompleted ? "#005F59" : "#9CA3AF"} // Primary green if done, gray if pending
                strokeWidth={1.5}
                style={styles.listIcon}
            />
        );
    };

    // Helper function to dim text for items that haven't started yet
    const getItemOpacity = (stepNumber: number) => {
        // Current step or completed steps are fully visible; future steps are slightly faded
        return currentStep >= stepNumber - 1 ? 1 : 0.4;
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlayContainer}>
                <View style={styles.modalCard}>

                    {/* Header Area with persistent main spinner */}
                    <View style={styles.headerRow}>
                        {currentStep < 3 ? (
                            <ActivityIndicator size="large" color="#005F59" style={styles.spinner} />
                        ) : (
                            // Show a big checkmark when everything is completely finished!
                            <Ionicons name="checkmark-circle" size={36} color="#005F59" style={styles.spinner} />
                        )}
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.modalTitle}>
                                {currentStep === 3 ? "Analysis complete!" : "Checking your photo"}
                            </Text>
                            <Text style={styles.modalSubtitle}>
                                {currentStep === 0 && "Reading your image data..."}
                                {currentStep === 1 && "Analyzing ingredient safety..."}
                                {currentStep === 2 && "Checking health matching matrix..."}
                                {currentStep === 3 && "Ready to view your results."}
                            </Text>
                        </View>
                    </View>


                    {/* Status Item 1: Scan */}
                    <View style={[styles.listItem, { opacity: getItemOpacity(1) }]}>
                        {renderItemLucideIcon(1)}
                        <View>
                            <Text style={[styles.itemTitle, currentStep >= 1 && styles.completedText]}>
                                Identifying product & label
                            </Text>
                            <Text style={styles.itemDescription}>Reading the name and ingredients.</Text>
                        </View>
                    </View>

                    {/* Status Item 2: Pregnancy Health Check */}
                    <View style={[styles.listItem, { opacity: getItemOpacity(2) }]}>
                        {renderItemIcon(2, "heart-outline", "heart-sharp")}
                        <View>
                            <Text style={[styles.itemTitle, currentStep >= 2 && styles.completedText]}>
                                Pregnancy guidance
                            </Text>
                            <Text style={styles.itemDescription}>Ingredient & preparation information.</Text>
                        </View>
                    </View>

                    {/* Status Item 3: Recall Check */}
                    <View style={[styles.listItem, { opacity: getItemOpacity(3) }]}>
                        {renderItemIcon(3, "shield-checkmark-outline", "shield-checkmark-sharp")}
                        <View>
                            <Text style={[styles.itemTitle, currentStep >= 3 && styles.completedText]}>
                                Separate recall check
                            </Text>
                            <Text style={styles.itemDescription}>Searching published recall records.</Text>
                        </View>
                    </View>

                    {/* Disclaimer Text */}
                    <Text style={styles.disclaimerText}>
                        A photo can't confirm safety or contamination. You may need to confirm the label and lot.
                    </Text>

                    {/* Action Button */}
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <Text style={styles.cancelButtonText}>
                            {currentStep === 3 ? "View Results" : "Cancel · Back to camera"}
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    modalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 28,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    spinner: {
        marginRight: 16,
        width: 36, // Keeps alignment matching text layout rows perfectly
    },
    headerTextContainer: {
        flex: 1,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: -0.3,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 10,
        paddingRight: 10,
    },
    listIcon: {
        marginRight: 14,
        marginTop: 2,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    completedText: {
        color: '#005F59', // Turns headings green upon completion stage
    },
    itemDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 1,
    },
    disclaimerText: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        marginTop: 16,
        marginBottom: 20,
    },
    cancelButton: {
        backgroundColor: '#E8F5F1',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#005F59',
    },
});
