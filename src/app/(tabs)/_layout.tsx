import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 👈 1. Import Safe Area Insets
import { Home, ShieldCheck, Scan, User } from 'lucide-react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets(); // 👈 2. Read native phone overlay height values

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#005F59',
        tabBarInactiveTintColor: '#7C8B9A',
        
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShadowVisible: false,
        headerTintColor: '#1A2530',
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 20,
        },

        // Clean white tab bar background styling
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#ECF0F3',
          
          // 👈 3. DYNAMIC CORRECTION LAYER:
          // Combines base design spacing with the device's navigation bar block height.
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
{/* 
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activePillBackground]}>
              <User color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      /> */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
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
