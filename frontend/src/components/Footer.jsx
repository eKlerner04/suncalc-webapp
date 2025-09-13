import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#f8fafc',
      color: '#64748b',
      padding: '32px 0',
      marginTop: 'auto',
      borderTop: '1px solid #e2e8f0'
    }}>
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0 40px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          marginBottom: '16px'
        }}>
          <a 
            href="https://www.uni-goettingen.de/de/439238.html" 
            target="_blank" 
            rel="noreferrer"
            tabIndex={1}
            aria-label="Impressum der Universität Göttingen öffnen"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              if (document.activeElement !== e.target) {
                e.target.style.backgroundColor = '#e2e8f0';
                e.target.style.color = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.target) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#64748b';
              }
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = '#e0f2fe';
              e.target.style.color = '#0ea5e9';
              e.target.style.outline = '3px solid #0ea5e9';
              e.target.style.outlineOffset = '2px';
              e.target.style.boxShadow = '0 0 0 1px #0ea5e9';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#64748b';
              e.target.style.outline = 'none';
              e.target.style.boxShadow = 'none';
            }}
          >
            Impressum
          </a>
          <span style={{ color: '#cbd5e0', fontSize: '1.2rem' }}>•</span>
          <Link 
            to="/privacy"
            tabIndex={2}
            aria-label="Datenschutzerklärung öffnen"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              if (document.activeElement !== e.target) {
                e.target.style.backgroundColor = '#e2e8f0';
                e.target.style.color = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.target) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#64748b';
              }
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = '#e0f2fe';
              e.target.style.color = '#0ea5e9';
              e.target.style.outline = '3px solid #0ea5e9';
              e.target.style.outlineOffset = '2px';
              e.target.style.boxShadow = '0 0 0 1px #0ea5e9';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#64748b';
              e.target.style.outline = 'none';
              e.target.style.boxShadow = 'none';
            }}
          >
            Datenschutzerklärung
          </Link>
          <span style={{ color: '#cbd5e0', fontSize: '1.2rem' }}>•</span>
          <Link 
            to="/accessibility"
            tabIndex={3}
            aria-label="Barrierefreiheits-Informationen öffnen"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              if (document.activeElement !== e.target) {
                e.target.style.backgroundColor = '#e2e8f0';
                e.target.style.color = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.target) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#64748b';
              }
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = '#e0f2fe';
              e.target.style.color = '#0ea5e9';
              e.target.style.outline = '3px solid #0ea5e9';
              e.target.style.outlineOffset = '2px';
              e.target.style.boxShadow = '0 0 0 1px #0ea5e9';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#64748b';
              e.target.style.outline = 'none';
              e.target.style.boxShadow = 'none';
            }}
          >
            Barrierefreiheit
          </Link>
        </div>
        <p style={{
          margin: '0',
          fontSize: '0.875rem',
          color: '#94a3b8',
          fontWeight: '400'
        }}>
          © 2025 SunCalc - Universität Göttingen
        </p>
      </div>
    </footer>
  );
}
