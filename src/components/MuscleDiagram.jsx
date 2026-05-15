// Geometric body silhouette — highlighted muscle shown in lime.
const BODY = '#242424';
const STROKE = '#333';
const LIME = '#c8f135';
const DIM = '#1a1a1a';

function Part({ d, muscle, targets, rx, ry, cx, cy, x, y, w, h, shape = 'rect' }) {
  const active = targets.includes(muscle);
  const fill = active ? LIME : BODY;
  const opacity = active ? 1 : 0.85;

  if (shape === 'circle')
    return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={STROKE} strokeWidth="1" opacity={opacity} />;
  if (shape === 'path')
    return <path d={d} fill={fill} stroke={STROKE} strokeWidth="1" opacity={opacity} />;
  return <rect x={x} y={y} width={w} height={h} rx={rx || 5} fill={fill} stroke={STROKE} strokeWidth="1" opacity={opacity} />;
}

// Which SVG body parts light up per muscle group
const MUSCLE_MAP = {
  chest:     ['chest'],
  back:      ['back-l', 'back-r'],
  shoulders: ['shoulder-l', 'shoulder-r'],
  biceps:    ['bicep-l', 'bicep-r'],
  triceps:   ['tricep-l', 'tricep-r'],
  legs:      ['quad-l', 'quad-r'],
  glutes:    ['glute'],
  calves:    ['calf-l', 'calf-r'],
  core:      ['core'],
};

export default function MuscleDiagram({ muscle }) {
  const targets = MUSCLE_MAP[muscle] || [];

  const P = (props) => <Part {...props} targets={targets} />;

  return (
    <svg viewBox="0 0 120 265" className="h-full w-full" aria-hidden>
      {/* ── Head ── */}
      <P shape="circle" muscle="head" cx={60} cy={14} rx={11} ry={12} />

      {/* ── Neck ── */}
      <rect x={55} y={25} width={10} height={9} rx={3} fill={BODY} stroke={STROKE} strokeWidth="1" />

      {/* ── Trapezius / upper back area behind shoulders ── */}
      <P shape="path" muscle="back-l" d="M42,34 L56,34 L54,58 L36,58 Z" />
      <P shape="path" muscle="back-r" d="M78,34 L64,34 L66,58 L84,58 Z" />

      {/* ── Shoulders (deltoids) ── */}
      <P shape="circle" muscle="shoulder-l" cx={32} cy={46} rx={12} ry={9} />
      <P shape="circle" muscle="shoulder-r" cx={88} cy={46} rx={12} ry={9} />

      {/* ── Chest ── */}
      <P shape="path" muscle="chest" d="M44,35 L76,35 L79,62 L41,62 Z" />

      {/* ── Core / Abs ── */}
      <P shape="rect" muscle="core" x={42} y={62} w={36} h={32} rx={4} />

      {/* ── Upper arms (biceps front / triceps sides) ── */}
      <P shape="rect" muscle="bicep-l"  x={18} y={50} w={13} h={38} rx={6} />
      <P shape="rect" muscle="bicep-r"  x={89} y={50} w={13} h={38} rx={6} />
      <P shape="rect" muscle="tricep-l" x={16} y={52} w={8}  h={34} rx={4} />
      <P shape="rect" muscle="tricep-r" x={96} y={52} w={8}  h={34} rx={4} />

      {/* ── Lower arms ── */}
      <rect x={15} y={89} width={12} height={36} rx={5} fill={BODY} stroke={STROKE} strokeWidth="1" opacity={0.7} />
      <rect x={93} y={89} width={12} height={36} rx={5} fill={BODY} stroke={STROKE} strokeWidth="1" opacity={0.7} />

      {/* ── Hips / Glutes ── */}
      <P shape="path" muscle="glute" d="M41,94 L79,94 L82,118 L38,118 Z" />

      {/* ── Quads (upper legs) ── */}
      <P shape="rect" muscle="quad-l" x={39} y={118} w={18} h={52} rx={7} />
      <P shape="rect" muscle="quad-r" x={63} y={118} w={18} h={52} rx={7} />

      {/* ── Knees ── */}
      <rect x={40} y={170} width={16} height={10} rx={5} fill={DIM} stroke={STROKE} strokeWidth="1" opacity={0.6} />
      <rect x={64} y={170} width={16} height={10} rx={5} fill={DIM} stroke={STROKE} strokeWidth="1" opacity={0.6} />

      {/* ── Calves ── */}
      <P shape="rect" muscle="calf-l" x={40} y={180} w={15} h={44} rx={6} />
      <P shape="rect" muscle="calf-r" x={65} y={180} w={15} h={44} rx={6} />

      {/* ── Feet ── */}
      <rect x={38} y={224} width={18} height={10} rx={4} fill={BODY} stroke={STROKE} strokeWidth="1" opacity={0.6} />
      <rect x={64} y={224} width={18} height={10} rx={4} fill={BODY} stroke={STROKE} strokeWidth="1" opacity={0.6} />

      {/* Lime glow under highlighted parts */}
      {targets.length > 0 && (
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      )}
    </svg>
  );
}
