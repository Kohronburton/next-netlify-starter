import Head from 'next/head'
import { useMemo, useState } from 'react'

const menu = [
  { id: 'chicken', name: 'Herb Roasted Chicken', yield: 10, unit: 'portions', ingredients: [
    ['Chicken breasts', 10, 'each'], ['Olive oil', 0.5, 'cup'], ['Garlic', 8, 'cloves'], ['Fresh herbs', 0.25, 'cup']
  ]},
  { id: 'pasta', name: 'Creamy Tuscan Pasta', yield: 12, unit: 'portions', ingredients: [
    ['Penne pasta', 3, 'lb'], ['Heavy cream', 1.5, 'qt'], ['Parmesan', 1.25, 'lb'], ['Spinach', 1.5, 'lb']
  ]},
  { id: 'salad', name: 'Market Greens Salad', yield: 15, unit: 'portions', ingredients: [
    ['Mixed greens', 2.5, 'lb'], ['Cherry tomatoes', 2, 'pt'], ['Cucumber', 3, 'each'], ['Vinaigrette', 2, 'cup']
  ]}
]

const phases = [
  { name: 'Cold prep', owner: 'Maya', start: '8:00 AM', status: 'Ready' },
  { name: 'Hot production', owner: 'Luis', start: '10:30 AM', status: 'Blocked' },
  { name: 'Pack & label', owner: 'Jordan', start: '1:15 PM', status: 'Pending' },
  { name: 'Load vehicle', owner: 'Sam', start: '2:20 PM', status: 'Pending' }
]

function round(value) {
  return Math.round(value * 100) / 100
}

