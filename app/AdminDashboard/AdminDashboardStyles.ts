import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container:{
    paddingTop: 32,
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '400',
    marginBottom: 35,
    color: '#00BFFF',
  },
  metricsContainer: {
    paddingHorizontal: 48,
  },
  metricBox: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  metricIconContainer:{
    flexDirection: "row",
    alignItems: "center"
  },
  metricTitle: {
    fontSize: 14,
    marginLeft: 16,
    color: '#475569',
    fontWeight: 600,
  },
  metricValue: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center"
  },
  salesRaiseSection:{
    flexDirection:"row",
  },
  metricChange: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 600,
    textAlign: "center"
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  recentOrdersTitle: {
    fontSize: 20,
    fontWeight: 600,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: 600
  },
  orderContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#000000',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 16,
    marginBottom: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  
  customerName: {
    fontSize: 14,
    marginBottom: 8
  },
  orderTime: {
    fontSize: 14,
    color: '#64748B',
  },
  orderAmount: {
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
    display: "flex"
  },
});

export default styles;
