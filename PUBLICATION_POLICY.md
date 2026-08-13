# K-DRUM Public Publication Policy

This repository is a public technical-information repository. It is not a mirror of private K-DRUM development repositories.

## Publication principle

Public content must answer **what K-DRUM is, what it has historically supported, and what development areas are currently being pursued** without exposing unpublished implementation details.

## Allowed public content

- high-level capability descriptions
- public maturity labels such as ESTABLISHED, VALIDATED DEVELOPMENT, ACTIVE DEVELOPMENT, RELEASE CANDIDATE, and EXPERIMENTAL
- public roadmap statements
- references already available in public academic or institutional sources
- non-sensitive model-family and tool descriptions
- public website metadata, sitemap, robots directives, and model-card information

## Never publish

- production source code or executable packages
- private validation datasets or model inputs
- internal machine or user paths
- private branch names or commit identifiers
- exact internal failure codes or diagnostic logs
- unpublished solver tuning, recovery, or convergence parameters
- unpublished optimization objective functions
- sensitive reservoir or hydraulic-structure operation rules and data
- proprietary or restricted basin information
- secrets, tokens, credentials, private keys, or environment configuration
- unpublished numerical implementation details

## Private-to-public control model

The preferred control path is:

1. Private repositories remain private and are the engineering source of truth.
2. A dedicated structured **public-status control file** in a private repository contains only information already judged safe for possible publication.
3. The control file is validated automatically inside the private repository.
4. Public documents are updated only from whitelisted fields and public external references.
5. A public-content safety audit runs on changes to this repository.
6. Cross-repository automatic publishing is not enabled until a dedicated least-privilege credential and an explicit approval gate are configured.

## Approval rule

A successful engineering build, regression test, or merge does **not** automatically promote a feature to a stronger public maturity label. Public status changes require a separate publication decision.

## Future automation security requirements

If cross-repository publishing is enabled later:

- use a dedicated fine-grained credential scoped only to `KDRUM-Public` contents;
- store the credential only as a GitHub Actions secret in the private source repository;
- permit only whitelisted generated files to be changed;
- run the safety audit before publication;
- require an explicit manual approval or reviewed pull request before public merge;
- never copy commit messages, source trees, logs, artifacts, or validation directories from a private repository.

**Policy baseline:** 2026-08-13
