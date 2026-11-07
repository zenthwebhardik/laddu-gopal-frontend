const services = [
  { title: 'Main gate', desc: 'Ghar ka bada gate — single ya double, jaali, cut design ya saada patti wala.' },
  { title: 'Sliding gate', desc: 'Jahan khulne ki jagah kam ho, wahan patri par chalne wala gate.' },
  { title: 'Seedhi aur balcony railing', desc: 'Seedhi, balcony aur chhat ki railing, design aur naap ke hisaab se.' },
  { title: 'Window grill', desc: 'Khidki aur ventilator ki grill — suraksha ke liye, design ke saath.' },
  { title: 'Shed aur dhancha', desc: 'Tin shed, parking shed aur chhote steel structure.' },
  { title: 'Welding repair', desc: 'Purane gate, grill ya railing ki marammat aur badlaav.' },
];

export default function Services() {
  return (
    <section className="section section--plate" id="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <h2 id="services-title">Kya kya banta hai</h2>
          <p>Har kaam aapke naap aur design se banta hai. Pasand ka design na mile to photo bhej dijiye.</p>
        </div>

        <div className="service-list" id="services-grid">
          {services.map((s, i) => (
            <div className="service-row" id={`service-card-${i}`} key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
