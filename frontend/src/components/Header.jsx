

export default function Header() {
  return (
    <header style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: '#0A2540',
      color: '#ffffff',
      padding: '32px 0',
      borderBottom: '1px solid #1e293b',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
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
          color: '#ffffff',
          letterSpacing: '-0.03em',
          lineHeight: '1.1'
        }}>
          SunCalc
        </h1>
        <p style={{ 
          margin: '0',
          fontSize: '1.25rem',
          color: '#e2e8f0',
          fontWeight: '400',
          lineHeight: '1.4'
        }}>
          Berechne das Solarpotential deines Dachs
        </p>
      </div>
    </header>
  );
}
