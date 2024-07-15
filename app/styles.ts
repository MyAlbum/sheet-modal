import { StyleSheet } from 'react-native';

export const closeButtonStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  iconColor: 'rgba(0, 0, 0, 0.5)',
};

export const styles = StyleSheet.create({
  sheet: {
    maxWidth: '100%',
    width: 500,
    paddingTop: 35,
    flexDirection: 'column',
    flexGrow: 0,
    height: '100%',
  },
  flex: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  background: {
    backgroundColor: 'white',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hairline: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 10,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    marginBottom: 10,
  },
  option: {
    width: 250,
    marginBottom: 20,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  handle: {
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  rect: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginVertical: 5,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0, 0.35)',
  },
  scrollView: {
    marginBottom: 35,
  },

  rectContainer: {
    paddingHorizontal: 16,
    gap: 1,
  },
});
