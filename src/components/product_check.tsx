import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { ProductResult } from '@/types';

// Mock data representing the "Avoid" state from your Figma layout
const mockAvoidData: ProductResult = {
  status: 'avoid',
  productName: 'Unpasteurized milk',
  matchConfidence: 'Possible match · confirm the label',
  guidanceTitle: 'Avoid in pregnancy',
  guidanceSubtitle: 'If the label confirms raw or unpasteurized milk, don\'t drink it.',
  guidanceBody: 'Raw milk can carry Listeria and other germs. These infections can cause serious harm during pregnancy.\n\nPasteurization unclear? Choose a clearly labeled pasteurized option instead.',
  alternatives: [
    { icon: 'water-outline', title: 'Pasteurized milk', description: 'A direct swap for drinking or cooking.' },
    { icon: 'ice-cream-outline', title: 'Pasteurized plain yogurt', description: 'An option for a calcium-rich snack.' }
  ],
  recallStatus: 'No matching recall in sample records',
  recallDetails: 'Not a recall clearance. Verify the brand, lot and use-by date against current FDA notices.',
  guidanceSource: 'Guidance: CDC / FDA · raw milk & pregnancy'
};

interface ProductCheckScreenProps {
  resultData?: ProductResult; // Pass data from backend down here
  onBackToCamera: () => void;
}

