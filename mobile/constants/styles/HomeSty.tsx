import { StyleSheet } from 'react-native';

export const HomeStyles = StyleSheet.create({
    logoutButtonLabel: {
    color: '#FFFFFF',    
    fontWeight: '800',
  },
  completedTaskTitle: {fontSize: 16, fontWeight: 'bold', color: '#888', textDecorationLine: 'line-through', opacity: 0.7},
  safeArea: { flex: 1, backgroundColor: '#8e2de2' },
  gradientContainer: { flex: 1 },
  container: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#fff', marginTop: 15 },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 8, color: '#fff' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  button: { backgroundColor: '#5e3ba2', width: 140, },
  logoutButton: { backgroundColor: '#FC0FC0', width: 140,},
  taskCard: { marginBottom: 10, backgroundColor: '#f9f9f9' },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskInfo: { flex: 1, paddingRight: 10 },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  taskDateTime: { fontSize: 14, color: '#555', marginTop: 4 },
  emptyText: { 
    color: '#fff', 
    marginTop: 8,
    fontSize: 14,
    opacity: 0.8,
    marginRight: 10
  },
  bottomButtons: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#5e3ba2', paddingVertical: 12 },
  navButton: { flex: 1, marginHorizontal: 15,backgroundColor: '#FC0FC0' },
});

