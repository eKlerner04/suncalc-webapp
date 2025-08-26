export default function Header() {
  return (
    <header style={{ 
      background: '#ffffff',
      color: '#1e293b',
      padding: '32px 0',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ 
        maxWidth: '100%', 
        margin: '0 auto', 
        padding: '0 40px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          margin: '0 0 8px 0',
          fontSize: '3rem',
          fontWeight: '800',
          color: '#1e293b',
          letterSpacing: '-0.03em',
          lineHeight: '1.1'
        }}>
          SunCalc
        </h1>
        <p style={{ 
          margin: '0',
          fontSize: '1.25rem',
          color: '#64748b',
          fontWeight: '400',
          lineHeight: '1.4'
        }}>
          Berechne das Solarpotential deines Dachs
        </p>
      </div>
    </header>
  );
}
