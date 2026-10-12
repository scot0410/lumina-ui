import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { SafetyAlertCard, AlertItem } from './safety_alert_card';
// import {SafetyAlertCard} from "./safety_alert_card"

interface ListProps {
  data: AlertItem[];
}

export function AlertListContainer({ data }: ListProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SafetyAlertCard item={item} />}
        contentContainerStyle={styles.scrollListContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollListContainer: {
    paddingVertical: 8,
    paddingBottom: 48, // Gives padding at bottom so last item clears native tab boundaries
  },
});
