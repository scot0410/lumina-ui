import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { Camera, ShieldCheck, Heart, Lock, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react-native';

export default function DashboardScreen() {
  // State to manage whether the feature list is open
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDropdown = () => {
    // Enables smooth layout spring transitions when the dropdown opens/closes
    if (Platform.OS === 'android') {
      // Ensure LayoutAnimation works on Android if configuring UIManager manually, 
      // or simply rely on standard rerender.
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <Text style={styles.title}>A little clarity, every day</Text>
          <Text style={styles.subtitle}>Everyday checks. A little peace of mind.</Text>
        </View>

        {/* 1. HERO CARD: YOUR JOURNEY WITH DROPDOWN */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroIconContainer}>
              <Heart size={22} color="#007A78" />
            </View>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Your journey, at your pace</Text>
              <Text style={styles.heroSubtitle}>Completely optional</Text>
            </View>
          </View>
          
          <Text style={styles.heroDescription}>
            Sign in to unlock personalized milestones and pregnancy guidance tailored to your stage.
          </Text>

          {/* DROPDOWN TOGGLE HEADER */}
          <TouchableOpacity 
            style={styles.dropdownHeader} 
            onPress={toggleDropdown}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownHeaderText}>See what's included</Text>
            {isExpanded ? (
              <ChevronUp size={16} color="#007A78" />
            ) : (
              <ChevronDown size={16} color="#007A78" />
            )}
          </TouchableOpacity>

          {/* EXPANDABLE BULLET LIST */}
          {isExpanded && (
            <View style={styles.featurePreviewList}>
              <View style={styles.featureItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.featureText}>Week-by-week baby growth & progress tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.featureText}>Milestone expectations (like your 20-week anatomy scan)</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.featureText}>Upcoming appointment markers & daily health tips</Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.9}>
            <Text style={styles.primaryActionText}>Explore your profile</Text>
          </TouchableOpacity>
        </View>

        {/* 2. PRODUCT CHECK CARD */}
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleCluster}>
              <Camera size={20} color="#007A78" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Check a product</Text>
            </View>
            <ChevronRight size={18} color="#007A78" />
          </View>
          
          <Text style={styles.cardDescription}>
            Take a quick photo of any product label to instantly look up its ingredient safety.
          </Text>
          
          <Text style={styles.actionText}>Open camera tool</Text>
        </TouchableOpacity>

        {/* 3. RECALLS CARD */}
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleCluster}>
              <ShieldCheck size={20} color="#007A78" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Recalls & outbreaks</Text>
            </View>
            <ChevronRight size={18} color="#007A78" />
          </View>
          
          <Text style={styles.cardDescription}>
            Stay informed with the latest local safety notices and product recalls near you.
          </Text>
          
          <Text style={styles.actionText}>Check safety alerts</Text>
        </TouchableOpacity>

        {/* ANONYMOUS FOOTER TEXT */}
        <View style={styles.anonymousContainer}>
          <Lock size={14} color="#6A8084" style={styles.lockIcon} />
          <Text style={styles.anonymousText}>Scan and check alerts without an account.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0D2329',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#55666A',
  },
  heroCard: {
    backgroundColor: '#EBF4F3',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DCECEB',
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCE2E0',
  },
  heroTextContainer: {
    marginLeft: 14,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D2329',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#55666A',
    marginTop: 1,
  },
  heroDescription: {
    fontSize: 14,
    color: '#1A3338',
    lineHeight: 20,
  },
  // NEW DROPDOWN STYLES
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  dropdownHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007A78',
    marginRight: 6,
  },
  featurePreviewList: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007A78',
    marginTop: 6,
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: '#334E52',
    lineHeight: 18,
  },
  primaryActionButton: {
    backgroundColor: '#007A78',
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  // STANDARD WHITE CARDS
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E6ECEB',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitleCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D2329',
  },
  cardDescription: {
    fontSize: 14,
    color: '#55666A',
    lineHeight: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007A78',
    marginTop: 12,
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  lockIcon: {
    marginRight: 6,
  },
  anonymousText: {
    fontSize: 13,
    color: '#6A8084',
  },
});
