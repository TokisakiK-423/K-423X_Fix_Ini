import { StyleSheet, Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';
const { width } = Dimensions.get('window');

export const LoginStyles = StyleSheet.create({
    labelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
        marginLeft: 4,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        marginBottom: 30,
    },
    titleText: {
        fontSize: 30,
        fontFamily: 'Pacifico',
        color: 'white',
        textAlign: 'center',
    },
    titleLogo: {
        width: 100,
        height: 100,
        borderRadius: 8,
        resizeMode: 'contain',
    },
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
