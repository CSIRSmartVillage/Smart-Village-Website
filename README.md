<p align="center">
  <img src="client/src/assets/logos/SmartVillage.jpeg" alt="SMART Village logo" width="160" />
</p>

# CSIR SMART Village Website

The SMART Village website is a public-information and content-management platform for presenting village initiatives, scientific contributions, programme updates, and approved public resources in a clear and accessible format.

This repository contains the website frontend and its supporting application server. This public-facing README intentionally omits credentials, private infrastructure details, production data, internal operating procedures, and confidential documents.

## Public Website Features

- Programme overview, mission, objectives, leadership messages, and Monitoring Committee information
- CSIR nodal and participating laboratory profiles, including directors and scientific members
- Village-specific portals with development plans, events, maps, policies, indicators, and other approved modules
- Public Government Approval documents selected for website visibility
- News, announcements, success stories, videos, supporters, and contact information
- Responsive layouts for desktop, tablet, and mobile devices
- Content-driven pages that can be maintained through the authorized administration panel

## Administration Features

Authorized administrators can maintain website content, laboratories, village modules, media, news, events, supporters, and other public information. Administrative actions and non-public records are protected by the application's authentication and authorization controls.

Confidential records must never be exposed by public APIs or direct storage links. Visibility must be enforced by the server and storage layer in addition to the user interface.

## Technology Overview

- React-based responsive frontend
- Node.js and Express application server
- Database-backed content management
- Private object storage for managed files and media
- Authenticated administration area

Detailed production architecture, credentials, service identifiers, access rules, and deployment procedures are maintained separately in approved internal documentation.

## Repository Structure

```text
Smart_Village/
├── client/   # Public website and administration interface
└── server/   # Application API and content-management services
```

## Local Development

Install the frontend and server dependencies:

```bash
npm install --prefix client
npm install --prefix server
```

Authorized developers must obtain the required local environment configuration through the project's approved secure channel. Do not copy production secrets or production data into local configuration.

Start the server and frontend in separate terminals:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

## Verification

Before submitting a change, run the available frontend checks:

```bash
npm run lint --prefix client
npm run build --prefix client
```

Changes affecting protected content, file visibility, authentication, authorization, or public APIs require an additional security review by an authorized maintainer.

## Public Repository Security Policy

Never commit or publish:

- Passwords, tokens, API keys, private keys, certificates, or cloud credentials
- Environment files containing real configuration values
- Admin usernames, access instructions, session details, or authorization data
- Production hostnames, network topology, server access commands, or internal deployment procedures
- Database exports, backups, application logs, audit records, or user information
- Confidential Government Approval files or other non-public programme documents
- Personally identifiable information unless it is explicitly approved for publication

Use sanitized placeholders in examples. Store all operational secrets in the approved secret-management system, and share restricted documentation only through authorized internal channels.

If you discover a potential security issue, report it privately to the authorized project maintainer. Do not disclose vulnerabilities, credentials, or confidential records in a public issue or pull request.

## Content and Privacy

Only content approved for public release should be added to the public website or repository. Administrators are responsible for verifying publication rights, document visibility, image consent, accessibility, and the accuracy of public information before publishing.

## Contributing

Keep changes focused and preserve existing public content, accessibility, responsive behavior, and protected-data controls. Contributions are subject to review and approval by the project maintainers.

## Copyright

This project is maintained for the CSIR SMART Village initiative. All rights are reserved unless an authorized project representative states otherwise in writing.
