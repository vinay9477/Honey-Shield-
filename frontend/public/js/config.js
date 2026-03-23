// Dynamic API configuration - works on localhost, LAN, and production
function isLocal() {
  const h = window.location.hostname;
  return window.location.protocol === 'file:'
    || h === 'localhost'
    || h === '127.0.0.1'
    || h === '' // For file:/// protocol
    || h.startsWith('192.168.')
    || h.startsWith('10.')
    || /^172\.(1[6-9]|2\d|3[01])\./.test(h);
}

const host = window.location.hostname || '127.0.0.1';
const API_BASE = isLocal()
  ? 'http://' + host + ':3000'
  : 'https://honey-shield-production.up.railway.app';

const HONEYPOT_REDIRECT = isLocal()
  ? 'http://' + host + ':4000'
  : '/';
