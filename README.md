# Axigen Mailbox API for ActivePieces

This piece provides integration of the [Axigen Mailbox API](https://www.axigen.com/documentation/mailbox-api-rest-documentation-p666927108) with [ActivePieces](https://activepieces.com).

## Authentication

For simplicity, this pieces uses the [Bacic authentication](https://www.axigen.com/documentation/mailbox-api-authentication-and-authorization-p773357577).

You will need:

- Your Axigen server URL
- Your email address
- Your password

## Triggers

- **New Email Received:** will trigger a flow when a new email is received.

## Actions

- **Copy Mail:** copies a mail from one folder to another.
- **Delete Mail:** deletes a mail.
- **Move Mail:** moves a mail from one folder to another.
- **Update Mail:** updates a mail (read status, flagged).

## Development

This piece was tested against a self-hosted ActivePieces instance (v0.50.2).

## Support

For support or bug reports, please open an issue or pull request on https://github.com/simonc/piece-axigen.
