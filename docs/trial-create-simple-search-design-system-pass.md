# Trial Draft: Simple Search Design System Baseline

## Scope

Create a stable UI foundation for job discovery. The baseline defines shared visual tokens, reusable components, route composition, and state treatments for search, filtering, result scanning, saved jobs, selected jobs, and list feedback.

## Components

- `Button`: primary, secondary, ghost, disabled, hover, focus, and active states.
- `Field`: text/select controls with label, hint, disabled, focus, and error styling.
- `FilterPill`: count and selected states for result filtering.
- `StatusBadge`: neutral, info, success, warning, and danger treatments.
- `Section`: reusable section header pattern for public app surfaces.
- `JobCard`: readable result summary with selected and saved affordances.
- `JobListStates`: loading, empty, and error result states.

## Layout Principles

- Keep the first screen focused on job search rather than generic marketing.
- Use a restrained green, clay, and neutral palette for calm job-review workflows.
- Keep detail content beside the list on desktop and stacked below on smaller screens.
- Preserve stable card and state dimensions so loading, empty, error, selected, and saved states do not shift the interface.
