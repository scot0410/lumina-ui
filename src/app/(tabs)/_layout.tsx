import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { Home, ShieldCheck, Scan } from 'lucide-react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets(); 

  return (
    // 1. GLOBAL FIX: Wrap everything in a View that forces top padding across all screens
    <View style={[styles.globalContainer, { paddingTop: insets.top }]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#005F59',
          tabBarInactiveTintColor: '#7C8B9A',

          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#ECF0F3',
            height: 64 + insets.bottom, 
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            paddingTop: 8,
          },
          
          tabBarLabel: ({ color, children, focused }) => (
            <Text style={[
              styles.tabLabel, 
              { color }, 
              focused && styles.activeTabLabel
            ]}>
              {children}
            </Text>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.iconWrapper, focused && styles.activePillBackground]}>
                <Home color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="scan"
          options={{
            title: 'Scan',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.iconWrapper, focused && styles.activePillBackground]}>
                <Scan color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="alerts"
          options={{
            title: 'Alerts',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.iconWrapper, focused && styles.activePillBackground]}>
                <ShieldCheck color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  // Ensures the outer wrapper expands cleanly across the device frame
  globalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Matches your clean app header theme
  },
  iconWrapper: {
    width: 56,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activePillBackground: {
    backgroundColor: '#E8F5F3',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});
