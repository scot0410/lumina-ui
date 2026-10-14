import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function ProfileScreen() {
  // Toggle this true/false to switch between Guest and Logged-In tracking views
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hardcoded mock values matching the 2026 Figma screen layout exactly
  const trackingData = {
    name: 'Jamie',
    weeks: '33 weeks',
    daysDetails: '0 days · Third trimester',
    weeksToGo: '7 weeks to go',
    dateLabel: 'As of Oct 12, 2026',
    dueDate: 'Due Nov 30, 2026',
    sizeComparison: 'A cantaloupe!',
    sizeSubtext: 'A tiny human. A very full fruit bowl.',
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER MATRIX SECTION */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your profile</Text>
        <Text style={styles.headerSubtitle}>
          {isLoggedIn ? 'Your journey, one week at a time.' : 'A space for you, if you\'d like one.'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* =========================================================================
           VIEW VARIANT A: GUEST / UNAUTHENTICATED PROFILE SCREEN
           ========================================================================= */}
        {!isLoggedIn ? (
          <View>
            {/* Main Callout Hero Container */}
            <View style={styles.heroCard}>
              <View style={styles.heroHeaderRow}>
                <View style={styles.plantIconCircle}>
                  <Ionicons name="leaf-outline" size={18} color="#005F59" />
                </View>
                <View style={styles.optionalBadge}>
                  <Text style={styles.optionalBadgeText}>OPTIONAL</Text>
                </View>
              </View>

              <Text style={styles.heroTitle}>A little place for your pregnancy journey</Text>
              <Text style={styles.heroDescription}>
                Sign in to add your due date and keep your pregnancy tracker in one place.
              </Text>

              {/* Bullet Lists Items */}
              <View style={styles.bulletItemRow}>
                <Ionicons name="calendar-outline" size={20} color="#005F59" style={styles.bulletIcon} />
                <View style={styles.bulletTextContainer}>
                  <Text style={styles.bulletTitle}>Follow your week</Text>
                  <Text style={styles.bulletSubtitle}>Your week, trimester and due-date countdown.</Text>
                </View>
              </View>

              <View style={styles.bulletItemRow}>
                <MaterialCommunityIcons name="sparkles-outline" size={20} color="#005F59" style={styles.bulletIcon} />
                <View style={styles.bulletTextContainer}>
                  <Text style={styles.bulletTitle}>Make room for a little silly</Text>
                  <Text style={styles.bulletSubtitle}>Spin for a playful baby-size comparison.</Text>
                </View>
              </View>

              {/* Authorization Button Group */}
              <TouchableOpacity style={styles.primaryAuthButton} onPress={() => setIsLoggedIn(true)}>
                <Text style={styles.primaryAuthButtonText}>Sign in or create an account</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.ghostAuthButton}>
                <Text style={styles.ghostAuthButtonText}>Continue as guest</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Alert Status Welcome Card */}
            <View style={styles.welcomeBannerCard}>
              <View style={styles.welcomeHeaderRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#005F59" style={styles.welcomeIcon} />
                <Text style={styles.welcomeTitle}>No account? You're still welcome.</Text>
              </View>
              <Text style={styles.welcomeText}>
                Product scans and recalls & outbreaks checks stay available. Tracking is always your choice.
              </Text>
            </View>
          </View>
        ) : (
          
          /* =========================================================================
             VIEW VARIANT B: LOGGED IN PREGNANCY TRACKER VIEW
             ========================================================================= */
          <View>
            {/* Account Info Pill */}
            <View style={styles.accountCardRow}>
              <View style={styles.avatarCircle}><Text style={styles.avatarInitial}>J</Text></View>
              <View style={styles.accountTextContainer}>
                <Text style={styles.accountName}>Hi, {trackingData.name}</Text>
                <Text style={styles.accountSubtext}>Demo account · sample tracking data</Text>
              </View>
              <Ionicons name="options-outline" size={20} color="#677482" />
            </View>

            {/* Timeline Matrix Metrics Card */}
            <View style={styles.trackerMetricCard}>
              <View style={styles.metricGridRow}>
                <View>
                  <Text style={styles.metricPrimaryText}>{trackingData.weeks}</Text>
                  <Text style={styles.metricSecondaryText}>{trackingData.daysDetails}</Text>
                </View>
                <View style={styles.metricRightAlign}>
                  <Text style={styles.metricHighlightText}>{trackingData.weeksToGo}</Text>
                  <Text style={styles.metricSecondaryText}>{trackingData.dateLabel}</Text>
                </View>
              </View>

              {/* Progress Slider Track Line */}
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: '80%' }]} />
              </View>

              <View style={styles.metricFooterRow}>
                <Text style={styles.dueDateText}>{trackingData.dueDate}</Text>
                <TouchableOpacity><Text style={styles.editDateLink}>Edit due date</Text></TouchableOpacity>
              </View>
            </View>

            {/* Size Comparison Core Feature Container */}
            <View style={styles.sizeComparisonCard}>
              <View style={styles.sizeCardHeader}>
                <Text style={styles.sizeCardTitle}>Your baby is the size of...</Text>
                <MaterialCommunityIcons name="sparkles-outline" size={18} color="#C2410C" />
              </View>

              {/* Center Fruit Visual Illustration Mock */}
              <View style={styles.illustrationMainSpace}>
                <Text style={styles.sideLabelLeft}>Honeydew</Text>
                
                {/* Visual Anchor Circle Mimicking the Cantaloupe */}
                <View style={styles.fruitCircleGraphic}>
                  <FontAwesome5 name="melon" size={44} color="#C2410C" />
                </View>

                <Text style={styles.sideLabelRight}>Small melon</Text>
              </View>

              <Text style={styles.comparisonFruitName}>{trackingData.sizeComparison}</Text>
              <Text style={styles.comparisonSubtext}>{trackingData.sizeSubtext}</Text>

              {/* Interactive Utility Spin Control Button */}
              <TouchableOpacity style={styles.spinButton}>
                <Ionicons name="shuffle" size={18} color="#FFFFFF" style={styles.spinIcon} />
                <Text style={styles.spinButtonText}>Spin for another comparison</Text>
              </TouchableOpacity>

              <Text style={styles.comparisonDisclaimer}>
                New comparison, same week · around week 33{'\n'}
                Approximate and just for fun. Not a medical growth assessment.
              </Text>
            </View>

            {/* Extra Logged-In Configuration Rows */}
            <TouchableOpacity style={styles.menuRowItem}>
              <View style={styles.menuLeftGroup}>
                <Ionicons name="calendar-sharp" size={18} color="#677482" style={styles.menuIcon} />
                <Text style={styles.menuItemLabel}>Pregnancy settings</Text>
              </View>
              <View style={styles.menuRightGroup}>
                <Text style={styles.menuValueText}>Tracking on</Text>
                <Ionicons name="chevron-forward" size={16} color="#CFD6DC" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* =========================================================================
           SHARED CONFIGURATION OVERLAY NAVIGATION LISTS
           ========================================================================= */}
        <TouchableOpacity style={styles.menuRowItem}>
          <View style={styles.menuLeftGroup}>
            <Ionicons name="lock-closed-outline" size={18} color="#677482" style={styles.menuIcon} />
            <Text style={styles.menuItemLabel}>Privacy & data</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#CFD6DC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRowItem}>
          <View style={styles.menuLeftGroup}>
            <Ionicons name="help-circle-outline" size={18} color="#677482" style={styles.menuIcon} />
            <Text style={styles.menuItemLabel}>Help & guidance</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#CFD6DC" />
        </TouchableOpacity>

        {/* Global Exit Intent Interface Button */}
        {isLoggedIn && (
          <TouchableOpacity style={styles.signOutButton} onPress={() => setIsLoggedIn(false)}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#607278',
    marginTop: 4,
    fontWeight: '300',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* =========================================================================
     GUEST VIEW CARD STYLES
     ========================================================================= */
  heroCard: {
    backgroundColor: '#F4F6F8',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  plantIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionalBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CFD6DC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  optionalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#005F59',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#182C32',
    lineHeight: 28,
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    color: '#607278',
    lineHeight: 20,
    marginBottom: 20,
  },
  bulletItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  bulletIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  bulletTextContainer: {
    flex: 1,
  },
  bulletTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#182C32',
  },
  bulletSubtitle: {
    fontSize: 13,
    color: '#607278',
    marginTop: 1,
  },
  primaryAuthButton: {
    backgroundColor: '#005F59',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  primaryAuthButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  ghostAuthButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostAuthButtonText: {
    color: '#005F59',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeBannerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECF0F3',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  welcomeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  welcomeIcon: {
    marginRight: 8,
  },
  welcomeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#182C32',
  },
  welcomeText: {
    fontSize: 13,
    color: '#607278',
    lineHeight: 18,
  },

  /* =========================================================================
     TRACKING ACTIVE VIEW STYLES
     ========================================================================= */
  accountCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: '#005F59',
    fontWeight: '700',
    fontSize: 16,
  },
  accountTextContainer: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#182C32',
  },
  accountSubtext: {
    fontSize: 12,
    color: '#677482',
    marginTop: 1,
  },
  trackerMetricCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECF0F3',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  metricGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricPrimaryText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#182C32',
  },
  metricSecondaryText: {
    fontSize: 12,
    color: '#677482',
    marginTop: 3,
  },
  metricRightAlign: {
    alignItems: 'flex-end',
  },
  metricHighlightText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#005F59',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F4F6F8',
    borderRadius: 3,
    marginVertical: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#005F59',
    borderRadius: 3,
  },
  metricFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: 13,
    color: '#182C32',
    fontWeight: '600',
  },
  editDateLink: {
    fontSize: 13,
    color: '#005F59',
    fontWeight: '700',
  },

  /* FRUIT SIZE GRAPHIC CONTAINER STYLES */
  sizeComparisonCard: {
    backgroundColor: '#FFFDF9', // Pale tint frame to support emphasis color spacing
    borderWidth: 1,
    borderColor: '#FBEEDB',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  sizeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sizeCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#182C32',
  },
  illustrationMainSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  sideLabelLeft: {
    fontSize: 12,
    color: '#C7D1DA',
    fontWeight: '500',
  },
  sideLabelRight: {
    fontSize: 12,
    color: '#C7D1DA',
    fontWeight: '500',
  },
  fruitCircleGraphic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FDF2E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FBEEDB',
  },
  comparisonFruitName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#182C32',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  comparisonSubtext: {
    fontSize: 14,
    color: '#677482',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  spinButton: {
    backgroundColor: '#005F59',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  spinIcon: {
    marginRight: 8,
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  comparisonDisclaimer: {
    fontSize: 11,
    color: '#7C8B9A',
    textAlign: 'center',
    lineHeight: 16,
  },

  /* =========================================================================
     COMMON INTERACTION NAV LIST CONTAINER ROWS
     ========================================================================= */
  menuRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F3',
  },
  menuLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#182C32',
  },
  menuRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValueText: {
    fontSize: 13,
    color: '#677482',
    marginRight: 8,
  },
  signOutButton: {
    marginTop: 32,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 14,
    color: '#005F59',
    fontWeight: '700',
  },
});
