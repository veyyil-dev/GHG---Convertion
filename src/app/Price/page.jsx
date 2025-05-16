import React from 'react';
import styles from "./Home.module.css" // You might need to adjust this path

const PricingCard = ({ plan, price, features, primary }) => (
  <div className={`${styles.pricingCard} ${primary ? styles.primaryCard : ''}`}>
    <div className={styles.planHeader}>
      <h3>{plan.toUpperCase()}</h3>
      <h2>${price} <span className={styles.perMonth}>Per Month</span></h2>
    </div>
    <ul className={styles.features}>
      {features.map((feature, index) => (
        <li key={index} className={feature.included ? styles.included : styles.excluded}>
          {feature.text}
        </li>
      ))}
    </ul>
    <button className={styles.selectButton}>{primary ? 'GET STARTED' : 'SELECT PLAN'}</button>
  </div>
);

export default function Home() {
  const pricingData = [
    {
      plan: 'basic',
      price: '24.99',
      features: [
        { text: 'Lorem ipsum dolor magna sint aliqua.', included: true },
        { text: 'Nemo enim voluptat quia odit quis fugit.', included: true },
        { text: 'Lorem ipsum dolor magna sint aliqua.', included: false },
        { text: 'Nemo enim voluptat quia odit quis fugit.', included: false },
      ],
    },
    {
      plan: 'standard',
      price: '49.99',
      features: [
        { text: 'Lorem ipsum dolor magna sint aliqua.', included: true },
        { text: 'Nemo enim voluptat quia odit quis fugit.', included: true },
        { text: 'Lorem ipsum dolor magna sint aliqua.', included: true },
        { text: 'Nemo enim voluptat quia odit quis fugit.', included: false },
      ],
      primary: true,
    },
    {
      plan: 'premium',
      price: '74.99',
      features: [
        { text: 'Lorem ipsum dolor magna sint aliqua.', included: true },
        { text: 'Nemo enim voluptat quia odit quis fugit.', included: true },
        { text: 'Lorem ipsum dolor magna sint aliqua.', included: true },
        { text: 'Nemo enim voluptat quia odit quis fugit.', included: true },
      ],
    },
  ];

  return (
    <div className={styles.container}>w
      <main className={styles.main}>
        <h1 className={styles.title}>Choose Your Perfect Plan</h1>
        <div className={styles.pricingGrid}>
          {pricingData.map((planData, index) => (
            <PricingCard key={index} {...planData} />
          ))}
        </div>
      </main>
    </div>
  );
}