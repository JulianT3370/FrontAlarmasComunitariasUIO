import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';

const CommunityGroups = ({ navigation }) => {
  const groups = [
    { id: '1', name: 'Grupo La Gasca' },
    { id: '2', name: 'Grupo Principal A' },
  ];

  const renderGroup = ({ item }) => (
    <View style={styles.groupContainer}>
      <Text style={styles.groupText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroup}
      />
      <Button
        title="Agregar Nuevo Grupo"
        onPress={() => navigation.navigate('AddGroup')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  groupContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  groupText: {
    fontSize: 16,
  },
});

export default CommunityGroups;
