import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { 
  AlertTriangle, 
  MapPin, 
  ShieldCheck, 
  ExternalLink, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react-native';

export interface AlertItem {
  id: string;
  category: string;
  date: string;
  title: string;
  threat: string;
  location: string;
  productDetails: string;
  lotCode: string;
  useBy: string;
  instructions: string;
  source: string;
}

interface CardProps {
  item: AlertItem;
}

export function SafetyAlertCard({ item }: CardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View style={styles.card}>
      {/* SECTION 1: BADGE & DATE */}
      <View style={styles.topMetaRow}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{item.category}</Text>
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      {/* SECTION 2: MAIN TITLE & THREAT INFO */}
      <Text style={styles.mainTitle}>{item.title}</Text>
      
      <View style={styles.threatRow}>
        <AlertTriangle size={16} color="#B25E13" strokeWidth={2.5} />
        <Text style={styles.threatText}>{item.threat}</Text>
      </View>

      <View style={styles.locationRow}>
        <MapPin size={16} color="#718096" strokeWidth={2} />
        <Text style={styles.locationText}>{item.location}</Text>
      </View>

      {/* SECTIONS 3-5: COLLAPSIBLE PANEL */}
      {isExpanded && (
        <View style={styles.collapsibleContent}>
          {/* SECTION 3: PRODUCT SPECIFICS */}
          <View style={styles.detailsBlock}>
            <Text style={styles.sectionHeader}>Affected product</Text>
            <Text style={styles.productDescription}>{item.productDetails}</Text>

            <View style={styles.codeGrid}>
              <View style={styles.codeColumn}>
                <Text style={styles.codeLabel}>Lot code</Text>
                <Text style={styles.codeValue}>{item.lotCode}</Text>
              </View>
              <View style={styles.codeColumn}>
                <Text style={styles.codeLabel}>Use by</Text>
                <Text style={styles.codeValue}>{item.useBy}</Text>
              </View>
            </View>
          </View>

          {/* SECTION 4: CALLOUT BOX */}
          <View style={styles.calloutBox}>
            <View style={styles.calloutHeaderRow}>
              <ShieldCheck size={18} color="#006A60" strokeWidth={2.5} />
              <Text style={styles.calloutHeaderTitle}>What to do</Text>
            </View>
            <Text style={styles.calloutBody}>{item.instructions}</Text>
          </View>

          {/* SECTION 5: FOOTER META */}
          <View style={styles.footerMetaRow}>
            <Text style={styles.sourceText}>Source: {item.source}</Text>
            <TouchableOpacity hitSlop={12} activeOpacity={0.6}>
              <ExternalLink size={16} color="#087F79" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />
        </View>
      )}

      {/* SECTION 6: TOGGLE BUTTON */}
      <TouchableOpacity 
        style={styles.hideDetailsButton} 
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.hideDetailsText}>
          {isExpanded ? 'Hide details' : 'Show details'}
        </Text>
        {isExpanded ? (
          <ChevronUp size={18} color="#006A60" strokeWidth={2.5} />
        ) : (
          <ChevronDown size={18} color="#006A60" strokeWidth={2.5} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    width: '92%',
    alignSelf: 'center',
    marginVertical: 8,
    shadowColor: '#1A202C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  collapsibleContent: { width: '100%' },
  topMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  tagBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
  tagText: { fontSize: 13, color: '#4A5568', fontWeight: '600' },
  dateText: { fontSize: 13, color: '#718096' },
  mainTitle: { fontSize: 24, fontWeight: '500', color: '#1A202C', marginBottom: 10 },
  threatRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  threatText: { fontSize: 15, color: '#B25E13', fontWeight: '500' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  locationText: { fontSize: 14, color: '#718096' },
  detailsBlock: { marginBottom: 20, marginTop: 10 },
  sectionHeader: { fontSize: 15, fontWeight: '700', color: '#1A202C', marginBottom: 6 },
  productDescription: { fontSize: 15, color: '#4A5568', marginBottom: 12 },
  codeGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  codeColumn: { flex: 1 },
  codeLabel: { fontSize: 13, color: '#718096', marginBottom: 4 },
  codeValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  calloutBox: { backgroundColor: '#EEF8F6', borderRadius: 12, padding: 16, marginBottom: 20 },
  calloutHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  calloutHeaderTitle: { fontSize: 15, fontWeight: '700', color: '#006A60' },
  calloutBody: { fontSize: 14, color: '#2D3748', lineHeight: 22 },
  footerMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sourceText: { fontSize: 13, color: '#718096' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },
  hideDetailsButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 },
  hideDetailsText: { fontSize: 15, fontWeight: '700', color: '#006A60' },
});
