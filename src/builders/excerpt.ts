import { createBuilder, PipelineStage } from "@yankeeinlondon/builder-api"

const excerptBuilder = createBuilder('excerpt', PipelineStage.parser)
  .options()
  .initializer()
  .handler(
      async (payload, _) => {
        const excerpt = payload.excerpt?.replace(/[\r\n]/gm, '')
        payload.excerpt = excerpt
        payload.frontmatter.excerpt = excerpt
        return payload
      }
  )
  .meta()

export default excerptBuilder
