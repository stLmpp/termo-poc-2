import App from './App.svelte';

const app = new App({ target: document.getElementById('app')! });

export default app;

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { initializeAnalytics } from 'firebase/analytics';

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyCAhcr6HJJ0uhdkbbSU6hCmG7CvOvlA0vQ',
  authDomain: 'termo-predictions.firebaseapp.com',
  projectId: 'termo-predictions',
  storageBucket: 'termo-predictions.appspot.com',
  messagingSenderId: '810053753067',
  appId: '1:810053753067:web:00e272f82a53569baf06ae',
  measurementId: 'G-H6YVPNP2N4',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
import.meta.env.PROD && initializeAnalytics(firebaseApp);
