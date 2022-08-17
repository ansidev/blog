import { createBuilder, PipelineStage } from "@yankeeinlondon/builder-api"
import Toc from 'markdown-it-toc-done-right'

const tocBuilder = createBuilder('toc', PipelineStage.parser)
  .options()
  .initializer()
  .handler(
      async (payload, _) => {
        payload.parser.use(Toc)
        payload.md = '[[toc]]\n\n' + payload.md
        return payload
      }
  )
  .meta()

export default tocBuilder
