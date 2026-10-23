# motion

Small scroll and reveal helpers shared by the Motifs pages. All of them are safe to render on the server, clean up after themselves, and do nothing when the visitor prefers reduced motion.

| API                      | Purpose                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| `[mtReveal]`             | Fades and lifts an element in the first time it scrolls into view                            |
| `[mtStagger]`            | Delays the `mtReveal` elements inside it one after another                                   |
| `[mtParallax]`           | Moves an element at a fraction of the scroll speed, on a native view timeline when available |
| `[mtScrollProgress]`     | Exposes a section's scroll progress (0–1) as `--mt-scroll-progress` and a signal             |
| `prefersReducedMotion()` | Signal of the visitor's reduced-motion setting                                               |

Pages tune the reveal through `--mt-reveal-duration`, `--mt-reveal-easing` and `--mt-reveal-distance` in their theme.

Run `nx test motion` for the unit tests.
