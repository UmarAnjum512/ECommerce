import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const RATES = {
  USD: { symbol: '$', rate: 1, label: 'USD' },
  PKR: { symbol: 'PKR ', rate: 278, label: 'PKR' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('fk_currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('fk_currency', currency);
  }, [currency]);

  const formatPrice = (amountInUSD) => {
    if (typeof amountInUSD !== 'number' || isNaN(amountInUSD)) {
      amountInUSD = 0;
    }
    const curr = RATES[currency] || RATES.USD;
    const converted = amountInUSD * curr.rate;

    if (currency === 'PKR') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    } else {
      return `${curr.symbol}${converted.toFixed(0)}`;
    }
  };

  const getConvertedNumber = (amountInUSD) => {
    const curr = RATES[currency] || RATES.USD;
    return Math.round(amountInUSD * curr.rate);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, getConvertedNumber, rates: RATES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
