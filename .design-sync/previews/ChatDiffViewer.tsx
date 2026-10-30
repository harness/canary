import * as React from 'react'
import { ChatDiffViewer } from '@harnessio/ui'

const diff = `diff --git a/webhook.go b/webhook.go
index 3f2a1b0..9c8d7e4 100644
--- a/webhook.go
+++ b/webhook.go
@@ -10,7 +10,9 @@ func handle() {
 	ctx := context.Background()
 	req, err := parse(r)
-	if err != nil {
-		return err
-	}
+	if err != nil {
+		log.Error(err)
+		return fmt.Errorf("parse webhook: %w", err)
+	}
 	return deploy(ctx, req)
 }
`

export function Unified() {
  return (
    <div style={{ width: 640, padding: 16 }}>
      <ChatDiffViewer data={diff} fileName="webhook.go" lang="go" />
    </div>
  )
}
