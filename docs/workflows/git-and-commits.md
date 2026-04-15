# Git And Commit Rules

すべての commit は Lore Commit Protocol に従う。

## Shape

```text
<intent line: why the change was made, not what changed>

<body: narrative context>

Constraint: <external constraint>
Rejected: <alternative> | <reason>
Confidence: <low|medium|high>
Scope-risk: <narrow|moderate|broad>
Tested: <verification>
Not-tested: <known gaps>
```

## Minimum Accepted Trailers

- `Confidence:`
- `Scope-risk:`
- `Tested:` or `Not-tested:`

## Why

コミットは差分ラベルではなく、将来のエージェントが判断を再利用するための小さな decision record として扱う。
