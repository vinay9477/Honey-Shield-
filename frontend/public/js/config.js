function isLocal() {
  var h = window.location.hostname;
  return window.location.protocol === 'file:'
    || h === 'localhost'
    || h === '127.0.0.1'
    || h === ''
    || h.startsWith('192.168.')
    || h.startsWith('10.')
    || /^172\.(1[6-9]|2\d|3[01])\./.test(h);
}

var host = window.location.hostname || '127.0.0.1';
var API_BASE = isLocal()
  ? 'http://' + host + ':3000'
  : 'https://honey-shield-production.up.railway.app';

var HONEYPOT_REDIRECT = isLocal()
  ? 'http://' + host + ':4000'
  : '/';
