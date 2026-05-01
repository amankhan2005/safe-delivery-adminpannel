import logo from '../assets/logo.png'

export default function Spinner({ size = 'md' }) {
  const dim = { sm: 40, md: 72, lg: 100 }[size]
  const ring = { sm: 3, md: 4, lg: 5 }[size]
  const logoSize = { sm: 20, md: 36, lg: 52 }[size]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 0',
      gap: 14,
    }}>
      {/* Spinning rings + logo */}
      <div style={{ position: 'relative', width: dim, height: dim }}>

        {/* Outer ring — blue, fast */}
        <svg
          width={dim} height={dim}
          viewBox={`0 0 ${dim} ${dim}`}
          style={{ position: 'absolute', inset: 0, animation: 'spin 1s linear infinite' }}
        >
          <circle
            cx={dim / 2} cy={dim / 2}
            r={dim / 2 - ring}
            fill="none"
            stroke="#1B4FD8"
            strokeWidth={ring}
            strokeDasharray={`${Math.PI * (dim - ring * 2) * 0.7} ${Math.PI * (dim - ring * 2) * 0.3}`}
            strokeLinecap="round"
          />
        </svg>

        {/* Inner ring — red, slower + reverse */}
        <svg
          width={dim - ring * 3} height={dim - ring * 3}
          viewBox={`0 0 ${dim - ring * 3} ${dim - ring * 3}`}
          style={{
            position: 'absolute',
            top: ring * 1.5, left: ring * 1.5,
            animation: 'spin 1.6s linear infinite reverse',
          }}
        >
          <circle
            cx={(dim - ring * 3) / 2} cy={(dim - ring * 3) / 2}
            r={(dim - ring * 3) / 2 - ring}
            fill="none"
            stroke="#E8212B"
            strokeWidth={ring * 0.7}
            strokeDasharray={`${Math.PI * (dim - ring * 3 - ring * 2) * 0.4} ${Math.PI * (dim - ring * 3 - ring * 2) * 0.6}`}
            strokeLinecap="round"
          />
        </svg>

        {/* Center — logo */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img
            src={logo}
            alt=""
            style={{
              width: logoSize, height: logoSize,
              objectFit: 'contain',
              animation: 'pulseDot 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Text */}
      {size !== 'sm' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: 12, fontWeight: 600, color: '#1B4FD8',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            margin: 0, animation: 'pulseDot 2s ease-in-out infinite',
          }}>
            Loading
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 5 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 4, height: 4, borderRadius: '50%',
                background: '#1B4FD8', display: 'inline-block',
                animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}