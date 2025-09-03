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
            style={{
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e2e8f0';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#64748b';
            }}
          >
            Impressum
          </a>
          <span style={{ color: '#cbd5e0', fontSize: '1.2rem' }}>•</span>
          <a 
            href="https://www.uni-goettingen.de/de/591645.html" 
            target="_blank" 
            rel="noreferrer"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e2e8f0';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#64748b';
            }}
          >
            Datenschutzerklärung
          </a>
          <span style={{ color: '#cbd5e0', fontSize: '1.2rem' }}>•</span>
          <a 
            href="https://www.uni-goettingen.de/de/635204.html" 
            target="_blank" 
            rel="noreferrer"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e2e8f0';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#64748b';
            }}
          >
            Barrierefreiheit
          </a>
        </div>
        <p style={{
          margin: '0',
          fontSize: '0.875rem',
          color: '#94a3b8',
          fontWeight: '400'
        }}>
          © 2024 SunCalc - Universität Göttingen
        </p>
      </div>
    </footer>
  );
}
