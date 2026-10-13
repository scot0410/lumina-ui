import OutBreaksScreen from '@/components/outbreaks';
import { AlertItem } from '@/components/safety_alert_card';
import React, { useMemo, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import { TabView, Route, SceneMap } from 'react-native-tab-view';
import { Activity, ChevronDown, Package, SlidersHorizontal, Map, MapPin, Bell } from 'lucide-react-native';
import { AlertListContainer } from '@/components/alert_list_container';

const MOCK_RECALLS: AlertItem[] = [
    {
        id: 'rec-1',
        category: 'Food · Produce',
        date: 'Sep 18, 2026',
        title: 'Valley Leaf baby spinach',
        threat: 'Possible Listeria contamination',
        location: 'California · San Diego stores',
        productDetails: '5 oz bags of baby spinach',
        lotCode: 'VL0912–VL0914',
        useBy: 'Sep 20–22, 2026',
        instructions: 'Do not eat the affected product. Return it for a refund or discard it. Clean surfaces it touched.',
        source: 'FDA · example notice'
    }
];

const MOCK_OUTBREAKS: AlertItem[] = [
    {
        id: 'out-1',
        category: 'Water · Local',
        date: 'Sep 10, 2026',
        title: 'San Diego County Tap Network',
        threat: 'Boil water advisory active',
        location: 'California · San Diego stores',
        productDetails: 'Municipal utility lines',
        lotCode: 'N/A',
        useBy: 'Until cleared',
        instructions: 'Bring all water to a rolling boil for at least 1 minute before drinking or cooking.',
        source: 'San Diego Health Dept'
    }
];

interface CustomRoute extends Route {
    title: string;
    icon?: string;
}

// const renderScene = ({ route }: { route: CustomRoute }) => {
//     switch (route.key) {
//         case 'recalls':
//             return <RecallScreen />;
//         case 'outbreaks':
//             return <OutBreaksScreen />;
//         default:
//             return null;
//     }
// };

export default function SafetyAlertsScreen() {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState<CustomRoute[]>([
        { key: 'recalls', title: 'Recalls' },
        { key: 'outbreaks', title: 'Outbreaks' },
    ]);
    const [category, setCategory] = useState('All categories');
    const [stateFilter, setStateFilter] = useState('California');
    const [cityFilter, setCityFilter] = useState('San Diego');

    const renderScene = useMemo(() => SceneMap({
        recalls: () => <AlertListContainer data={MOCK_RECALLS} />,
        outbreaks: () => <AlertListContainer data={MOCK_OUTBREAKS} />,
    }), []);

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
                        <Bell size={20} color={"#087F79"} strokeWidth={2} />
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
                    const currentFontWeight = isFocused ? '600' : '400';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={[
                                styles.tabPill,
                                isFocused
                                    ? styles.activeTabPill
                                    : styles.inactiveTabPill
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
                            <Text style={[styles.tabLabel,
                            {
                                color: currentTabColor,
                                fontWeight: currentFontWeight,
                            }]}>
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
                        <SlidersHorizontal size={15} color={"#087F79"} />
                        <Text style={styles.chipText}>{category}</Text>
                        <ChevronDown size={15} color={"#087F79"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReset}>
                        <Text style={styles.resetText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.locationRow}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>State</Text>
                        <TouchableOpacity style={styles.locationSelector}>
                            <Map size={15} color={"#607278"} />
                            <Text style={styles.selectorText}>{stateFilter}</Text>
                            <ChevronDown size={15} color={"#607278"} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>City / local area</Text>
                        <TouchableOpacity style={styles.locationSelector}>
                            <MapPin size={15} color={"#607278"} />
                            <Text style={styles.selectorText}>{cityFilter}</Text>
                            <ChevronDown size={15} color={"#607278"} />
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
                    renderTabBar={() => null} 
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
        color: '#182C32',
        fontFamily: 'Inter-Medium', // Enforced globally
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F4F2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8F4F2',
    },
    bellIcon: {
        fontSize: 18,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#607278',
        marginTop: 4,
        fontWeight: '300'
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
        borderRadius: 8,
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#E8F4F2',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 99,
        color: '#087F79',
        height: 36
    },
    chipText: {
        color: '#087F79',
        fontWeight: '600',

    },
    resetText: {
        color: '#087F79',
        fontWeight: '600',

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
        color: '#607278',
        marginBottom: 4,
        // flexDirection: 'row',
        // alignContent: 'flex-start'
        fontWeight: '400'
    },
    locationSelector: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 6,
        padding: 10,
    },
    selectorText: {
        fontSize: 14,
        color: '#182C32',

        fontWeight: '500',

        // --- PRECISE SPACING HOOKS ---
        marginLeft: 8,  // 1. Map icon is exactly 4px away from text
        marginRight: 16, // 2. Creates explicit space to the right of the state text
        flexGrow: 1,
    },
    chevron: {
        color: '#A0AEC0',
    },
    contentBody: {
        flex: 1,
    },
});
