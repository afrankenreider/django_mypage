const PHOTO_ID = 'photo-1771140738204-d2d420467105'
const PHOTO_PAGE = 'https://unsplash.com/photos/snowy-mountains-under-a-pink-and-purple-sky-ICGLZJFws5M'
const PHOTOGRAPHER = { name: 'Janis Kloter', url: 'https://unsplash.com/@janis_photography' }
const WIDTHS = [800, 1200, 1800, 2400]

const photoUrl = (width: number) =>
  `https://images.unsplash.com/${PHOTO_ID}?auto=format&fit=crop&w=${width}&q=75`

/**
 * A mountain view seen through black-steel window framing: an outer frame,
 * two mullions, and a transom, after the floor-to-ceiling glass of a modern
 * lodge. The photo drifts slightly as the window scrolls past. Credits the
 * photographer per the Unsplash License.
 */
export default function PictureWindow() {
  return (
    <figure className="on-scroll">
      <div className="picture-window">
        <img
          src={photoUrl(1800)}
          srcSet={WIDTHS.map((width) => `${photoUrl(width)} ${width}w`).join(', ')}
          sizes="(min-width: 1152px) 1104px, calc(100vw - 2.5rem)"
          width={1800}
          height={1012}
          loading="lazy"
          decoding="async"
          alt="Snow-covered mountain peaks under a pink and lavender dusk sky, with a dark line of pines below."
          className="picture-window-photo"
        />
        <span aria-hidden="true" className="picture-window-glass" />
        <span aria-hidden="true" className="picture-window-mullion" style={{ left: '33.333%' }} />
        <span aria-hidden="true" className="picture-window-mullion" style={{ left: '66.666%' }} />
        <span aria-hidden="true" className="picture-window-transom" />
      </div>
      <figcaption className="mt-3 text-right text-xs text-muted">
        Photo by{' '}
        <a href={PHOTOGRAPHER.url} className="underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
          {PHOTOGRAPHER.name}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>{' '}
        on{' '}
        <a href={PHOTO_PAGE} className="underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
          Unsplash
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  )
}
