import OutBreaksScreen from '@/components/outbreaks';
import RecallScreen from '@/components/recalls';
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import { TabView, Route } from 'react-native-tab-view';
import { Activity, Package } from 'lucide-react-native';

interface CustomRoute extends Route {
    title: string;
    icon?: string;
}

const renderScene = ({ route }: { route: CustomRoute }) => {
    switch (route.key) {
        case 'recalls':
            return <RecallScreen />;
        case 'outbreaks':
            return <OutBreaksScreen />;
        default:
            return null;
    }
};

export default function SafetyAlertsScreen() {
    const layout = useWindowDimensions();

    // Tab State
    const [index, setIndex] = useState(0);
    const [routes] = useState<CustomRoute[]>([
        { key: 'recalls', title: 'Recalls' },
        { key: 'outbreaks', title: 'Outbreaks' },
    ]);

    // Filter States
    const [category, setCategory] = useState('All categories');
    const [stateFilter, setStateFilter] = useState('California');
    const [cityFilter, setCityFilter] = useState('San Diego');

    const handleReset = () => {
        setCategory('All categories');
        setStateFilter('California');
        setCityFilter('San Diego');
    };

    return (
        <View style={styles.container}>
            {/* --- 1. HEADER --- */}
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Text style={styles.headerTitle}>Safety alerts</Text>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.bellIcon}>🔔</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerSubtitle}>
                    Know what's affected. Know what to do.
                </Text>
            </View>

            {/* --- 2. CLEAN PURE FLEXBOX PILL TABS --- */}
            <View style={styles.tabBarWrapper}>
                {routes.map((route, i) => {
                    const isFocused = index === i;
                    const currentTabColor = isFocused ? '#087F79' : '#607278';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={[
                                styles.tabPill,
                                isFocused ? styles.activeTabPill : styles.inactiveTabPill
                            ]}
                            onPress={() => setIndex(i)}
                            activeOpacity={0.7}
                        >
                            {/* 1. Icon sits out here as a true flex sibling */}
                            {route.key === 'recalls' ? (
                                <Package
                                    size={16}
                                    color={currentTabColor}
                                    strokeWidth={2}
                                />
                            ) : (
                                <Activity
                                    size={16}
                                    color={currentTabColor}
                                    strokeWidth={2}
                                />
                            )}

                            {/* 2. Text sits cleanly out here as its own pure string component */}
                            <Text style={[styles.tabLabel, { color: currentTabColor }]}>
                                {route.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* --- 3. FILTER PANEL CONTROLS --- */}
            <View style={styles.filterSection}>
                <View style={styles.categoryRow}>
                    <TouchableOpacity style={styles.dropdownChip}>
                        <Text style={styles.chipText}>🎛️ {category} ∨</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReset}>
                        <Text style={styles.resetText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.locationRow}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>State</Text>
                        <TouchableOpacity style={styles.locationSelector}>
                            <Text style={styles.selectorText}>🗺️ {stateFilter}</Text>
                            <Text style={styles.chevron}>∨</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>City / local area</Text>
                        <TouchableOpacity style={styles.locationSelector}>
                            <Text style={styles.selectorText}>📍 {cityFilter}</Text>
                            <Text style={styles.chevron}>∨</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* --- 4. VIEWPORTS / TAB VIEW --- */}
            <View style={styles.contentBody}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={() => null} // Kept null so it uses our perfect custom bar above
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    headerTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A202C',
        fontFamily: 'Inter-Medium', // Enforced globally
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EDFDF5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    bellIcon: {
        fontSize: 18,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#718096',
        marginTop: 4,
    },

    // --- UPDATED LAYOUT FIXES ---
    tabBarWrapper: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10,
        height: 48,
        borderRadius: 8,
        padding: 4,
        gap: 4,
        // backgroundColor: '#F1F5F9',
        backgroundColor: '#EDF1F2',
    },
    tabPill: {
        flex: 1, // Splitting the space exactly 50/50 after accounting for gap/padding
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 6,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4,
        gap: 4,
    },
    tabLabel: {
        fontWeight: '600',
        // fontFamily: 'Inter-Medium', // Enforced globally
        fontSize: 15,              // Enforced globally
        lineHeight: 20,            // Enforced globally
    },
    activeTabPill: {
        backgroundColor: '#FFF', // Your primary colored background when focused
        color: '#087F79'
    },
    inactiveTabPill: {
        backgroundColor: 'transparent', // Clear background when unfocused
        color: '#607278'
    },

    // --- STUBS FOR REST OF SCREEN LAYOUT ---
    filterSection: {
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dropdownChip: {
        backgroundColor: '#F1F5F9',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    chipText: {
        color: '#1A202C',
    },
    resetText: {
        color: '#718096',
    },
    locationRow: {
        flexDirection: 'row',
        gap: 12,
    },
    inputGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        color: '#718096',
        marginBottom: 4,
    },
    locationSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 6,
        padding: 10,
    },
    selectorText: {
        fontSize: 14,
        color: '#1A202C',
    },
    chevron: {
        color: '#A0AEC0',
    },
    contentBody: {
        flex: 1,
    },
});