export default function Home() {
  const [guests, setGuests] = useState(85)
  const [buffer, setBuffer] = useState(8)
  const [selected, setSelected] = useState(menu.map((item) => item.id))
  const [activeTab, setActiveTab] = useState('prep')
  const [generatedAt, setGeneratedAt] = useState('Today, 9:42 PM')

  const productionGuests = Math.ceil(guests * (1 + buffer / 100))

  const prepRows = useMemo(() => {
    return menu
      .filter((item) => selected.includes(item.id))
      .flatMap((item) => {
        const scale = productionGuests / item.yield
        return item.ingredients.map(([ingredient, qty, unit]) => ({
          dish: item.name,
          ingredient,
          quantity: round(qty * scale),
          unit
        }))
      })
  }, [productionGuests, selected])

  const warnings = [
    productionGuests > 100 ? 'Guest count exceeds the small-event staffing threshold.' : null,
    selected.length < 2 ? 'Menu has fewer than two active production items.' : null,
    'Hot holding cabinet capacity should be confirmed before 11:00 AM.'
  ].filter(Boolean)

  const toggleDish = (id) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const regenerate = () => {
    setGeneratedAt(new Date().toLocaleString([], { hour: 'numeric', minute: '2-digit' }))
  }

  const exportPrep = () => {
    const header = 'Dish,Ingredient,Quantity,Unit\n'
    const body = prepRows.map((row) => `"${row.dish}","${row.ingredient}",${row.quantity},${row.unit}`).join('\n')
    const blob = new Blob([header + body], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'harbor-foundry-prep-list.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <Head>
        <title>ServiceFlow Catering Operations</title>
        <meta name="description" content="AI-assisted catering logistics operations demo" />
      </Head>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <strong>ServiceFlow</strong>
            <span>Catering operations</span>
          </div>
        </div>

        <nav>
          {['Dashboard', 'Events', 'Production', 'Recipes', 'Workspace Sync'].map((item, index) => (
            <button key={item} className={index === 1 ? 'nav-item active' : 'nav-item'}>{item}</button>
          ))}
        </nav>

        <div className="integration-card">
          <div className="status-dot" />
          <div>
            <strong>Google Workspace</strong>
            <span>Sheets synced 4 min ago</span>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">LIVE EVENT WORKSPACE</span>
            <h1>Harbor & Foundry Annual Dinner</h1>
            <p>Saturday · 6:00 PM service · Waterfront Gallery</p>
          </div>
          <div className="top-actions">
            <button className="button secondary" onClick={exportPrep}>Export prep list</button>
            <button className="button primary" onClick={regenerate}>Regenerate instructions</button>
          </div>
        </header>

        <section className="metrics-grid">
          <article className="metric"><span>Confirmed guests</span><strong>{guests}</strong><small>Editable from event sheet</small></article>
          <article className="metric"><span>Production count</span><strong>{productionGuests}</strong><small>{buffer}% safety buffer included</small></article>
          <article className="metric"><span>Menu items</span><strong>{selected.length}</strong><small>{prepRows.length} ingredient lines</small></article>
          <article className="metric danger"><span>Open warnings</span><strong>{warnings.length}</strong><small>1 requires operations review</small></article>
        </section>

        <section className="content-grid">
          <div className="main-column">
            <article className="panel event-controls">
              <div className="panel-heading">
                <div><span className="eyebrow">DETERMINISTIC INPUTS</span><h2>Event setup</h2></div>
                <span className="pill success">Source locked</span>
              </div>
              <div className="form-grid">
                <label>Guest count<input type="number" min="1" value={guests} onChange={(e) => setGuests(Number(e.target.value || 0))} /></label>
                <label>Production buffer<input type="number" min="0" max="30" value={buffer} onChange={(e) => setBuffer(Number(e.target.value || 0))} /></label>
                <label>Service style<select defaultValue="Plated"><option>Plated</option><option>Buffet</option><option>Stations</option></select></label>
              </div>
              <div className="menu-pills">
                {menu.map((item) => (
                  <button key={item.id} onClick={() => toggleDish(item.id)} className={selected.includes(item.id) ? 'menu-chip selected' : 'menu-chip'}>{item.name}</button>
                ))}
              </div>
            </article>

            <article className="panel output-panel">
              <div className="panel-heading split">
                <div>
                  <span className="eyebrow">CONTROLLED AI OUTPUT</span>
                  <h2>Operations package</h2>
                  <p>Generated from fresh event data · {generatedAt}</p>
                </div>
                <span className="pill success">Schema valid</span>
              </div>

              <div className="tabs">
                {['prep', 'assembly', 'timeline'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'tab active' : 'tab'}>{tab}</button>
                ))}
              </div>

              {activeTab === 'prep' && (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Dish</th><th>Ingredient</th><th>Quantity</th><th>Unit</th></tr></thead>
                    <tbody>{prepRows.map((row, index) => <tr key={`${row.dish}-${row.ingredient}-${index}`}><td>{row.dish}</td><td>{row.ingredient}</td><td>{row.quantity}</td><td>{row.unit}</td></tr>)}</tbody>
                  </table>
                </div>
              )}

              {activeTab === 'assembly' && (
                <div className="instruction-list">
                  <div><span>01</span><p><strong>Stage by service zone.</strong> Separate cold items, hot mains, and finishing ingredients before assembly begins.</p></div>
                  <div><span>02</span><p><strong>Build in batches of 20.</strong> Label every completed batch with item, count, allergen flag, and service destination.</p></div>
                  <div><span>03</span><p><strong>Hold temperature-sensitive items.</strong> Hot foods remain above 140°F; chilled foods remain below 41°F.</p></div>
                  <div><span>04</span><p><strong>Run final QA.</strong> Match packed quantity against the deterministic production count before loading.</p></div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="timeline-list">
                  {phases.map((phase) => <div key={phase.name}><span className={`timeline-dot ${phase.status.toLowerCase()}`} /><div><strong>{phase.name}</strong><p>{phase.owner} · {phase.start}</p></div><span className="phase-status">{phase.status}</span></div>)}
                </div>
              )}
            </article>
          </div>

          <aside className="right-column">
            <article className="panel health-card">
              <div className="panel-heading"><div><span className="eyebrow">SYSTEM HEALTH</span><h2>Run quality</h2></div><strong className="score">96%</strong></div>
              <div className="health-row"><span>Source data</span><b>Valid</b></div>
              <div className="health-row"><span>Calculation engine</span><b>Passed</b></div>
              <div className="health-row"><span>Output schema</span><b>Passed</b></div>
              <div className="health-row"><span>Long-chat dependency</span><b className="green">Removed</b></div>
            </article>

            <article className="panel warnings-card">
              <div className="panel-heading"><div><span className="eyebrow">REVIEW QUEUE</span><h2>Warnings</h2></div></div>
              {warnings.map((warning, index) => <div className="warning" key={warning}><span>{index + 1}</span><p>{warning}</p></div>)}
            </article>

            <article className="panel architecture-card">
              <span className="eyebrow">WHY THIS WORKS</span>
              <h2>Claude is one controlled layer</h2>
              <p>Google Sheets remains the source of truth. Quantities are calculated in application code. Claude generates only language-heavy instructions from a fresh, bounded request.</p>
              <div className="architecture-flow"><span>Sheets</span><i>→</i><span>Rules engine</span><i>→</i><span>Claude</span><i>→</i><span>Validated output</span></div>
            </article>
          </aside>
        </section>
      </main>
    </div>
  )
}
