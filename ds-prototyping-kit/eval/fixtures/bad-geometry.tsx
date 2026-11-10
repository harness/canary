export function BadGeometry(): JSX.Element {
  return (
    <div>
      <div style={{ width: 720 }}>fixed inline width</div>
      <div style={{ maxWidth: '40rem', height: 200 }}>fixed inline max-width and height</div>
      <div className="w-[720px]">arbitrary width class</div>
    </div>
  )
}