export default function ProductCheckScreen({ resultData = mockAvoidData, onBackToCamera }: ProductCheckScreenProps) {
  const isSuitable = resultData.status === 'suitable';

  // Dynamic color matrix based on health status rules
  const theme = {
    cardBg: isSuitable ? '#EAF6F3' : '#FDF2F2',
    accentText: isSuitable ? '#0D6857' : '#9B1C1C',
    iconColor: isSuitable ? '#0D6857' : '#C2410C',
    badgeIcon: isSuitable ? 'shield-checkmark-outline' : 'warning-outline' as any
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Scrollable Layout Container */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Action Row */}
        <TouchableOpacity style={styles.backButton} onPress={onBackToCamera}>
          <Ionicons name="chevron-back" size={18} color="#0D6857" />
          <Text style={styles.backButtonText}>Back to camera</Text>
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Product check</Text>

        {/* 1. DEMO/SAMPLE NOTICE BANNER */}
        <View style={styles.demoBanner}>
          <Feather name="info" size={16} color="#6B7280" style={styles.demoIcon} />
          <View style={styles.demoTextContainer}>
            <Text style={styles.demoTitle}>Demo / sample result</Text>
            <Text style={styles.demoSubtitle}>Illustrative check, not a live safety determination.</Text>
          </View>
        </View>

        {/* 2. MATCHED PRODUCT CARD LAYOUT */}
        <View style={styles.productRow}>
          <View style={styles.imagePlaceholder}>
            {/* Swap out for captured photoUri string if passing local cache files */}
            <Ionicons name="image-outline" size={24} color="#9CA3AF" />
          </View>
          <View style={styles.productTextDetails}>
            <Text style={styles.photoTag}>FROM YOUR PHOTO · SAMPLE</Text>
            <Text style={styles.productName}>{resultData.productName}</Text>
            <Text style={styles.matchText}>{resultData.matchConfidence}</Text>
          </View>
        </View>

        {/* 3. DYNAMIC HEALTH GUIDANCE MATRIX BOX */}
        <View style={[styles.guidanceCard, { backgroundColor: theme.cardBg }]}>
          <View style={styles.guidanceHeaderRow}>
            <Ionicons name={theme.badgeIcon} size={18} color={theme.iconColor} style={styles.guidanceIcon} />
            <Text style={[styles.guidanceTag, { color: theme.accentText }]}>
              {resultData.guidanceTitle.toUpperCase()}
            </Text>
          </View>
          
          <Text style={styles.guidanceTitleText}>{resultData.guidanceSubtitle}</Text>
          <Text style={[styles.guidanceBodyText, !isSuitable && { color: theme.accentText }]}>
            {resultData.guidanceBody}
          </Text>

          {/* Conditional rendering for Suitable Checklists (Green Screen Variant) */}
          {isSuitable && resultData.checklistItems && (
            <View style={styles.checklistContainer}>
              <Text style={styles.checklistHeader}>Before you eat</Text>
              {resultData.checklistItems.map((item, index) => (
                <View key={index} style={styles.checkRow}>
                  <Ionicons name="checkmark" size={16} color="#0D6857" style={styles.checkMarkIcon} />
                  <Text style={styles.checkText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 4. ALTERNATIVES DISCOVERY SECTION (Red Screen Variant) */}
        {!isSuitable && resultData.alternatives && (
          <View style={styles.alternativesCard}>
            <View style={styles.alternativeHeaderRow}>
              <MaterialCommunityIcons name="swap-horizontal" size={20} color="#111827" />
              <Text style={styles.alternativeTitleMain}>Try a pasteurized alternative</Text>
            </View>
            
            {resultData.alternatives.map((alt, index) => (
              <View key={index} style={styles.altItemRow}>
                <View style={styles.altIconContainer}>
                  <Ionicons name={alt.icon as any} size={20} color="#0D6857" />
                </View>
                <View style={styles.altTextContainer}>
                  <Text style={styles.altItemTitle}>{alt.title}</Text>
                  <Text style={styles.altItemDescription}>{alt.description}</Text>
                </View>
              </View>
            ))}
            
            <Text style={styles.altFooterNotice}>
              Look for "pasteurized" on the label. Check storage instructions and the use-by date.
            </Text>
          </View>
        )}

        {/* 5. RECALL LOOKUP STATUS LAYOUT */}
        <View style={styles.recallCard}>
          <View style={styles.recallHeaderRow}>
            <MaterialCommunityIcons name="shield-search" size={20} color="#4B5563" style={styles.recallIcon} />
            <Text style={styles.recallTitle}>Recall status</Text>
            <Text style={styles.recallDemoTag}>DEMO LOOKUP</Text>
          </View>
          <Text style={styles.recallStatusText}>{resultData.recallStatus}</Text>
          <Text style={styles.recallDescriptionText}>{resultData.recallDetails}</Text>
          
          <TouchableOpacity style={styles.externalLinkRow}>
            <Text style={styles.linkText}>Check current recall notices</Text>
            <Feather name="external-link" size={14} color="#0D6857" style={styles.linkIcon} />
          </TouchableOpacity>
        </View>

        {/* 6. BOTTOM COMPLIANCE FOOTER DISCLAIMERS */}
        <View style={styles.metaFooterContainer}>
          <View style={styles.metaRow}>
            <Ionicons name="book-outline" size={14} color="#6B7280" style={styles.metaIcon} />
            <Text style={styles.metaText}>{resultData.guidanceSource}</Text>
          </View>
          <Text style={styles.disclaimerTextBlock}>
            A photo cannot confirm safety or contamination. This is not medical advice; ask your clinician about your pregnancy needs.
          </Text>
        </View>

      </ScrollView>

      {/* FIXED BASE ACTION CONSOLE BUTTON */}
      <View style={styles.actionFooter}>
        <TouchableOpacity style={styles.scanButton} onPress={onBackToCamera}>
          <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={styles.scanButtonIcon} />
          <Text style={styles.scanButtonText}>Scan another product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light structured layout contrast frame
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 120, // Space to scroll clean past fixed absolute footer buttons
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 14,
    color: '#0D6857',
    fontWeight: '500',
    marginLeft: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  demoBanner: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
    marginBottom: 20,
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
    fontWeight: '600',
    color: '#374151',
  },
  demoSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  productTextDetails: {
    flex: 1,
  },
  photoTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  matchText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 1,
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
    marginRight: 6,
  },
  guidanceTag: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  guidanceTitleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 28,
    marginBottom: 10,
  },
  guidanceBodyText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  checklistContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(13, 104, 87, 0.1)',
    paddingTop: 16,
  },
  checklistHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkMarkIcon: {
    marginRight: 8,
  },
  checkText: {
    fontSize: 14,
    color: '#374151',
  },
  alternativesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  alternativeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alternativeTitleMain: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  altItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  altIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E8F5F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  altTextContainer: {
    flex: 1,
  },
  altItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  altItemDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 1,
  },
  altFooterNotice: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  recallCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recallHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recallIcon: {
    marginRight: 6,
  },
  recallTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  recallDemoTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  recallStatusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  recallDescriptionText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 14,
  },
  externalLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#0D6857',
    fontWeight: '600',
  },
  linkIcon: {
    marginLeft: 4,
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
    color: '#6B7280',
  },
  disclaimerTextBlock: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  actionFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 34, // Safe area styling offset padding for home bars
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  scanButton: {
    backgroundColor: '#0D6857',
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
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

