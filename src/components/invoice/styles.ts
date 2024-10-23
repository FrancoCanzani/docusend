import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#323232',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 40, // Large "Invoice" title
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    textAlign: 'right',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  column: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#505050',
    marginBottom: 5,
  },
  value: {
    marginBottom: 3,
  },
  table: {
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 2,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  description: { flex: 2 },
  quantity: { width: 60, textAlign: 'right' },
  rate: { width: 80, textAlign: 'right' },
  total: { width: 80, textAlign: 'right' }, // New total column
  totals: {
    marginLeft: 'auto',
    width: 200,
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  grandTotal: {
    fontSize: 11,
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  notesAndPayment: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
  notesSection: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 4,
  },
  paymentSection: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 8,
    color: '#969696',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
