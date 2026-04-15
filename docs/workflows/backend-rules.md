# Backend Rules

- Define API boundary, request shape, response shape, and error shape before implementation.
- Validate external input at the boundary.
- Keep business logic outside transport handlers when the stack allows it.
- Add unit or integration checks for success and failure paths.
- Record any untested external-service behavior under `Not-tested`.
