import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { InvoiceData } from '@/lib/types';

export const InvoicePDF = ({ data }: { data: InvoiceData }) => {
  const discountAmount = data.subtotal * (data.discount / 100);
  const taxAmount = (data.subtotal - discountAmount) * (data.tax / 100);

  return (
    <Document>
      <Page
        size='A4'
        style={{
          padding: 20,
          fontSize: 10,
          fontFamily: 'Courier',
          color: '#000',
          backgroundColor: '#fff',
        }}
      >
        {/* Header Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 35,
            fontWeight: 'bold',
            color: '#000',
          }}
        >
          <Text style={{ fontSize: 40 }}>Invoice</Text>{' '}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              fontWeight: 'bold',
              color: '#000',
              fontSize: 12,
            }}
          >
            <Text>{data.invoiceId}</Text>
            <Text>
              Issue Date: {new Date(data.dates.issueDate).toLocaleDateString()}
            </Text>
            <Text>
              Due Date: {new Date(data.dates.dueDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* From and To Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
            marginBottom: 35,
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ fontWeight: 'bold', color: '#505050', marginBottom: 10 }}
            >
              Invoice From
            </Text>
            <Text style={{ marginBottom: 3 }}>{data.senderName}</Text>
            <Text style={{ marginBottom: 3 }}>{data.senderEmail}</Text>
            {data.senderDetails.split('\n').map((line, i) => (
              <Text key={i} style={{ marginBottom: 3 }}>
                {line}
              </Text>
            ))}
          </View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ fontWeight: 'bold', color: '#505050', marginBottom: 10 }}
            >
              Invoice To
            </Text>
            <Text style={{ marginBottom: 3 }}>{data.customerName}</Text>
            <Text style={{ marginBottom: 3 }}>{data.customerEmail}</Text>
            {data.customerDetails.split('\n').map((line, i) => (
              <Text key={i} style={{ marginBottom: 3 }}>
                {line}
              </Text>
            ))}
          </View>
        </View>

        {/* Items Table */}
        <View style={{ marginVertical: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 8,
              paddingHorizontal: 5,
              marginBottom: 12,
              borderBottomWidth: 0.5,
              borderBottomColor: '#000',
            }}
          >
            <Text style={{ flex: 2 }}>Description</Text>
            <Text style={{ width: 60, textAlign: 'right' }}>Quantity</Text>
            <Text style={{ width: 80, textAlign: 'right' }}>Price</Text>
            <Text style={{ width: 80, textAlign: 'right' }}>Total</Text>
          </View>
          {data.items.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                paddingVertical: 5,
                paddingHorizontal: 5,
              }}
            >
              <Text style={{ flex: 2 }}>{item.description}</Text>
              <Text style={{ width: 60, textAlign: 'right' }}>
                {item.quantity}
              </Text>
              <Text style={{ width: 80, textAlign: 'right' }}>
                {item.rate.toFixed(2)}
              </Text>
              <Text style={{ width: 80, textAlign: 'right' }}>
                {(item.rate * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={{ marginLeft: 'auto', width: 200, marginTop: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 3,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Subtotal:</Text>
            <Text>{data.subtotal.toFixed(2)}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 3,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>
              Discount ({data.discount}%):
            </Text>
            <Text>{discountAmount.toFixed(2)}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 3,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Tax ({data.tax}%):</Text>
            <Text>{taxAmount.toFixed(2)}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
              paddingTop: 5,
              borderTopWidth: 0.5,
              borderTopColor: '#000',
              fontSize: 11,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Total:</Text>
            <Text style={{ fontWeight: 'bold' }}>
              {data.total.toFixed(2)} {data.currency}
            </Text>
          </View>
        </View>

        {/* Payment Details and Notes */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
            marginTop: 50,
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ fontWeight: 'bold', color: '#505050', marginBottom: 12 }}
            >
              Payment Details
            </Text>
            {data.paymentDetails.split('\n').map((line, i) => (
              <Text key={i} style={{ marginBottom: 3 }}>
                {line}
              </Text>
            ))}
          </View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text
              style={{ fontWeight: 'bold', color: '#505050', marginBottom: 12 }}
            >
              Notes
            </Text>
            {data.notes.split('\n').map((line, i) => (
              <Text key={i} style={{ marginBottom: 3 }}>
                {line}
              </Text>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            fontSize: 8,
            color: '#969696',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text>Generated with DocuSend</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};
