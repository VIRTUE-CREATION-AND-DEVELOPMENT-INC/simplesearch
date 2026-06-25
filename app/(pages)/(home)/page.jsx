import styles from "./page.module.css";
import { homeContent } from "./content";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  Button,
  Field,
  FilterPill,
  JobCard,
  JobListStates,
  Section,
  StatusBadge,
} from "@/components/design-system";

export const metadata = createPageMetadata({
  title: "Home",
  description: homeContent.description,
  path: "/",
});

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{homeContent.hero.eyebrow}</p>
          <h1>{homeContent.hero.title}</h1>
          <p className={styles.heroDescription}>{homeContent.hero.description}</p>
          <div className={styles.heroActions}>
            <Button>Search roles</Button>
            <Button variant="ghost">View saved</Button>
          </div>
        </div>

        <div className={styles.searchPanel} aria-label={homeContent.search.title}>
          <div className={styles.panelHeader}>
            <div>
              <h2>{homeContent.search.title}</h2>
              <p>{homeContent.search.description}</p>
            </div>
            <StatusBadge tone="success">Ready</StatusBadge>
          </div>
          <form className={styles.searchForm}>
            <Field
              label="Role or keyword"
              name="query"
              placeholder={homeContent.search.fields.query}
            />
            <Field
              label="Location"
              name="location"
              placeholder={homeContent.search.fields.location}
            />
            <Field label="Work mode" name="mode" as="select" defaultValue="Remote">
              {homeContent.search.fields.mode.map((mode) => (
                <option key={mode}>{mode}</option>
              ))}
            </Field>
            <div className={styles.formActions}>
              <Button type="submit">{homeContent.search.primaryAction}</Button>
              <Button variant="ghost">{homeContent.search.secondaryAction}</Button>
            </div>
          </form>
        </div>

        <dl className={styles.metrics}>
          {homeContent.hero.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Section
        eyebrow={homeContent.filters.eyebrow}
        title={homeContent.filters.title}
        description={homeContent.filters.description}
        className={styles.filtersSection}
      >
        <div className={styles.filters}>
          {homeContent.filters.groups.map((filter) => (
            <FilterPill
              key={filter.label}
              count={filter.count}
              selected={filter.selected}
            >
              {filter.label}
            </FilterPill>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={homeContent.jobs.eyebrow}
        title={homeContent.jobs.title}
        description={homeContent.jobs.description}
        className={styles.resultsSection}
      >
        <div className={styles.resultsLayout}>
          <div className={styles.jobList}>
            {homeContent.jobs.list.map((job, index) => (
              <JobCard job={job} key={job.title} selected={index === 0} />
            ))}
          </div>

          <aside className={styles.detailPanel} aria-label={homeContent.details.title}>
            <p className={styles.eyebrow}>{homeContent.details.eyebrow}</p>
            <h2>{homeContent.details.title}</h2>
            <p>{homeContent.details.description}</p>
            <ul>
              {homeContent.details.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <Section
        eyebrow={homeContent.states.eyebrow}
        title={homeContent.states.title}
        description={homeContent.states.description}
        className={styles.statesSection}
      >
        <JobListStates states={homeContent.states.list} />
      </Section>
    </main>
  );
}
