import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
  },
  cardBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    position: "relative",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  cardImage: {
    width: 40,
    height: 24,
    resizeMode: "contain",
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editText: {
    marginRight: 20,
    color: "#000",
  },
  deleteText: {
    color: "red",
  },
  addButton: {
    backgroundColor: "#19c7f2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});


export default styles;
