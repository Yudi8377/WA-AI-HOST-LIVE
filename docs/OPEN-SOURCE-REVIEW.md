# Open-source review

Status: candidate assessment, not legal advice. Recheck exact tags, LICENSE files, notices, dependency licenses and commercial/enterprise directories at integration time.

| Candidate | License assessment | Best fit | Decision |
|---|---|---|---|
| pg-boss | MIT (verify exact version) | PostgreSQL-backed background jobs/retries | Test first; not yet integrated |
| LangGraph.js | MIT (verify exact version) | Stateful multi-step agent workflows | Optional; start with simple typed orchestration |
| Chatwoot | MIT (verify exact version and bundled assets) | Inbox UX, assignment, human handoff patterns | Reference patterns; do not import whole Rails app |
| Novu | Mixed licensing across repository areas/versions | Notifications | Defer; inspect applicable commercial terms |
| Typebot | Usage restrictions beyond a simple permissive MIT grant in relevant versions | Form/conversation flows | Do not treat as unrestricted MIT dependency |
| Flowise | Apache-2.0 with project-specific conditions and potentially differently licensed folders | Visual AI flow builder | Not a default dependency; review exact terms first |

## Integration checklist
- [ ] Pin exact tag/commit and archive license text.
- [ ] Inspect root/nested LICENSE and NOTICE files, package licenses and asset/font licenses.
- [ ] Check transitive dependencies and security advisories.
- [ ] Decide whether code is copied, adapted, linked as a dependency, or used only as reference.
- [ ] Preserve required copyright/license notices.
- [ ] Check network use, hosted SaaS distribution, trademarks and enterprise folders for additional terms.
- [ ] Track updates and attribution in THIRD-PARTY-NOTICES.md.

Do not merge whole products solely because they are open source. Prefer a narrow library or implementing a small adapter. A dependency must pass compatibility, maintenance, security, license and cost review.