import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Pacifico',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
    paddingVertical: 4,
  },
  secondaryButton: {
    marginTop: 10,
  },
  errorText: {
    color: 'yellow',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  labelContainer: {
    marginBottom: 8,
  },
});
