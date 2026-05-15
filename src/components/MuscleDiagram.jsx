const BODY   = '#2e2e2e';
const STROKE = '#444';
const LIME   = '#c8f135';
const LIMEGLOW = 'rgba(200,241,53,0.18)';

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

function Part({ id, targets, shape, d, cx, cy, rx, ry, x, y, w, h, rr = 5 }) {
  const on = targets.includes(id);
  const fill   = on ? LIME   : BODY;
  const stroke = on ? LIME   : STROKE;
  const sw     = on ? 1.5    : 1;
  const glow   = on ? LIMEGLOW : 'none';

  const shared = { fill, stroke, strokeWidth: sw };

  return (
    <>
      {on && shape === 'ellipse' && (
        <ellipse cx={cx} cy={cy} rx={rx + 5} ry={ry + 5} fill={glow} />
      )}
      {on && shape === 'rect' && (
        <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={rr + 4} fill={glow} />
      )}
      {on && shape === 'path' && (
        <path d={d} fill={glow} transform="scale(1.06) translate(-3.5,-3)" />
      )}
      {shape === 'ellipse' && <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...shared} />}
      {shape === 'rect'    && <rect x={x} y={y} width={w} height={h} rx={rr} {...shared} />}
      {shape === 'path'    && <path d={d} {...shared} />}
    </>
  );
}

export default function MuscleDiagram({ muscle }) {
  const targets = MUSCLE_MAP[muscle] || [];
  const P = (p) => <Part {...p} targets={targets} />;

  return (
    <svg viewBox="0 0 120 260" className="h-full w-full" aria-hidden>
      {/* Head */}
      <ellipse cx={60} cy={14} rx={11} ry={12} fill={BODY} stroke={STROKE} strokeWidth="1" />

      {/* Neck */}
      <rect x={55} y={25} width={10} height={8} rx={3} fill={BODY} stroke={STROKE} strokeWidth="1" />

      {/* Upper back (trapezius) */}
      <P id="back-l" shape="path" d="M42,33 L57,33 L55,57 L36,57 Z" />
      <P id="back-r" shape="path" d="M78,33 L63,33 L65,57 L84,57 Z" />

      {/* Shoulders */}
      <P id="shoulder-l" shape="ellipse" cx={31} cy={45} rx={12} ry={9} />
      <P id="shoulder-r" shape="ellipse" cx={89} cy={45} rx={12} ry={9} />

      {/* Chest */}
      <P id="chest" shape="path" d="M44,34 L76,34 L79,61 L41,61 Z" />

      {/* Core */}
      <P id="core" shape="rect" x={42} y={61} w={36} h={30} rr={5} />

      {/* Biceps (upper arms front) */}
      <P id="bicep-l"  shape="rect" x={19} y={48} w={13} h={38} rr={6} />
      <P id="bicep-r"  shape="rect" x={88} y={48} w={13} h={38} rr={6} />

      {/* Triceps (shown slightly offset, behind arms) */}
      <P id="tricep-l" shape="rect" x={16} y={50} w={9}  h={33} rr={4} />
      <P id="tricep-r" shape="rect" x={95} y={50} w={9}  h={33} rr={4} />

      {/* Lower arms */}
      <rect x={16} y={87} width={12} height={34} rx={5} fill={BODY} stroke={STROKE} strokeWidth="1" />
      <rect x={92} y={87} width={12} height={34} rx={5} fill={BODY} stroke={STROKE} strokeWidth="1" />

      {/* Glutes / hips */}
      <P id="glute" shape="path" d="M41,91 L79,91 L83,116 L37,116 Z" />

      {/* Quads */}
      <P id="quad-l" shape="rect" x={38} y={116} w={19} h={50} rr={8} />
      <P id="quad-r" shape="rect" x={63} y={116} w={19} h={50} rr={8} />

      {/* Knees */}
      <rect x={39} y={166} width={17} height={9}  rx={4} fill="#222" stroke={STROKE} strokeWidth="1" />
      <rect x={64} y={166} width={17} height={9}  rx={4} fill="#222" stroke={STROKE} strokeWidth="1" />

      {/* Calves */}
      <P id="calf-l" shape="rect" x={39} y={175} w={16} h={42} rr={7} />
      <P id="calf-r" shape="rect" x={65} y={175} w={16} h={42} rr={7} />

      {/* Feet */}
      <rect x={37} y={217} width={19} height={9} rx={4} fill={BODY} stroke={STROKE} strokeWidth="1" />
      <rect x={64} y={217} width={19} height={9} rx={4} fill={BODY} stroke={STROKE} strokeWidth="1" />
    </svg>
  );
}
