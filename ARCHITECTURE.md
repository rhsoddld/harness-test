# Architecture Map

このリポジトリは、実装コードより先にエージェントが迷わない足場を作る。
将来アプリケーションコードを追加するときは、固定された境界と依存方向を先に決める。

## Intended Layers

依存方向は原則として下から上へ一方向にする。

1. `types`: ドメイン型、スキーマ、境界で受け取るデータ形状。
2. `config`: 環境設定と feature flags。
3. `repositories`: 外部 I/O、永続化、API client。
4. `services`: ドメインロジックとユースケース。
5. `runtime`: 起動、ジョブ、CLI、HTTP handlers。
6. `ui`: 画面、操作、表示。

## Boundary Rules

- 境界では入力を検証し、内部では検証済みデータを扱う。
- 横断関心事は provider/interface を通す。
- 共有 utility は明確な所有場所を持つ。
- 同じ意味の helper を複製せず、既存 utility を優先する。
- ルール違反が繰り返される場合は、ドキュメントではなく lint/test/hook に昇格する。

## Current Scope

現時点ではアプリ本体は未作成。
この初期構成は、エージェント運用、docs ナレッジベース、Git/Husky フックの土台を提供する。
