// LocationAccessStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    padding: 16,
    backgroundColor: '#fff'
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  text: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
    color: '#333'
  },
  alarmBox: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10
  },
  alarmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  alarmItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    // Elevación para Android
    elevation: 2,
  },
  alarmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alarmName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  alarmAddress: {
    fontSize: 14,
    color: '#666'
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    alignSelf: 'center'
  },
  generateAlarm: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  generateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  generateButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },

  //microfono
  micButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    // Opcional: agregar sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // Elevación para Android
    elevation: 5,
  },
  // ... otros estilos


});

export default styles;