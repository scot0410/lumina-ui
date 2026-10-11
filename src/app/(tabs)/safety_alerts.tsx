import OutBreaksScreen from '@/components/outbreaks';
import RecallScreen from '@/components/recalls';
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    Animated,
} from 'react-native';
import { TabView, TabBar, Route } from 'react-native-tab-view';


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

// const tabBarProps = {
//     navigationState: { index, routes },
//     position: new Animated.Value(index),
//     jumpTo: (key: string) => {
//         const newIndex = routes.findIndex((r) => r.key === key);
//         if (newIndex !== -1) setIndex(newIndex);
//     },
// };

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

    // Shared TabBar props setup to pass out-of-context manually
    const tabBarProps = {
        navigationState: { index, routes },
        position: new Animated.Value(index) as any, // Mock position animation for independent usage
        jumpTo: (key: string) => {
            const newIndex = routes.findIndex((r) => r.key === key);
            if (newIndex !== -1) setIndex(newIndex);
        },
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

            {/* --- 2. EXTRACTED TAB BAR (Now on Top) --- */}
            <View style={styles.tabBarWrapper}>
                <TabBar<CustomRoute>
                    style={styles.tabBarBackground}
                    indicatorStyle={styles.tabIndicator}
                    activeColor="#00664F"
                    inactiveColor="#4A5568"
                    renderLabel={({ route, color, focused }) => (
                        <View style={[
                            styles.tabPill,
                            focused && styles.activeTabPill]}>
                            <Text style={[
                                styles.tabLabel, 
                                { color }, 
                                focused && styles.activeTabLabel]}>
                                {route.key === 'recalls' ? '📦 ' : '📈 '}
                                {route.title}
                            </Text>
                        </View>
                    )}
                    {...tabBarProps}
                />
            </View>

            {/* --- 3. FILTER PANEL CONTROLS (Underneath Tabs) --- */}
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

            {/* --- 4. VIEWPORTS / OPEN SPACE CONTENT (Under all layout elements) --- */}
            <View style={styles.contentBody}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={() => null} // Disables the inner auto-attached tab headers
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
    tabBarWrapper: {
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    tabBarBackground: {
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        elevation: 0,
        shadowOpacity: 0,
    },
    tabIndicator: {
        backgroundColor: '#FFFFFF',
        height: '84%',
        top: '8%',
        borderRadius: 6,
        width: '46%',
        left: '2%',
    },
    tabPill: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 8,
    },
    activeTabPill: {
        // Active container properties if needed
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeTabLabel: {
        fontWeight: '700',
    },
    filterSection: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
    },
    dropdownChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6FFFA',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#B2F5EA',
    },
    chipText: {
        color: '#00664F',
        fontWeight: '600',
        fontSize: 14,
    },
    resetText: {
        color: '#00664F',
        fontWeight: '600',
        fontSize: 14,
    },
    locationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    inputGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        color: '#718096',
        fontWeight: '500',
        marginBottom: 6,
    },
    locationSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#FAFAFA',
    },
    selectorText: {
        fontSize: 14,
        color: '#1A202C',
        fontWeight: '500',
    },
    chevron: {
        fontSize: 12,
        color: '#A0AEC0',
    },
    contentBody: {
        flex: 1, // Forces the actual lists to take up all remaining space below filters
    },
});
