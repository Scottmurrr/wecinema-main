import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React from 'react';

interface PayPalButtonWrapperProps {
  amount: number;
  userId: string | null;
  onSuccess: (details: any) => void;
  onError: (message: string) => void;
}

const PayPalButtonWrapper: React.FC<PayPalButtonWrapperProps> = ({ amount, userId, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider options={{ "clientId": "EMMR9l3wYDsjkgFo1sKpxGLc77UuyE_c08ocbT64Fs27S9s5q7qnwNGmEdALWIIcDk-O_X62qTXNV8tl", "currency": "USD" }}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={async (_, actions) => {
          try {
            if (!actions.order) {
              throw new Error("Order actions are undefined.");
            }
            // Create Order
            const orderId = await actions.order.create({
              intent: 'CAPTURE', // Added intent property
              purchase_units: [{
                amount: {
                  currency_code: 'USD',
                  value: amount.toString(),
                },
                custom_id: userId || '', // Ensure custom_id is a string
              }],
            });
            return orderId;
          } catch (error) {
            console.error("Error creating order:", error);
            onError('Error creating order. Please try again.');
            throw error;
          }
        }}
        onApprove={async (_, actions) => {
          try {
            if (!actions.order) {
              throw new Error("Order actions are undefined.");
            }
            // Capture Order
            const details = await actions.order.capture();
            console.log('Payment successful:', details);
            onSuccess(details);
          } catch (error) {
            console.error('Capture error:', error);
            onError('Capture error. Please try again.');
            throw error;
          }
        }}
        onError={(err) => {
          console.error('PayPal payment error:', err);
          onError('PayPal payment error. Please try again.');
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButtonWrapper;
