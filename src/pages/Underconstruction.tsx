import React from 'react';
import styles from './Underconstruction.module.css';

const UnderConstruction: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.gears}>
          <div className={styles.gear}></div>
          <div className={styles.gear}></div>
        </div>
        <h1 className={styles.title}>Under Construction</h1>
        <p className={styles.message}>
          Our team is working on something extraordinary.
          <br />
          We'll be back soon with an amazing experience!
        </p>
        <div className={styles.progressBar}>
          <div className={styles.progress}></div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
