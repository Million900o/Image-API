import { Meme } from '.'

export default {
  name: 'amiajoke',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => api.utils.validateUrl(d.url),
  exec: async (api, { url }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('amiajoke')

    await api.utils.drawImageFromUrl(ctx, url, 900, 140, 700, 700)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
